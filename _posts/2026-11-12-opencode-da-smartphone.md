---
article_layout: true
title: "OpenCode da smartphone: una proposta per sviluppare con l'AI ovunque"
date: 2026-11-12 18:00:00 +0100
description: "Un'architettura proposta per usare OpenCode da Android con una VPS Linux, un client grafico e una connessione privata."
categories: [guide, ai-coding]
tags: [opencode, android, linux, github, tailscale, coding-agent]
---

# OpenCode da smartphone: una proposta per sviluppare con l'AI ovunque

**Si può davvero sviluppare software usando soltanto uno smartphone?** Per alcune attività, sì. Non occorre però far girare tutti gli strumenti sul telefono: si può lasciare il lavoro a un server Linux e usare Android per parlare con l'agente AI, seguire le modifiche e approvarle. È un modo pratico per intervenire su un progetto anche quando non si ha un computer davanti.

L'idea è usare **OpenCode** come assistente di programmazione su un server remoto e collegarsi con un'app Android. Questa è una proposta da valutare e provare, non una configurazione già collaudata: prima di iniziare bisogna verificare che server e app siano compatibili.

## L'idea in breve

```text
Smartphone Android
  └─ Client grafico compatibile con OpenCode
       └─ VPN privata (Tailscale)
            └─ VPS Linux
                 ├─ OpenCode (servizio/API)
                 ├─ Git e GitHub CLI
                 ├─ SDK, runtime e strumenti di test
                 └─ Repository di sviluppo
```

**Il vantaggio è semplice:** il server esegue i comandi e conserva i progetti; lo smartphone permette di seguirne il lavoro ovunque ci sia una connessione.

## Perché non eseguire tutto sul telefono?

Su Android esistono terminali come Termux, ma installare e mantenere tutti gli strumenti di sviluppo su un telefono può diventare scomodo. Una VPS, cioè un server virtuale sempre raggiungibile, offre un ambiente Linux in cui installare compilatori, librerie e strumenti di test. Anche i repository rimangono sul server, senza dover copiare ogni volta i file sul telefono.

Ci sono naturalmente dei limiti: serve Internet, bisogna mantenere aggiornato il server e il modello AI può avere un costo. Inoltre, leggere modifiche molto estese su uno schermo piccolo non è sempre comodo.

## I componenti proposti

| Componente | Ruolo | Nota |
| --- | --- | --- |
| **OpenCode** | Agente AI che legge e modifica il progetto | Verificare versione, provider e API disponibili |
| **VPS Linux** | Ambiente in cui girano codice e test | Preferibile un utente non privilegiato |
| **Client Android** | Conversazioni, diff e approvazioni | Verificare che supporti il server scelto |
| **Tailscale** | Rete privata tra telefono e VPS | Evita di esporre direttamente il servizio |
| **Git + GitHub CLI** | Branch, issue, commit e pull request | Credenziali con privilegi minimi |
| **systemd** | Avvio del server dopo un riavvio | Non garantisce la ripresa dei task interrotti |

Un client grafico di terze parti può risultare più pratico di SSH per conversazioni e approvazioni. Va però valutato anche sotto il profilo di affidabilità, manutenzione e trattamento dei dati. Se il client non è compatibile, si può usare un'interfaccia web supportata dalla propria versione di OpenCode oppure un terminale SSH.

## Come si potrebbe configurare

### 1. Preparare l'ambiente Linux

Scegliere una VPS con Ubuntu o Debian aggiornati e installare Git, strumenti di compilazione e i runtime necessari ai progetti. Due vCPU e 4 GB di RAM possono essere un punto di partenza per attività leggere; build e test impegnativi richiederanno risorse maggiori.

Creare un utente dedicato allo sviluppo, evitare l'esecuzione come root e configurare accesso SSH con chiavi e aggiornamenti di sicurezza.

### 2. Installare OpenCode

Seguire la [documentazione ufficiale di OpenCode](https://opencode.ai/docs/) per la versione corrente. Verificare il comando di installazione prima di eseguirlo: URL e opzioni della CLI possono cambiare tra release.

Dopo l'installazione, controllare la versione e configurare il provider del modello AI. **L'utilizzo del modello può comportare costi separati** dal canone della VPS; conviene definire limiti e controlli di spesa.

### 3. Rendere raggiungibile il servizio senza pubblicarlo su Internet

Installare [Tailscale](https://tailscale.com/kb/1031/install-linux) sia sulla VPS sia su Android, autorizzando entrambi i dispositivi nella stessa rete privata.

Il principio di sicurezza è mantenere il servizio OpenCode in ascolto sull'interfaccia locale e, se supportato dalla configurazione, pubblicarlo all'interno della tailnet tramite [Tailscale Serve](https://tailscale.com/kb/1312/serve). Non usare **Funnel**, che è pensato per l'esposizione pubblica.

Prima di procedere, verificare che il client Android supporti l'URL, il protocollo e l'autenticazione del server OpenCode. Una VPN **non sostituisce** l'autenticazione applicativa né le regole di accesso della tailnet.

### 4. Collegare l'app grafica Android

Installare un client Android compatibile e configurare una connessione manuale all'indirizzo privato del server. Se il client e il server supportano una procedura di pairing, può essere preferibile all'inserimento manuale delle credenziali.

Eseguire una prova semplice: aprire un progetto, avviare una conversazione, richiedere una piccola modifica e controllare il diff prima di approvarla.

### 5. Collegare GitHub

Installare [GitHub CLI](https://cli.github.com/) sulla VPS, autenticarsi con un account autorizzato e clonare soltanto i repository necessari.

Per le modifiche assistite dall'agente è utile un processo ripetibile:

**Issue → Branch → Modifica → Test → Pull request → Revisione → Merge**

Le istruzioni persistenti del repository, ad esempio nel file `AGENTS.md`, possono indicare convenzioni di codice, test obbligatori e limiti alle operazioni automatiche. Non consentire merge, deploy o comandi distruttivi senza un controllo adeguato.

## Persistenza: tre aspetti distinti

**Disponibilità del server.** Un servizio gestito da `systemd` può avviarsi automaticamente con Linux. Il comando e la modalità di supervisione dipendono dalla versione installata di OpenCode: conviene usare un processo in primo piano quando è disponibile, così `systemd` può monitorarlo e riavviarlo.

**Conversazioni recuperabili.** La cronologia deve essere salvata sul server, non soltanto nell'app. Occorre verificare il percorso dati della versione utilizzata e includerlo nei backup.

**Attività ancora in esecuzione.** Salvare una conversazione non significa che un test o un comando continui dopo il riavvio della VPS. Per le attività lunghe servono meccanismi di esecuzione e recupero appropriati; `tmux` può aiutare contro le disconnessioni SSH, ma non contro il riavvio del sistema.

## Sicurezza e manutenzione

Prima di considerare pronta la soluzione:

- Non esporre direttamente le porte di OpenCode su Internet.
- Applicare autenticazione, permessi minimi e restrizioni Tailscale.
- Tenere chiavi API e token GitHub fuori dai repository e dai log.
- Esaminare i diff e richiedere approvazione per operazioni rischiose.
- Aggiornare sistema operativo, OpenCode e client mobile.
- Eseguire backup cifrati di configurazioni, dati delle sessioni e modifiche locali non ancora pubblicate.
- Verificare provenienza, aggiornamenti e permessi del client Android di terze parti.

Un agente AI può eseguire comandi con i permessi dell'utente Linux che lo ospita. La VPS andrebbe quindi trattata come un ambiente di sviluppo con accessi controllati, non come un servizio pubblico aperto.

## Test prima dell'uso quotidiano

1. Collegarsi da Android con Tailscale attivo.
2. Aprire un repository e richiedere una modifica innocua.
3. Controllare il diff e avviare i test.
4. Chiudere e riaprire l'app, verificando la cronologia.
5. Passare da Wi-Fi a rete mobile.
6. Riavviare la VPS e verificare la disponibilità del servizio.
7. Disattivare Tailscale e verificare che l'endpoint privato non sia raggiungibile dalla rete pubblica.
8. Ripristinare un backup di prova.

## Alternative da considerare

**Interfaccia web ufficiale.** Riduce la dipendenza da un client Android di terze parti, purché la versione installata la supporti e sia accessibile in modo sicuro.

**SSH + terminale.** Offre il massimo controllo e richiede meno integrazioni, ma la revisione dei diff su uno schermo piccolo è meno comoda.

**PC sempre acceso anziché VPS.** Riduce il costo di un server dedicato, ma dipende dall'alimentazione e dalla connettività della macchina domestica.

## Valutazione finale

Questa architettura è interessante per chi vuole **seguire lo sviluppo da smartphone senza rinunciare a un vero ambiente Linux**. È particolarmente adatta a piccole modifiche, review, gestione delle issue e supervisione di agenti AI.

Non sostituisce completamente una workstation: per refactoring complessi, debugging visuale e analisi di grandi diff, un monitor e un IDE tradizionale rimangono spesso più comodi.

**La strada più prudente è un progetto pilota:** VPS isolata, connessione privata, un repository di prova, una piccola modifica e un ciclo completo di test e revisione. Solo dopo aver verificato stabilità, sicurezza e compatibilità conviene estendere la soluzione ad altri progetti.

### Risorse

- [OpenCode — documentazione](https://opencode.ai/docs/)
- [Tailscale — installazione Linux](https://tailscale.com/kb/1031/install-linux)
- [Tailscale Serve](https://tailscale.com/kb/1312/serve)
- [GitHub CLI](https://cli.github.com/)
- [GitHub — sicurezza dei token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)
