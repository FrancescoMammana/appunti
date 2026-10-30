# Pubblicare articoli nuovi

Non occorre aggiornare manualmente la home: Jekyll legge automaticamente `_posts/` e ordina gli articoli dal più recente.

## Dalla chat

Scrivi: **«Pubblica nel mio GitHub Appunti un nuovo articolo su [argomento], titolo [titolo]»**. Puoi fornire un testo, una ricerca, un documento o chiedere di preparare l'articolo da zero. L'assistente usa il collegamento GitHub e crea un file nel repository.

## Articolo Markdown

Crea `_posts/2026-11-05-titolo-esempio.md` con:

```markdown
---
layout: default
title: "Titolo dell'articolo"
date: 2026-11-05 12:00:00 +0100
description: "Una descrizione breve per la home e i motori di ricerca."
categories: [tecnologia]
permalink: /articoli/titolo-esempio/
---

# Titolo

Contenuto **Markdown** con sezioni, link e immagini.
```

## Articolo HTML interattivo con il layout comune

Crea un file `_posts/YYYY-MM-DD-slug.html` con front matter Jekyll e usa **`layout: default`**, come tutti gli altri articoli. Nel corpo inserisci solo HTML relativo al contenuto, **senza** duplicare `<!doctype>`, `<html>`, `<head>` o `<body>`.

Se servono tabelle larghe, stili e script specifici, nel front matter aggiungi:

```yaml
layout: default
wide_layout: true
extra_css:
  - /assets/css/nome-report.css
extra_js:
  - /assets/js/nome-report.js
```

Il layout condiviso carica automaticamente menu, scelta del tema, icone, manifest PWA, registrazione del Service Worker e avviso di aggiornamento. Per evitare conflitti con header e footer, delimita le regole del CSS dell'articolo a una classe radice, per esempio `.mio-report`, invece di usare selettori globali come `body`, `section` e `h1`.

**Esempio reale:** l'articolo AI Coding 2026 usa ora `layout: default`, con `assets/css/ai-coding.css` e `assets/js/ai-coding.js` separati. I sette articoli della serie AI Engineer continuano a funzionare senza modifiche.

## Tema condiviso e colori coerenti

La palette e lo **sfondo del blog** sono centralizzati in `assets/css/theme.css`. La home e tutti gli articoli Markdown che usano `layout: default` caricano già questo file automaticamente tramite `_layouts/default.html`.

Per gli **articoli HTML autonomi** (con `layout: null`), inserisci nel tag `<head>` questo riferimento, **prima** del CSS specifico dell'articolo:

```html
<link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
```

Poi evita di ridefinire `:root` con colori diversi o `body { background: ... }`. Usa invece le variabili condivise per testo, sfondo, pannelli, bordi e accenti:

```css
/* Il body eredita lo stesso sfondo della home dal tema condiviso. */
.card {
  background: var(--panel);
  color: var(--text);
  border: 1px solid var(--border);
}
.card a { color: var(--accent); }
```

Variabili principali: `--bg`, `--panel`, `--panel2`, `--border`, `--line`, `--text`, `--muted`, `--accent` e `--aqua`. È possibile modificare `assets/css/theme.css` per cambiare contemporaneamente la grafica di home e articoli.

## Modalità chiara e scura per tutti gli articoli

La home e gli articoli Markdown con `layout: default` includono automaticamente il selettore **Tema chiaro / Tema scuro**. In assenza di una scelta salvata il sito mantiene il tema scuro originale. La preferenza è memorizzata nel browser: cambia una sola volta e segue tutte le pagine.

Per gli articoli che usano il layout condiviso non occorre aggiungere manualmente il pulsante del tema. Il layout include automaticamente `assets/js/theme.js` e le icone dinamiche. I report HTML speciali devono usare gli stili basati su variabili CSS ed evitare regole globali.

## Favicon e icona del blog

Sono disponibili due favicon blocco note: `assets/icons/favicon.svg` (sfondo scuro) e `assets/icons/favicon-light.svg` (sfondo bianco). Il layout condiviso sceglie automaticamente la versione coerente con il tema, anche per il logo nella testata. La logica di selezione è in `assets/js/theme.js`.

Per le pagine con `layout: default`, favicon, tema e metadati sono già inclusi. Il layout usa questi collegamenti:

```html
<link rel="icon" type="image/svg+xml"
      data-theme-icon
      data-dark-src="{{ '/assets/icons/favicon.svg' | relative_url }}"
      data-light-src="{{ '/assets/icons/favicon-light.svg' | relative_url }}"
      href="{{ '/assets/icons/favicon.svg' | relative_url }}">
<meta name="theme-color" content="#0c1422">
```

L'icona accanto al nome **Appunti** nella home utilizza lo stesso file SVG, così tutte le pagine mantengono la stessa identità visiva.

## Aggiungere un capitolo a una serie

I capitoli della serie AI Engineer sono file HTML in `_posts/`, con `layout: default`, e hanno questo front matter supplementare:

```yaml
series_id: ai-engineering
series_label: "Da Vibe Coder ad AI Engineer"
series_order: 8
series_chapter: "Titolo breve del capitolo"
permalink: /serie/ai-engineering/08-titolo-del-capitolo/
```

Il layout `_layouts/default.html` aggiunge **automaticamente** progresso di lettura, collegamenti precedente/successivo e indice interno. L'indice `serie/ai-engineering.html` legge dinamicamente tutti i post con lo stesso `series_id` e li ordina tramite `series_order`.

Per un capitolo nuovo, controlla che `series_order` sia un numero univoco e che data e permalink siano corretti. Scrivi il corpo senza duplicare il titolo: viene già mostrato dal layout.

Per una **nuova serie tematica** non basta cambiare `series_id`: crea una pagina indice dedicata, poi aggiungi la sezione corrispondente nella home. Puoi chiedere in chat: «Crea una nuova serie nel blog appunti intitolata ... con ... capitoli, indice e navigazione». Prima di pubblicare verifica che gli indirizzi usino `relative_url` per rispettare `baseurl: "/appunti"`.

## Consigli

- Una data valida e non futura: i post con data futura non vengono pubblicati con `future: false`.
- Slug univoco in `permalink`.
- Se cambi lo slug o il permalink si interrompono i link già condivisi.
- Testare i link su GitHub Pages perché il sito vive nel sottopercorso `/appunti/`.
- Non inserire chiavi API, password o dati privati: il repository e il sito sono pubblici.

## Disponibilità offline e nuovi articoli

La PWA registra un **unico** Service Worker in `/appunti/sw.js`. Il file viene generato da Jekyll con `site.posts`: **non serve aggiungere a mano un articolo alla cache**. I contenuti nuovi sono scaricati automaticamente quando il nuovo worker viene installato mentre il telefono è online; al termine l'app propone l'aggiornamento. Le pagine salvate restano accessibili offline finché il browser ne conserva la cache. Non inserire risorse esterne essenziali senza prevedere un comportamento offline.

Per verificare l'installazione: apri Appunti con Chrome Android, scegli **Installa app**, visita il sito online almeno una volta, quindi prova la navigazione in modalità aereo. In caso di aggiornamenti Jekyll, verifica anche che il nuovo articolo sia presente nel Service Worker generato.
