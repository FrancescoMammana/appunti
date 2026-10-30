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

## Articolo HTML interattivo

Crea un file `_posts/YYYY-MM-DD-slug.html` con lo stesso front matter, impostando `layout: null` e inserendo sotto il separatore `---` un documento HTML completo (doctype, head, body, CSS e JS). Per il ritorno alla home usa un collegamento `{{ '/' | relative_url }}` dentro l'HTML.

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

Per gli articoli HTML indipendenti con `layout: null`, aggiungi nel tag `<head>`, **prima** degli stili:

```html
<script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
<link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
```

E, nel body, il controllo visibile (senza librerie JavaScript esterne):

```html
<button type="button" class="theme-toggle" data-theme-toggle
        aria-label="Passa al tema chiaro" aria-pressed="false">
  <span class="theme-toggle-icon" aria-hidden="true">☀</span>
  <span class="theme-toggle-label">Tema chiaro</span>
</button>
```

Usa colori basati sulle variabili CSS `--bg`, `--panel`, `--panel2`, `--text`, `--body-text`, `--muted`, `--accent`, `--line`, `--border`, `--code-bg`. Se un articolo include CSS con colori fissi, prevedi anche delle regole `html[data-theme="light"]` per i pannelli, tabelle e controlli. Come esempio concreto, vedi `assets/css/report-theme.css`.

## Favicon e icona del blog

La favicon in stile blocco note è in `assets/icons/favicon.svg`. È già inclusa nel layout condiviso e compare automaticamente nelle pagine Markdown.

Per gli articoli HTML autonomi con `layout: null`, aggiungi nel `<head>` anche:

```html
<link rel="icon" type="image/svg+xml" href="{{ '/assets/icons/favicon.svg' | relative_url }}">
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
