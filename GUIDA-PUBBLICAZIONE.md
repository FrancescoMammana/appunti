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

## Consigli

- Una data valida e non futura: i post con data futura non vengono pubblicati con `future: false`.
- Slug univoco in `permalink`.
- Se cambi lo slug o il permalink si interrompono i link già condivisi.
- Testare i link su GitHub Pages perché il sito vive nel sottopercorso `/Appunti/`.
- Non inserire chiavi API, password o dati privati: il repository e il sito sono pubblici.
