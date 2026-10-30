# Appunti

Un sito di appunti dove raccolgo ciò che mi interessa in un determinato momento.

Blog statico pubblicabile con **GitHub Pages + Jekyll**, senza server o build locali obbligatorie.

## Struttura

- `index.html` — home con elenco automatico degli articoli.
- `_posts/YYYY-MM-DD-slug.md` — nuovi articoli Markdown.
- `_posts/YYYY-MM-DD-slug.html` — articoli HTML interattivi.
- `serie/ai-engineering.html` — indice dinamico della prima serie di articoli.
- Articoli con `series_id` e `series_order` — capitoli collegati automaticamente dal layout.
- `_layouts/default.html` — layout condiviso delle pagine.
- `assets/css/theme.css` — due palette (scura e chiara) e sfondo condivisi da home e articoli.
- `assets/css/report-theme.css` — correzioni di contrasto per il report AI Coding in modalità chiara.
- `assets/js/theme.js` — selettore Chiaro/Scuro con preferenza salvata nel browser.
- `assets/css/style.css` — stile del blog.
- `assets/icons/favicon.svg` — icona blocco note su sfondo scuro.
- `assets/icons/favicon-light.svg` — variante su sfondo bianco per il tema chiaro.
- `_config.yml` — impostazioni GitHub Pages.
- `GUIDA-PUBBLICAZIONE.md` — guida per pubblicare dalla chat.

## Pubblicazione iniziale con GitHub Pages

Apri **Settings → Pages → Build and deployment** sul repository e scegli **Deploy from a branch**, branch **main**, directory **/(root)**, quindi salva.

Sito pubblico (dopo l'attivazione e la build): https://francescomammana.github.io/appunti/

## Nuovi articoli dalla chat

Scrivi «Pubblica sul repository Appunti un articolo su ...». Il nuovo file verrà creato in `_posts/`; la home e l'archivio si aggiornano da soli quando GitHub Pages rigenera il sito.

Articolo inaugurale: [AI Coding 2026](https://francescomammana.github.io/appunti/articoli/ai-coding-2026/).

Non pubblicare credenziali o informazioni riservate: repository e sito sono pubblici.

## Prima serie di approfondimento

[Da Vibe Coder ad AI Engineer](https://francescomammana.github.io/appunti/serie/ai-engineering/) — 7 articoli dedicati al metodo di sviluppo con coding agent, tratti e rielaborati dal video di Leon van Zyl. L'ordine di lettura è guidato da un indice e pulsanti precedente/successivo. I capitoli si trovano in `_posts/` e vengono inseriti in home come una sola raccolta.

## Modalità chiara e scura

Il logo del sito e la favicon del browser seguono automaticamente il tema scelto: sfondo scuro nel tema scuro, sfondo bianco nel tema chiaro. Il blog usa **tema scuro iniziale**, come nel progetto originale. Il pulsante **Tema chiaro / Tema scuro** compare nel menu di tutte le pagine Jekyll e nel report AI Coding. La scelta viene salvata in `localStorage` (`appunti-theme-v1`) e rimane attiva navigando tra le pagine e nelle visite successive con lo stesso browser. In modalità privata o con storage disabilitato la scelta funziona finché non si ricarica la pagina.

Palette: `assets/css/theme.css`. Il layout principale importa `theme.js` prima dei CSS per evitare un flash del tema sbagliato. I report con `layout: null` devono importare esplicitamente entrambi e fornire il controllo di cambio tema; evita colori fissi e usa `var(--bg)`, `var(--panel)`, `var(--text)`, `var(--muted)`, `var(--accent)`, ecc. Il report AI Coding include un foglio CSS specifico per le parti non già basate su variabili.

## Appunti installabile come PWA

Appunti è una Progressive Web App installabile da Chrome Android tramite **Installa app**. Rimane un sito Jekyll distribuito da GitHub Pages, senza server aggiuntivo.

- `manifest.webmanifest` contiene identità, nome, icone e URL iniziale, con percorso `/appunti/`.
- `sw.js` è l'**unico Service Worker** per tutte le pagine del blog. Jekyll lo rigenera a ogni build e inserisce automaticamente **tutti i post pubblicati** nella cache offline.
- `assets/js/pwa.js` registra il Service Worker, rileva gli aggiornamenti e propone un pulsante per applicarli.
- `offline.html` è la pagina di fallback quando un link mai salvato viene aperto senza connessione.
- `assets/icons/icon-{192,512}.png` e `icon-maskable.png` sono le icone Android dell'app.

### Pubblicazione e aggiornamenti

1. Crea normalmente nuovi articoli sotto `_posts/`, con permalink stabile e data non futura.
2. GitHub Pages ricompila Jekyll e la lista di pagine in `sw.js`, senza aggiornamenti manuali all'elenco offline.
3. Quando l'utente torna online, il browser rileva un nuovo worker, scarica gli articoli e le risorse della nuova versione. L'app propone **Aggiorna**; il precedente worker rimane attivo finché il nuovo non è pronto.
4. Su una nuova installazione, apri Appunti online e lascia completare la prima sincronizzazione; la lettura offline dipende dalla disponibilità della cache e dai limiti di archiviazione del browser.

### Layout unico

Tutte le pagine, incluso il report AI Coding 2026, usano `_layouts/default.html`.
Per i report HTML interattivi usa `layout: default` e, se serve, nel front matter:

```yaml
wide_layout: true
extra_css:
  - /assets/css/report.css
extra_js:
  - /assets/js/report.js
```

Il corpo articolo deve contenere solo il markup della pagina (senza `<html>`, `<head>`, `<body>` o script duplicati). I file di stile sono caricati dal layout comune. In particolare il CSS del report AI Coding è isolato sotto `.ai-coding` per non modificare i componenti globali.

### Invito all'installazione su smartphone (Issue #2)

Il file `assets/js/install-prompt.js`, caricato dal layout condiviso, mostra un invito leggero in basso quando un browser mobile segnala `beforeinstallprompt`: **l'avviso non viene forzato** nei browser che non supportano tale evento, sui desktop o nelle app già aperte in modalità standalone.

- **Installa** apre la finestra ufficiale di Chrome/Chromium, non installa niente senza conferma.
- **Non ora** salva in `localStorage` la data/ora di scadenza (`appunti-install-dismiss-until`) e nasconde l'invito per **24 ore esatte**. La nuova occasione si presenta alla navigazione successiva, se il browser emette nuovamente l'evento.
- Anche l'annullamento della finestra di installazione ufficiale applica 24 ore di pausa.
- L'evento `appinstalled` chiude l'invito; il banner non appare quando la PWA è già aperta come applicazione.
- Se è visibile l'avviso di aggiornamento, questo ha la precedenza.
- Lo stile di `.pwa-install` usa le variabili CSS condivise, così segue il tema chiaro/scuro.
- Su iPhone/iPad e browser senza `beforeinstallprompt` il banner non viene mostrato automaticamente: l'installazione manuale resta disponibile nei browser che la supportano.

Il workflow `Validate Appunti PWA` esegue anche `.github/scripts/check-install-prompt.mjs`, un test senza librerie esterne con casi per mobile, desktop, standalone, installazione, rinvio di 24 ore, incompatibilità di storage e coesistenza con l'avviso di aggiornamento.
