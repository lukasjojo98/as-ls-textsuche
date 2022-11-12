## Vorbereitung um mit diesem Projekt zu arbeiten
- Installation der Versionierungssoftware [_git_](https://git-scm.com/)
- Installation der Laufzeitumgebung [_Node.js_](https://nodejs.org/de/)

## Projekt initialisieren  
1. Start eines Kommandozeilentools
2. Navigation ins Wurzelverzeichnis des Projekts
3. Abhängigkeiten mit dem Kommando `npm install` installieren
4. Spezifikation der Umgebungsvariablen zur Konfiguration des Servers und der Datenbankanbindung in einer **.env-Datei**

## Setzen der Umgebnugsvariablen für das lokale Arbeiten
Im Wurzelverzeichnis des Projekts ist ein Template für die erwartete **.env-Datei** gegeben.  
Es müssen folgende Informationen spezifiziert werden:  
`CONNECTION_STRING = <Der Connection-String nach dem Mutser mongodb+srv://username:passwort@hostname>` [siehe MongoDB Doku](https://docs.mongodb.com/drivers/node/current/fundamentals/connection/)  
`DB_NAME = <Name der Datenbank die benutzt werden soll>`  
`COLLECTION_NAME = <Name der Collection die benutzt werden soll>`  
`PORT = <Portnummer auf dem die lokale Serverinstanz addresiert werden soll>`  
`WEB_BENUTZERNAME = <Bentuzername gegen den man sich beim erstmaligen Aufruf der Webseite authentifizieren muss>`  
`WEB_PASSWORT = <Passwort gegen das man sich beim erstmaligen Aufruf der Webseite authentifizieren muss>`  
  
## Lokaler Serverstart  
Dies erfolgt mit dem Kommando `npm run dev`  
Der Sever ist über die Adresse `http://localhost:{PORT}` in einem Browser ansprechbar.

## Deployment zu Heroku  
Heroku ist eine Cloud-Plattform, die es erlaubt diese nodejs-basierte Anwendungen in die Cloud zu portieren.  
Das Deployment erfolgt auf Basis der Versionierungssoftware [_git_](https://devcenter.heroku.com/articles/git).

### Vorraussetungen
- Erstellung eines Accounts bei [_Heroku_](https://signup.heroku.com/)
- Isntallation der Versionierungssoftware _git_
- Ein lokales Git Repository muss für das Projekt existieren
- Installation der [_Heroku CLI_](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)

### Schrite für das erstmalige Deployment in einer Kommandozeile:
1. `heroku login` zur Authentifizierung bei Heroku
2. `heroku create` zur Erstellung einer leeren Anwendung in der Kommandozeile  
3.  Umgebungsvariablen in Heroku setzten 
4. `git push heroku main`zum Deployment des Codes

### Setzen der Umgebungsvariablen in Heroku
Folgende Umgebungsvariablen mussen mit dem Befehl `heroku config:set <VARIABLEN_NAME=VARIABLEN_WERT>` erzeugt werden:  
`CONNECTION_STRING=<Der Connection-String nach dem Muster mongodb+srv://username:passwort@hostname>` [siehe MongoDB Doku](https://docs.mongodb.com/drivers/node/current/fundamentals/connection/)  
`DB_NAME=<Name der Datenbank die benutzt werden soll>`  
`COLLECTION_NAME=<Name der Collection die benutzt werden soll>`  
`WEB_BENUTZERNAME=<Bentuzername gegen den man sich beim erstmaligen Aufruf der Webseite authentifizieren muss>`  
`WEB_PASSWORT=<Passwort gegen das man sich beim erstmaligen Aufruf der Webseite authentifizieren muss>`  
  