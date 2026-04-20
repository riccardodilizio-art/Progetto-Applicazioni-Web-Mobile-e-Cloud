# Funzionalità aggiunte e scelte progettuali

In questa sezione vengono descritte le funzionalità introdotte nella fase finale dello sviluppo, insieme alle motivazioni che hanno guidato alcune scelte tecniche.

## Prenotazione e pagamento

Il sito permette ai clienti di prenotare una camera e successivamente confermare il pagamento tramite carta. All'inizio queste due operazioni erano trattate come due richieste al database separate: prima veniva salvata la prenotazione, poi veniva creato il relativo pagamento. Se qualcosa andava storto nel secondo passaggio, nel database restava una prenotazione "senza pagamento" che bloccava la camera per quelle date, impedendo qualunque nuovo tentativo da parte dello stesso utente o di altri.

Per risolvere il problema, le due operazioni sono state unite in una transazione unica. In pratica si dice al database "tieni da parte queste modifiche: le confermi tutte insieme solo se non ci sono errori, altrimenti le annulli tutte". In questo modo non può più esistere una prenotazione senza il suo pagamento.

Inoltre è stato aggiunto un meccanismo di "scadenza implicita": se un cliente inizia una prenotazione ma non completa il pagamento entro 15 minuti, la camera torna disponibile per altri senza bisogno di cancellare nulla manualmente. Questo evita che utenti distratti occupino stanze per tempo indefinito.

## Form di contatto

È stata realizzata la pagina "Contatti" del sito, da cui chiunque può inviare un messaggio all'hotel. Quando qualcuno invia il form, il messaggio viene salvato nel database e al tempo stesso una email di notifica viene mandata all'indirizzo dell'amministratore. L'invio email avviene in background, così l'utente riceve subito la conferma di invio anche se il server di posta fosse momentaneamente lento.

Per l'amministratore è stata creata una dashboard dedicata che mostra l'elenco di tutti i messaggi ricevuti, con una barra di ricerca per filtrarli per nome, email o contenuto. La pagina è accessibile solo dopo aver fatto login come amministratore.

## Modifica del profilo

Gli utenti registrati possono ora modificare il proprio profilo (nome, cognome, numero di telefono) direttamente dal sito, senza dover contattare un amministratore. Per motivi di sicurezza l'email non è modificabile da questa pagina: richiederebbe una procedura di verifica separata.

È stato inoltre aggiunto un controllo lato server che impedisce a un utente di modificare il profilo di qualcun altro: l'unico caso in cui è permesso è se chi sta facendo la modifica è un amministratore.

## Reset password dimenticata

È stato implementato il classico flusso "password dimenticata":

1. Dalla pagina di login l'utente clicca "Password dimenticata" e inserisce la sua email.
2. Il sistema genera un codice casuale, lo salva nel database e manda una email all'utente con un link del tipo `http://sito/reset-password?token=XYZ`.
3. Cliccando il link l'utente arriva su una pagina dove inserisce la nuova password.
4. Il sistema controlla che il codice sia ancora valido (scade dopo 30 minuti) e aggiorna la password.

Sono stati presi due accorgimenti particolari:

- Il codice non viene salvato in chiaro nel database: viene salvata solo una sua versione "sigillata" (hash). Così, anche se qualcuno riuscisse ad accedere al database, non potrebbe usarlo per cambiare le password di altri.
- Quando un utente inserisce un'email inesistente, il sistema risponde comunque con il messaggio "email inviata", senza rivelare se l'email è registrata o meno. Questo impedisce a malintenzionati di capire quali account esistono davvero nel sito.

## Protezione dallo spam

Alcuni endpoint sono pubblici e quindi potenzialmente esposti ad attacchi di spam: il form contatti e la richiesta di reset password. Per entrambi è stato attivato un limite di richieste per indirizzo IP: ad esempio, non è possibile inviare più di 5 contatti ogni 10 minuti dallo stesso IP. Oltre la soglia il server risponde con un messaggio di errore e blocca temporaneamente le nuove richieste.

Questa misura non elimina del tutto lo spam, ma lo rende abbastanza scomodo da scoraggiare bot e attacchi automatizzati.

## Gestione delle email

Per l'invio delle email è stata usata la libreria MailKit, che si collega al server SMTP di Gmail. Nel codice è stata definita un'interfaccia generica (`IEmailService`) che descrive il metodo "invia email", e un'implementazione concreta che la collega effettivamente a Gmail. Il vantaggio è che, se un domani si volesse usare un servizio diverso (ad esempio SendGrid o un server aziendale), basterebbe scrivere una nuova implementazione senza toccare il resto del codice.

## Sicurezza delle credenziali

Nella fase iniziale del progetto, la password del database e la chiave usata per firmare i token di login erano scritte direttamente nei file di configurazione caricati su GitHub. Questa pratica è sconsigliata: chiunque cloni il repository può leggerle.

Sono stati quindi spostati tutti i dati sensibili (password del database, chiave JWT, credenziali Gmail) in un file `.env` locale, che non viene caricato su GitHub. Chi vuole avviare il progetto deve creare il proprio `.env` seguendo le istruzioni del README.
