using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Site.Api.Controllers
{
    [ApiController]
    [Route("api/uploads")]
    public class UploadController : ControllerBase
    {
        private static readonly string[] AllowedContentTypes =
            new[] { "image/jpeg", "image/png", "image/webp" };

        private static readonly string[] AllowedExtensions =
            new[] { ".jpg", ".jpeg", ".png", ".webp" };

        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>Carica un'immagine associata alla camera (admin).</summary>
        /// <response code="200">Immagine caricata</response>
        /// <response code="400">File non valido (formato o dimensione)</response>
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [RequestSizeLimit(MaxFileSize)]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Nessun file ricevuto." });

            if (file.Length > MaxFileSize)
                return BadRequest(new { message = "File troppo grande (max 5 MB)." });

            if (!AllowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
                return BadRequest(new { message = "Formato non supportato. Usa JPEG, PNG o WebP." });

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                return BadRequest(new { message = "Estensione non supportata." });

            // Directory di destinazione: wwwroot/uploads/rooms
            var webRoot = _env.WebRootPath;
            if (string.IsNullOrEmpty(webRoot))
                webRoot = Path.Combine(_env.ContentRootPath, "wwwroot");

            var uploadsDir = Path.Combine(webRoot, "uploads", "rooms");
            Directory.CreateDirectory(uploadsDir);

            // Nome file univoco basato su GUID (previene collisioni e path traversal)
            var fileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(uploadsDir, fileName);

            await using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }

            // URL pubblico relativo (serve UseStaticFiles in Program.cs)
            var url = $"/uploads/rooms/{fileName}";
            return Ok(new { url });
        }
    }
}
