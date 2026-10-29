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

## Consigli

- Una data valida e non futura: i post con data futura non vengono pubblicati con `future: false`.
- Slug univoco in `permalink`.
- Se cambi lo slug o il permalink si interrompono i link già condivisi.
- Testare i link su GitHub Pages perché il sito vive nel sottopercorso `/Appunti/`.
- Non inserire chiavi API, password o dati privati: il repository e il sito sono pubblici.
