---
article_layout: true
title: "OpenCode da smartphone: guida pratica con VPS Linux e Android"
date: 2026-11-12 18:00:00 +0100
description: "Configurare OpenCode su una VPS Linux e usarlo da Android: comandi, Tailscale, GitHub, systemd, sicurezza e verifiche."
categories: [guide, ai-coding]
tags: [opencode, android, linux, github, tailscale, coding-agent]
---

# OpenCode da Android con una VPS Linux

**Obiettivo:** scrivere richieste, esaminare modifiche, eseguire test e lavorare su repository Git da Android, lasciando compilazione e strumenti di sviluppo su una VPS Linux.

Questa è una **procedura proposta**, non un'installazione verificata end-to-end su uno specifico telefono o server. I comandi OpenCode fanno riferimento alla **CLI V2 documentata al momento della stesura**: prima di applicarli, controllare `opencode --version` e `opencode serve --help`. Per iniziare, **il browser Android è sufficiente**: un client Android dedicato è opzionale.

## 1. Architettura

```text
Android (browser / client OpenCode)
    │
    └── Tailscale: rete privata cifrata
            │
            └── VPS Linux
                  ├── Tailscale Serve (HTTPS privato)
                  ├── OpenCode API + Web UI (127.0.0.1:4096)
                  ├── Git + GitHub CLI
                  └── ~/projects/<repository>
```

Il server OpenCode ascolta **solo su localhost**. Tailscale Serve pubblica l'interfaccia **solo nella tailnet**: non è necessario aprire la porta 4096 sul firewall pubblico. Non utilizzare Tailscale Funnel per questo caso.

## 2. Prerequisiti

| Componente | Requisito |
| --- | --- |
| VPS | Ubuntu/Debian aggiornati, accesso SSH con chiave; indicativamente 2 vCPU e 4 GB RAM per attività leggere |
| Android | Browser moderno e app Tailscale |
| Modello AI | Provider e credenziali configurati in OpenCode; il costo del modello è separato dalla VPS |
| GitHub | Account con accesso ai repository da gestire |
| Sicurezza | Utente Linux non-root, aggiornamenti, firewall, autenticazione OpenCode |

I comandi seguenti assumono una distribuzione Debian/Ubuntu e un utente Linux normale con `sudo`.

## 3. Preparare la VPS

Accedere via SSH, aggiornare i pacchetti e installare gli strumenti di base:

```bash
ssh utente@IP_DELLA_VPS
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ca-certificates gh
mkdir -p ~/projects
```

**Non eseguire OpenCode come root.** Installare anche SDK e runtime necessari al proprio progetto (.NET, Node.js, Python ecc.). La VPS deve poter eseguire davvero build e test: OpenCode non sostituisce questi strumenti.

## 4. Installare OpenCode V2

La documentazione ufficiale V2 indica questo installer:

```bash
curl -fsSL https://opencode.ai/v2/install | bash
```

Prima di eseguire script remoti, verificarne origine e contenuto. Aprire una nuova shell se il comando `opencode` non è ancora nel `PATH`, quindi controllare:

```bash
opencode --version
opencode serve --help
```

Configurare il provider AI seguendo la [guida ufficiale](https://opencode.ai/docs/). Non salvare chiavi API nei repository Git.

## 5. Avviare il server solo in locale

Per una prova iniziale, avviare OpenCode in primo piano:

```bash
cd ~/projects
opencode serve --hostname 127.0.0.1 --port 4096
```

La CLI V2 espone API e interfaccia web sullo stesso server. L'accesso richiede una password: per un servizio persistente conviene impostarne una **fissa e robusta** tramite `OPENCODE_PASSWORD`, senza scriverla nella cronologia della shell.

Per verificare il processo da una seconda sessione SSH:

```bash
curl -I http://127.0.0.1:4096
```

Una risposta HTTP (anche di autenticazione) conferma che la porta risponde; non dimostra ancora che l'intera configurazione funzioni.

## 6. Installare Tailscale sulla VPS

Seguire le [istruzioni ufficiali Linux](https://tailscale.com/kb/1031/install-linux) e verificare il comando di installazione prima di lanciarlo. La procedura ufficiale comunemente indicata è:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
tailscale status
```

Autorizzare il dispositivo nella propria tailnet. Installare Tailscale anche su Android e accedere **allo stesso account/tailnet**.

Pubblicare il servizio locale **solo nella rete privata**:

```bash
sudo tailscale serve --bg 4096
tailscale serve status
```

Il comando mostra l'indirizzo HTTPS della VPS nella tailnet (tipicamente un dominio `*.ts.net`). **Usare l'URL effettivamente restituito**, non un indirizzo inventato. La sintassi di Tailscale Serve può cambiare: se `--bg` non è disponibile, consultare `tailscale serve --help`.

**Da non fare:** impostare `opencode serve --hostname 0.0.0.0` senza una precisa ragione e adeguate restrizioni; aprire la porta 4096 verso Internet; usare `tailscale funnel`.

## 7. Collegarsi da Android

1. Attivare Tailscale sul telefono.
2. Aprire nel browser Android l'URL HTTPS privato ottenuto con `tailscale serve status`.
3. Eseguire il pairing/autenticazione richiesti da OpenCode.
4. Aprire una sessione e verificare l'accesso al progetto.

Per generare un collegamento di accesso temporaneo, OpenCode V2 documenta:

```bash
opencode pair
```

Il collegamento standard punta a localhost. Per generare un link che utilizzi l'URL della tailnet, la CLI V2 documenta anche:

```bash
opencode pair --url https://NOME-VPS.NOME-TAILNET.ts.net
```

Sostituire il dominio con quello mostrato da Tailscale. I link di pairing sono monouso e scadono dopo pochi minuti. Se si preferisce un client Android dedicato, verificare che sia **compatibile con la versione V2** e che gestisca autenticazione e URL privato; non è un requisito della procedura.

## 8. Rendere OpenCode persistente con systemd

Una sessione SSH chiusa termina normalmente un processo in primo piano. Per l'uso quotidiano creare un servizio **utente**. Prima individuare il binario:

```bash
command -v opencode
```

L'esempio seguente usa `/home/utente/.opencode/bin/opencode` **solo come segnaposto**: sostituirlo con il percorso effettivo stampato dal comando precedente.

Creare una directory per i segreti, accessibile solo all'utente:

```bash
mkdir -p ~/.config/opencode
chmod 700 ~/.config/opencode
nano ~/.config/opencode/server.env
```

Contenuto del file (sostituire la password):

```ini
OPENCODE_PASSWORD=INSERIRE_PASSWORD_LUNGA_E_CASUALE
```

Proteggere il file:

```bash
chmod 600 ~/.config/opencode/server.env
mkdir -p ~/.config/systemd/user
nano ~/.config/systemd/user/opencode.service
```

Unità systemd:

```ini
[Unit]
Description=OpenCode server privato

[Service]
Type=simple
WorkingDirectory=%h/projects
EnvironmentFile=%h/.config/opencode/server.env
ExecStart=/PERCORSO/REALE/opencode serve --hostname 127.0.0.1 --port 4096
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

**Sostituire `/PERCORSO/REALE/opencode`** con il percorso assoluto ottenuto da `command -v opencode`. Poi:

```bash
systemctl --user daemon-reload
systemctl --user enable --now opencode
systemctl --user status opencode
journalctl --user -u opencode -n 50 --no-pager
```

Per mantenere il servizio utente attivo dopo il logout e all'avvio della VPS, un amministratore può abilitare il lingering per l'utente:

```bash
sudo loginctl enable-linger "$USER"
```

**Attenzione:** systemd riavvia il server, ma non riprende automaticamente una build interrotta dal reboot. Sessioni e repository vanno inclusi nei backup.

## 9. Collegare GitHub e lavorare su un repository

Sulla VPS:

```bash
gh auth login
gh auth status
cd ~/projects
gh repo clone ORGANIZZAZIONE/REPOSITORY
cd REPOSITORY
git status
```

Sostituire `ORGANIZZAZIONE/REPOSITORY` con un repository autorizzato. Per un flusso di lavoro controllabile:

```bash
gh issue create --title "Descrivere la modifica" --body "Obiettivo e criteri di verifica"
git switch -c fix/nome-modifica
# Richiedere a OpenCode una modifica circoscritta
git diff --check
git diff
# Eseguire i test previsti dal progetto
git add .
git commit -m "fix: descrizione della modifica"
git push -u origin fix/nome-modifica
gh pr create --fill
```

La sequenza è un esempio: il comando dei test dipende dal progetto. **Issue → branch → modifica → test → PR → revisione → merge**. Evitare credenziali con privilegi superiori al necessario e non automatizzare merge o comandi distruttivi senza approvazione.

## 10. Verifica finale e problemi comuni

| Sintomo | Controllo |
| --- | --- |
| URL privato irraggiungibile | Tailscale attivo su entrambi; `tailscale status` e `tailscale serve status` |
| Server non risponde | `systemctl --user status opencode`, `journalctl --user -u opencode` |
| Accesso negato | Password, pairing, sessione e compatibilità V2 |
| La pagina funziona solo via SSH | Verificare Serve e l'URL HTTPS della tailnet |
| I test falliscono | Installare SDK/runtime del progetto sulla VPS |
| Dopo un riavvio la sessione non esegue più il task | Il riavvio del servizio non ripristina i processi interrotti |

**Checklist di collaudo:** accesso da Android su Wi-Fi e rete mobile; apertura progetto; modifica innocua; diff; test; chiusura e riapertura browser; reboot VPS; verifica che senza Tailscale l'URL privato non sia raggiungibile; ripristino di un backup di prova.

## Riferimenti ufficiali

- [OpenCode V2 — installazione](https://opencode.ai/docs/)
- [OpenCode V2 — Web e pairing](https://opencode.ai/docs/cli/web/)
- [OpenCode V2 — comandi CLI](https://opencode.ai/docs/cli/commands)
- [Tailscale — installazione Linux](https://tailscale.com/kb/1031/install-linux)
- [Tailscale Serve — documentazione](https://tailscale.com/docs/reference/tailscale-cli/serve)
- [GitHub CLI](https://cli.github.com/)
