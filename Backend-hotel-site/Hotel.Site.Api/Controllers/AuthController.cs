using Hotel.Site.Api.DTOs.auth.Request;
using Hotel.Site.Api.DTOs.auth.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;


    public AuthController(
    IUserService userService,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService,
    IEmailService emailService,
    IConfiguration config,
    ILogger<AuthController> logger)
    {
        _userService = userService;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _emailService = emailService;
        _config = config;
        _logger = logger;
    }

    /// <summary>Autentica un cliente e restituisce un JWT.</summary>
    /// <response code="200">Credenziali valide, token restituito</response>
    /// <response code="401">Email o password errate</response>
    [HttpPost("login")]
    [EnableRateLimiting("auth-login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]

    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.Email);
        if (user == null)
        {
            _logger.LogWarning("Login fallito (utente inesistente) per {Email}", request.Email);
            return Unauthorized(new { message = "Email o password errati" });
        }

        if (user.LockoutExpiry != null && user.LockoutExpiry > DateTime.UtcNow)
        {
            _logger.LogWarning("Login bloccato per {Email} fino a {Expiry}", request.Email, user.LockoutExpiry);
            return StatusCode(StatusCodes.Status423Locked, new
            {
                message = $"Account bloccato per troppi tentativi falliti. Riprova dopo le {user.LockoutExpiry:HH:mm}."
            });
        }

        if (!_passwordHasher.Verify(request.Password, user.Password))
        {
            user.FailedLoginCount++;
            if (user.FailedLoginCount >= 5)
            {
                user.LockoutExpiry = DateTime.UtcNow.AddMinutes(15);
                user.FailedLoginCount = 0;
                _logger.LogWarning("Account {Email} bloccato per 15 minuti", request.Email);
            }
            await _userService.EditUserAsync(user);
            return Unauthorized(new { message = "Email o password errati" });
        }

        // login riuscito → reset contatori
        user.FailedLoginCount = 0;
        user.LockoutExpiry = null;
        await _userService.EditUserAsync(user);

        _logger.LogInformation("Login riuscito per {Email}", request.Email);
        var token = _jwtTokenService.GenerateToken(user);
        return Ok(new AuthResponse(
            user.IdUser, user.Nome, user.Cognome, user.Email, user.Ruolo.ToString(), token
        ));
    }

    /// <summary>Autentica un amministratore.</summary>
    /// <response code="200">Credenziali valide</response>
    /// <response code="401">Email o password errate</response>
    /// <response code="403">Utente non è admin</response>
    [HttpPost("admin/login")]
    [EnableRateLimiting("auth-login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]

    public async Task<IActionResult> AdminLogin([FromBody] LoginRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.Email);
        if (user == null || !_passwordHasher.Verify(request.Password, user.Password))
            return Unauthorized(new { message = "Email o password errati" });

        if (user.Ruolo != Role.ADMIN)
            return Forbid();

        var token = _jwtTokenService.GenerateToken(user);

        return Ok(new AuthResponse(
            user.IdUser, user.Nome, user.Cognome, user.Email, user.Ruolo.ToString(), token
        ));
    }

    /// <summary>Registra un nuovo utente cliente.</summary>
    /// <response code="201">Registrazione completata</response>
    /// <response code="409">Email già in uso</response>
    [HttpPost("register")]
    [EnableRateLimiting("auth-register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var existing = await _userService.GetUserByEmailAsync(request.Email);
        if (existing != null)
            return Conflict(new { message = "Email già registrata" });

        var user = new User
        {
            IdUser = Guid.NewGuid(),
            Nome = request.Nome,
            Cognome = request.Cognome,
            Email = request.Email,
            Password = _passwordHasher.Hash(request.Password),
            NumeroTelefono = request.NumeroTelefono,
            Ruolo = Role.CLIENT,
            DataCreazione = DateTime.UtcNow
        };

        await _userService.AddUserAsync(user);

        var token = _jwtTokenService.GenerateToken(user);
        _logger.LogInformation("Nuovo utente registrato: {Email}", user.Email);

        return Created("", new AuthResponse(
            user.IdUser, user.Nome, user.Cognome, user.Email, user.Ruolo.ToString(), token
        ));
    }

    /// <summary>Invia una email con un link per reimpostare la password (se l'email è registrata).</summary>
    /// <response code="200">Richiesta accettata</response>
    [HttpPost("forgot-password")]
    [EnableRateLimiting("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.Email);

        // Anti-enumerazione: rispondi sempre 200 anche se l'utente non esiste
        if (user != null)
        {
            var rawToken = GenerateSecureToken();
            user.ResetTokenHash = HashToken(rawToken);
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);
            await _userService.EditUserAsync(user);

            var frontendUrl = _config["App:FrontendUrl"] ?? "http://localhost:8080";
            var resetLink = $"{frontendUrl}/reset-password?token={rawToken}";

            var body = $@"
            <h2>Reset password</h2>
            <p>Ciao {System.Net.WebUtility.HtmlEncode(user.Nome)},</p>
            <p>Hai richiesto di reimpostare la password. Clicca il link qui sotto (valido 30 minuti):</p>
            <p><a href=""{resetLink}"">{resetLink}</a></p>
            <p>Se non hai fatto tu la richiesta, ignora questa email.</p>
        ";
            _ = _emailService.SendAsync(user.Email, "Reset password - Hotel Excelsior", body);
        }

        return Ok(new { message = "Se l'email è registrata, riceverai un link per reimpostare la password." });
    }

    /// <summary>Imposta una nuova password usando il token di reset ricevuto via email.</summary>
    /// <response code="200">Password aggiornata</response>
    /// <response code="400">Token scaduto o non valido</response>
    [HttpPost("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var tokenHash = HashToken(request.Token);
        var user = await _userService.GetUserByResetTokenHashAsync(tokenHash);

        if (user == null || user.ResetTokenExpiry == null || user.ResetTokenExpiry < DateTime.UtcNow)
            return BadRequest(new { message = "Link scaduto o non valido." });

        user.Password = _passwordHasher.Hash(request.Password);
        user.ResetTokenHash = null;
        user.ResetTokenExpiry = null;
        await _userService.EditUserAsync(user);

        return Ok(new { message = "Password aggiornata. Puoi accedere." });
    }

    private static string GenerateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return Convert.ToBase64String(bytes)
            .Replace("+", "-").Replace("/", "_").TrimEnd('=');
    }

    private static string HashToken(string token)
    {
        using var sha = SHA256.Create();
        var hash = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(hash);
    }

}
