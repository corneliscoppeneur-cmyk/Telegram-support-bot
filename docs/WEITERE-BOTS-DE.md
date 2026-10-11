# Weitere Telegram-Serverless-Bots mit ChatGPT Work bauen

## Projekt in Work

Lege ein ChatGPT-Projekt namens **Telegram Serverless Bots** an. Es sammelt die gemeinsamen Quellen, Dateien und Projektanweisungen. Starte darin für jeden Bot einen eigenen Chat, zum Beispiel „Support-Bot“, „FAQ-Bot“ oder „Bestell-Bot“.

Ein ChatGPT-Projekt ist kein automatisch angebundener Ordner auf deinem Computer. Lade die benötigten Dateien hoch oder stelle sie über eine passende Verbindung bereit. Für die Codeprojekte wird außerdem ein separater Ordner und vorzugsweise ein eigenes GitHub-Repository pro Bot verwendet.

## Gemeinsame Quellen

- Telegram Serverless: https://core.telegram.org/bots/serverless
- Telegram Bot API: https://core.telegram.org/bots/api
- Telegram Mini Apps (falls benötigt): https://core.telegram.org/bots/webapps
- Telegram Stars für digitale Käufe (falls benötigt): https://core.telegram.org/bots/payments-stars
- Basisprojekt: https://github.com/corneliscoppeneur-cmyk/Telegram-support-bot
- ChatGPT-Projekte: https://learn.chatgpt.com/docs/projects?surface=app

Die aktuellen Telegram-Dokumente bei jedem neuen Umbau lesen. Ein bestehendes Repository kann nicht pauschal auf Serverless verschoben werden: Node.js-Bibliotheken, dauerhafte Prozesse, Dateisystemzugriffe, Telethon/MTProto und andere Laufzeitanforderungen müssen geprüft werden.

## Projektanweisungen zum Kopieren

> Wir bauen Telegram-Bots direkt für Telegram Serverless. Lies zuerst das bereitgestellte Repository einschließlich README und die aktuelle Dokumentation unter https://core.telegram.org/bots/serverless. Prüfe die Kompatibilität der Funktionen. Verwende die integrierte Bot API und Datenbank. Jeder Bot erhält einen eigenen Codeordner, eigene Zugangsdaten und vorzugsweise ein eigenes GitHub-Repository. Verändere andere laufende Bots nicht. Übernimm keine Tokens oder privaten Gruppen-IDs in öffentliche Dateien. Lies hochgeladene Konfigurationsdateien vollständig, ohne Geheimnisse auszugeben. Teste den Code und unterscheide lokale Simulation, Prüfung auf der Plattform und Live-Test. Bereite eine README auf Deutsch, danach Englisch und am Schluss mit technischen Anweisungen für KI-Assistenten vor. Arbeite bis zur konkreten, überprüfbaren Bereitstellung; melde tatsächliche Blockaden klar. Antworten kurz und auf Deutsch.

## Was du für jeden neuen Bot bereitstellst

1. Repository-Link oder ZIP mit dem Ausgangscode.
2. Aufgabe des Bots und die Funktionen, die erhalten bleiben sollen.
3. Eigenen Bot bei @BotFather mit aktiviertem Serverless.
4. Serverless CLI Access Token aus Bot → Serverless → CLI Access, getrennt vom normalen Bot-API-Token. Nicht im Repository speichern.
5. Bei Bedarf Zielgruppen-ID und Bot-Berechtigungen.
6. Leeres GitHub-Repository für den fertigen Code.

## Technischer Ablauf

1. README, Quellcode, Lizenz und aktuelle Telegram-Dokumentation prüfen.
2. Kompatibilität bewerten und notwendige Änderungen benennen.
3. Eigene Ordnerstruktur erstellen: `tgcloud/handlers`, `tgcloud/lib`, `tgcloud/schema.js` und bei Bedarf `tgcloud/endpoints`.
4. Bot-API-Aufrufe über `sdk` und Datenbankzugriffe über `sdk/db` implementieren. Die Runtime ist eine JavaScript-Sandbox, kein gewöhnlicher Node.js-Server.
5. Passende lokale Tests ausführen. Zugangsdaten nur lokal verwenden.
6. Den Bot mit dem CLI Access Token verbinden.
7. Bestehenden Cloud-Stand mit `fetch`, `status` und `diff` prüfen. Fremde Module bewahren.
8. Code hochladen, Datenbankmigration prüfen/anwenden und Webhook synchronisieren.
9. Rechte und Status auf der Plattform prüfen. Anschließend einen Live-Test durchführen.
10. Code und README im richtigen GitHub-Repository sichern; keine Zugangsdaten veröffentlichen.

Für ein neues Projekt bietet Telegram diesen Einstieg an:

```sh
npm create @tgcloud/bot mein-bot
cd mein-bot
npx tgcloud login
```

Nach dem Umbau:

```sh
npx tgcloud fetch
npx tgcloud status
npx tgcloud diff
npx tgcloud push
npx tgcloud migrate
npx tgcloud webhook sync
npx tgcloud status
```

`push` synchronisiert den ganzen Modulbestand. Cloud-Module, die lokal fehlen, können entfernt werden. Migrationen vor Bestätigung prüfen. Nicht `push --force` als Standard verwenden.

## Aktueller Support-Bot

- Bot: https://t.me/GruppennetzwerkKontakt_bot
- Laufzeit: Telegram Serverless.
- Status: vom Nutzer live getestet; Nachrichten und Antworten funktionieren.
- Begrüßung: „Bitte stelle einfach deine Anfrage. Hier antworten echte Menschen, sobald wir Zeit haben.“
- GitHub-Version verwendet eine Platzhalter-Gruppen-ID, die jeder Betreiber in `tgcloud/lib/config.js` ersetzt.
- Keine Zahlungsfunktion enthalten.

## Startnachricht für den nächsten Chat

> Lies docs/WEITERE-BOTS-DE.md aus https://github.com/corneliscoppeneur-cmyk/Telegram-support-bot. Baue das folgende Repository für einen neuen Telegram-Serverless-Bot um: [LINK]. Der Bot soll [AUFGABE] erfüllen. Prüfe zuerst die tatsächliche Kompatibilität und setze den Umbau danach um. Verwende ein eigenes Projekt und verändere den bestehenden Support-Bot nicht.
