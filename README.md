Hotel Excelsior
Sito web completo per un hotel: prenotazione camere con pagamento, prenotazione cene, form contatti con notifica email, e pannello amministrativo.
Progetto d'esame del corso Applicazioni Web, Mobile e Cloud — A.A. 2025/2026.

Tecnologie utilizzate
Layer	Stack
Frontend	React 18 + TypeScript + Vite + TailwindCSS
Backend	.NET 10 / ASP.NET Core Web API
Database	PostgreSQL (Neon cloud)
ORM	Entity Framework Core 10
Auth	JWT Bearer + BCrypt
Email	MailKit (SMTP Gmail)
Container	Docker + Docker Compose
CI/CD	GitHub Actions
Testing	xUnit + FluentAssertions + Moq
Architettura
Il backend è organizzato secondo i principi della Clean Architecture su quattro progetti .NET:

Backend-hotel-site/
├── Hotel.Site.Core            → Entità di dominio
├── Hotel.Site.Application     → Interfacce e servizi applicativi
├── Hotel.Site.Infrastructure  → EF Core, repository, servizi esterni
├── Hotel.Site.Api             → Controller REST, DTO, configurazione
└── Hotel.Site.Tests           → Test xUnit

Il frontend è una Single Page Application React servita da nginx, che funge anche da reverse proxy verso l'API backend.

Frontend-hotel-site/
└── src/
    ├── pages/                 → Pagine (Home, Camere, Cart, Admin, ...)
    ├── components/            → Componenti riutilizzabili
    ├── hooks/                 → Custom React hooks
    ├── layouts/               → Layout condivisi (AdminLayout)
    ├── context/               → React Context (BookingContext)
    ├── types/                 → Definizioni TypeScript
    └── lib/                   → API client, utility

Prerequisiti
Docker Desktop installato e avviato
File .env nella root del progetto con le credenziali (fornito separatamente)
Non serve installare .NET, Node, PostgreSQL o nessun altro strumento sulla macchina host: tutto gira in container.

Avvio rapido
# 1. Clona il repository
git clone https://github.com/riccardodilizio-art/Progetto-Applicazioni-Web-Mobile-e-Cloud.git
cd Progetto-Applicazioni-Web-Mobile-e-Cloud

# 2. Crea il file .env partendo dal template
cp .env.example .env
# ...e compilalo con le credenziali reali (vedi sezione Configurazione)

# 3. Avvia l'applicazione
docker compose up -d --build

Al termine dell'avvio (10-15 secondi):

Servizio	URL
Sito web	http://localhost:8080
API	http://localhost:8081
Documentazione API (Swagger)	http://localhost:8081/swagger
Credenziali di prova
Il database viene seminato al primo avvio con due utenti preconfigurati:

Ruolo	Email	Password
Amministratore	admin@hotelexcelsior.it	admin123
Cliente	cliente@hotelexcelsior.it	password123
⚠️ Queste credenziali sono solo per la demo locale. In un ambiente reale vanno cambiate immediatamente dopo il primo accesso.

Configurazione
Il file .env nella root contiene tutte le credenziali sensibili. È escluso dal repository tramite .gitignore. Parti da .env.example e compila i valori:

# Database PostgreSQL su Neon
DB_CONNECTION=Host=...neon.tech;Database=neondb;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true;Timeout=60;Command Timeout=60;Channel Binding=Disable;

# Chiave JWT (min 32 caratteri casuali)
Jwt__Key=stringa-random-di-almeno-32-caratteri

# URL del frontend (per i link nelle email di reset password)
App__FrontendUrl=http://localhost:8080

# SMTP Gmail (richiede 2FA attiva e una App Password)
Smtp__Host=smtp.gmail.com
Smtp__Port=587
Smtp__Username=...@gmail.com
Smtp__Password=app-password-16-caratteri
Smtp__FromEmail=...@gmail.com
Smtp__FromName=Hotel Excelsior
Smtp__AdminEmail=...@gmail.com

Funzionalità principali
Utente anonimo
Consulta camere con filtri per tipologia, capienza e disponibilità
Visualizza dettagli camera, galleria fotografica e servizi inclusi
Naviga il menu settimanale del ristorante
Invia messaggi tramite il form contatti
Cliente registrato
Registrazione con validazione password (min 8 caratteri, maiuscole + numeri)
Login con rate limiting e blocco account dopo 5 tentativi falliti
Prenotazione camere con controllo disponibilità in tempo reale
Carrello multi-prenotazione con check di disponibilità al checkout
Pagamento simulato con validazione Luhn della carta
Prenotazione cene con codice associato alla camera
Gestione profilo personale
Flusso "password dimenticata" via email con token sicuro
Amministratore
Dashboard unificata con layout condiviso
Gestione camere: CRUD completo + upload immagini
Gestione menu settimanale ristorante
Gestione prenotazioni camere e cene con filtri e cambio stato
Lettura messaggi ricevuti dal form contatti
Sicurezza
Misura	Implementazione
Password hashing	BCrypt (work factor 11)
Token JWT	Firmato con chiave HMAC-SHA256, validato su issuer/audience/lifetime
Reset password	Token 32-byte random, hashato SHA-256 nel DB, scadenza 30 min
Anti-enumerazione	Risposta 200 costante su /forgot-password
Rate limiting	FixedWindow partizionato per IP su login, register, contacts, forgot-password
Account lockout	15 min di blocco dopo 5 tentativi falliti
Transazione atomica	Prenotazione + pagamento in singola transazione EF Core con rollback
Validazione	DataAnnotations su tutti i DTO + validazione automatica [ApiController]
Exception handling	Middleware globale RFC 7807 application/problem+json
HTTP security headers	X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
Secrets	Esternalizzati in .env, mai committati
DataProtection	Chiavi persistite su volume Docker
XSS	React escape automatico + HtmlEncode lato server per template email
Endpoint API principali
Autenticazione
Metodo	Path	Descrizione
POST	/api/auth/register	Registrazione cliente
POST	/api/auth/login	Login cliente
POST	/api/auth/admin/login	Login amministratore
POST	/api/auth/forgot-password	Richiesta reset password
POST	/api/auth/reset-password	Conferma nuova password con token
Prenotazioni camere
Metodo	Path	Descrizione
GET	/api/reservations	Elenco paginato (admin)
GET	/api/reservations/user/{userId}	Prenotazioni di un utente
GET	/api/reservations/availability?idRoom=...&checkIn=...&checkOut=...	Check disponibilità singola camera
GET	/api/reservations/booked-rooms?checkIn=...&checkOut=...	Id delle camere occupate nel periodo
POST	/api/reservations	Crea prenotazione + pagamento in transazione atomica
PATCH	/api/reservations/{id}/status	Cambia stato (admin)
DELETE	/api/reservations/{id}	Elimina prenotazione
Pagamenti
Metodo	Path	Descrizione
GET	/api/payments/{id}	Dettaglio pagamento
POST	/api/payments/{id}/confirm	Conferma pagamento con validazione Luhn
Contatti
Metodo	Path	Descrizione
POST	/api/contacts	Invia messaggio (rate-limited, invia email admin)
GET	/api/contacts	Elenco paginato (admin)
Documentazione completa
La documentazione interattiva di tutti gli endpoint è disponibile su Swagger UI: http://localhost:8081/swagger

Comandi utili
# Avvio e stop
docker compose up -d --build          # avvia in background (rebuild)
docker compose up -d                  # avvia senza rebuild
docker compose down                   # ferma tutto
docker compose restart api            # riavvia solo l'API

# Log
docker compose ps                     # stato dei container
docker compose logs -f api            # log live del backend
docker compose logs -f frontend       # log live del frontend

# Rebuild mirato
docker compose build --no-cache api
docker compose build --no-cache frontend

Generare una nuova migration EF Core
Quando si modifica un'entità in Hotel.Site.Core/Entities/ o una Configurations/*.cs:

cd Backend-hotel-site
dotnet ef migrations add NomeMigration \
    --project Hotel.Site.Infrastructure \
    --startup-project Hotel.Site.Api

Le migration vengono applicate automaticamente al database all'avvio del container API (db.Database.Migrate() in Program.cs).

Eseguire i test
cd Backend-hotel-site
dotnet test

Sono presenti 13 test xUnit che coprono password hashing, servizio pagamenti, overlap prenotazioni e reset token.

Continuous Integration
Il repository include una pipeline GitHub Actions (.github/workflows/ci.yml) che ad ogni push e pull request esegue:

Frontend: npm ci + lint + build
Backend: dotnet restore + dotnet build + dotnet test
Lo stato della CI è visibile nella tab Actions del repository.

Troubleshooting
Il sito risponde 502 Bad Gateway
Il backend non è pronto oppure è crashato. Controlla i log:

docker compose logs api --tail 50

Cause tipiche: .env mancante, password Neon errata, migration fallita.

Al primo avvio vedo un 502 momentaneo
È normale: nginx parte più velocemente del backend. Aspetta 10-15 secondi e ricarica. Il backend sta applicando le migration e collegandosi a Neon.

Email non arriva
Verifica che:

Smtp__Password sia una App Password di Gmail (16 caratteri), non la password normale
La verifica in due passaggi sia attiva sull'account Google
Nei log del backend non compaia Invio email a ... fallito
Modifiche al codice non visibili
Ricompila e riavvia il container interessato:

docker compose build --no-cache api       # se hai toccato .NET
docker compose build --no-cache frontend  # se hai toccato React
docker compose up -d

Per il frontend fai anche hard refresh del browser (Ctrl+Shift+R).

Errore "PendingModelChangesWarning" all'avvio
Hai modificato un'entità o configurazione EF Core senza generare la migration. Vedi la sezione Generare una nuova migration.

Struttura del repository
.
├── Backend-hotel-site/              Progetti .NET (4 + test)
├── Frontend-hotel-site/             React + TypeScript + Vite
├── uploads/                         Immagini camere (condivise via volume)
├── docker-compose.yml               Orchestrazione dei container
├── .env                             Segreti (non committato)
├── .env.example                     Template delle variabili d'ambiente
├── .gitignore
├── README.md                        Questo file
├── Relazione.md                     Relazione tecnica del progetto
└── .github/workflows/ci.yml         Pipeline CI

Licenza e note
Progetto didattico realizzato per l'esame del corso "Applicazioni Web, Mobile e Cloud" dell'anno accademico 2025/2026.

Le credenziali presenti nei file di esempio e nel database seed sono solo per il testing locale.