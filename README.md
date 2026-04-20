# Hotel Excelsior

Sito web di un hotel: mostra le camere, permette a clienti registrati di prenotare stanze e cene, e fornisce un pannello di amministrazione per gestire tutto.

Progetto d'esame del corso "Applicazioni Web, Mobile e Cloud" — A.A. 2025/2026.

## Com'è fatto

Il progetto è diviso in due parti:

- **Frontend**: un'applicazione React con TypeScript. Gira nel browser.
- **Backend**: una Web API scritta in .NET 10. Gestisce login, prenotazioni, pagamenti e invio email.

I dati sono salvati su un database PostgreSQL ospitato su Neon (servizio cloud gratuito).
Tutto gira dentro container Docker: non serve installare nulla a parte Docker stesso.

## Cosa ti serve prima di iniziare

1. **Docker Desktop** installato e avviato.
2. Un **account Neon** (https://neon.tech) dove crei un database vuoto. Ti serve la connection string.
3. Un **account Gmail** con verifica in due passaggi attiva, per poter generare una App Password: serve per inviare le email di notifica e di reset password.

## Come si avvia

### 1. Scarica il progetto

```bash
git clone https://github.com/riccardodilizio-art/Progetto-Applicazioni-Web-Mobile-e-Cloud.git
cd Progetto-Applicazioni-Web-Mobile-e-Cloud
```

### 2. Crea il file `.env`

Nella cartella principale del progetto crea un file di testo chiamato esattamente `.env` (con il punto iniziale, senza estensione). Incolla dentro questo contenuto e sostituisci i valori tra le parentesi:

```
DB_CONNECTION=Host=<host-neon>;Database=neondb;Username=<user>;Password=<password>;SSL Mode=Require;Trust Server Certificate=true;Timeout=60;Command Timeout=60;Channel Binding=Disable;

Jwt__Key=<una-stringa-casuale-di-almeno-32-caratteri>

App__FrontendUrl=http://localhost:8080

Smtp__Host=smtp.gmail.com
Smtp__Port=587
Smtp__Username=<tuaemail>@gmail.com
Smtp__Password=<app-password-gmail-16-caratteri>
Smtp__FromEmail=<tuaemail>@gmail.com
Smtp__FromName=Hotel Excelsior
Smtp__AdminEmail=<email-dove-ricevere-le-notifiche>
```

Questo file contiene password vere e non va mai condiviso né caricato su GitHub. È già escluso dal repository.

### 3. Avvia tutto

```bash
docker compose up -d --build
```

La prima volta ci mette qualche minuto perché scarica le immagini Docker e compila il progetto. Al termine:

- **Sito web**: http://localhost:8080
- **API**: http://localhost:8081
- **Swagger** (documentazione API): http://localhost:8081/swagger

Al primo avvio il database Neon viene popolato automaticamente con le tabelle necessarie e due utenti di esempio.

### 4. Utenti di prova

| Ruolo | Email | Password |
|---|---|---|
| Amministratore | admin@hotel.local | admin123 |
| Cliente | mario.rossi@example.com | password123 |

## Cosa si può fare

**Utente anonimo**
- Vedere le camere disponibili e il menu del ristorante
- Registrarsi
- Inviare un messaggio dalla pagina Contatti

**Cliente registrato**
- Prenotare una camera (con pagamento simulato tramite carta)
- Prenotare una cena usando il codice della propria prenotazione
- Modificare il proprio profilo
- Richiedere il reset della password via email

**Amministratore**
- Gestire camere, menu e prenotazioni
- Leggere i messaggi ricevuti dal form contatti

## Comandi utili

```bash
docker compose up -d                  # avvia in background
docker compose down                   # ferma tutto
docker compose logs -f api            # vedi cosa fa il backend in tempo reale
docker compose build --no-cache api   # ricompila solo il backend (serve se hai modificato codice .NET)
```

## Se qualcosa non funziona

- **Il sito risponde 502 Bad Gateway**: il backend è crashato. Controlla i log con `docker compose logs api` per capire perché. Nella maggior parte dei casi è un problema di connessione al database o una variabile mancante in `.env`.
- **L'email non arriva**: verifica che `Smtp__Password` sia la "App Password" di Gmail (16 caratteri) e non la tua password normale, e che la verifica in due passaggi sia attiva sull'account.
- **Dopo aver modificato un'entità del backend**: bisogna generare una migration. Vedi più sotto.

## Modificare il database (migration)

Se aggiungi o cambi campi in una entità (dentro `Hotel.Site.Core/Entities`), devi creare una migration altrimenti il backend non si avvia.

```bash
cd Backend-hotel-site
dotnet ef migrations add NomeDellaModifica --project Hotel.Site.Infrastructure --startup-project Hotel.Site.Api
```

Poi ricostruisci l'API:
```bash
docker compose build --no-cache api
docker compose up -d
```

La migration viene applicata in automatico al database quando il container parte.

## Come sono organizzati i file

```
Backend-hotel-site/
├── Hotel.Site.Api/             → controller, DTO, configurazione
├── Hotel.Site.Application/     → interfacce e logica applicativa
├── Hotel.Site.Core/            → modelli di dominio (User, Room, ...)
└── Hotel.Site.Infrastructure/  → accesso al database e servizi esterni

Frontend-hotel-site/
└── src/
    ├── pages/                  → pagine del sito
    ├── components/             → componenti riutilizzabili
    ├── hooks/                  → funzioni riutilizzabili per React
    └── lib/apiClient.ts        → chiamate al backend

docker-compose.yml              → come avviare tutto
.env                            → segreti (non committato)
```
