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
- `assets/css/theme.css` — palette e sfondo condivisi da home e articoli.
- `assets/css/style.css` — stile del blog.
- `assets/icons/favicon.svg` — icona blocco note per la scheda del browser e il logo del sito.
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
