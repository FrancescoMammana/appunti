# Regole di sviluppo e aggiornamento

Regole da seguire per ogni modifica al repository Appunti, sia che la faccia una persona sia che la faccia un agente AI. Valgono per articoli nuovi, correzioni, documentazione e configurazione.

Il file si chiama `AGENTS.md` perché è il nome che OpenCode e altri agenti di coding leggono automaticamente all'inizio di ogni sessione: le regole qui sotto vengono quindi applicate senza doverle citare a mano.

## 1. Flusso di lavoro obbligatorio

Nessuna modifica va scritta direttamente su `main`. Ogni cambiamento segue questo giro:

```
main aggiornato → branch → commit → push → pull request → merge → branch eliminato
```

### Passi

1. **Aggiorna `main`** prima di iniziare:
   ```bash
   git checkout main
   git pull --ff-only
   ```
2. **Crea un branch dedicato** con nome parlante:
   ```bash
   git checkout -b article/nome-articolo
   git checkout -b fix/descrizione-breve
   git checkout -b docs/descrizione-breve
   ```
3. **Fai le modifiche** e un commit con messaggio chiaro, in italiano e all'infinito:
   ```bash
   git add <file>
   git commit -m "Articolo: titolo dell'articolo"
   ```
4. **Pubblica il branch e apri la pull request** verso `main`:
   ```bash
   git push -u origin <branch>
   ```
   Nel corpo della PR va indicato cosa cambia e come è stato verificato.
5. **Merge con squash** (un commit per PR), poi elimina il branch remoto e locale:
   ```bash
   git checkout main
   git pull --ff-only
   git branch -d <branch>
   git push origin --delete <branch>
   ```

### Nomi dei branch

| Prefisso | Uso |
|---|---|
| `article/` | nuovo articolo o revisione sostanziale di un articolo |
| `fix/` | correzione di un errore (testo, data, link, layout) |
| `docs/` | README, guide, regole |
| `chore/` | configurazione, workflow, manutenzione |

### Regole sui commit

- Un commit = una modifica coerente.
- Messaggio breve, in italiano, con prefisso quando utile: `Articolo:`, `Fix:`, `Docs:`, `Chore:`.
- Non inserire mai chiavi API, token, password o dati personali: il repository e il sito sono pubblici.

## 2. Articoli nuovi

Un articolo è un file in `_posts/` con nome `YYYY-MM-DD-slug.md` (Markdown) o `YYYY-MM-DD-slug.html` (HTML interattivo).

Front matter minimo per un articolo Markdown:

```yaml
---
title: "Titolo dell'articolo"
date: 2026-11-18 00:20:00 +0100
description: "Descrizione breve per home e motori di ricerca."
categories: [guide, intelligenza-artificiale]
tags: [argomento, secondo-argomento]
permalink: /articoli/slug-articolo/
---
```

Regole:

- **Data non futura.** `_config.yml` imposta `future: false`: un post con data successiva al momento della build viene escluso e il permalink restituisce 404. Se pubblichi oggi, usa un orario già passato (per esempio `00:20:00`), non le 12:00.
- **`permalink` univoco e stabile.** Non cambiarlo dopo la pubblicazione: rompe i link condivisi.
- **`description` sempre presente:** è quella mostrata in home.
- **Non duplicare il titolo nel corpo** se il layout lo mostra già.
- **`layout` non serve:** `_config.yml` assegna `layout: default` a tutti i post.
- Il corpo contiene solo il contenuto: niente `<!doctype>`, `<html>`, `<head>`, `<body>`, script o CSS duplicati.

## 3. Design grafico e classi CSS

**Non si modificano il design e le classi CSS quando si crea un articolo.** L'articolo deve adattarsi alla grafica esistente, non il contrario.

- Usa solo le classi già presenti in `assets/css/style.css` e le variabili di `assets/css/theme.css`.
- Non creare nuovi file CSS o JS per un articolo, salvo richiesta esplicita e in una PR dedicata.
- Non introdurre colori fissi: usa `var(--bg)`, `var(--panel)`, `var(--text)`, `var(--muted)`, `var(--accent)`, `var(--border)`.
- Non usare selettori globali (`body`, `h1`, `section`) in stili specifici: isola sempre sotto una classe radice.
- Non toccare `_layouts/default.html`, `theme.css`, `style.css` o `theme.js` per esigenze di un singolo articolo.

### Componenti disponibili

| Esigenza | Come si ottiene |
|---|---|
| Impaginazione standard dell'articolo | `layout: default` (automatico) |
| Stili tabella, titoli e spaziatura del report | `article_style: true` nel front matter |
| Card "Stato delle informazioni" | markup `<section class="binance-status">` già usato negli articoli di analisi |
| Tabelle larghe | `wide_layout: true` |
| Articolo interattivo | `layout: default` + `extra_css` / `extra_js` nel front matter |
| Serie di articoli | `series_id`, `series_label`, `series_order`, `series_chapter` |

Le tabelle Markdown sono già scrollabili orizzontalmente con `article_style: true`: non serve CSS aggiuntivo.

## 4. README e documentazione

- `README.md` va aggiornato **quando cambia qualcosa che descrive**: struttura del repository, nuovi file di progetto, flusso di pubblicazione, PWA, temi.
- Non serve aggiornarlo per ogni nuovo articolo: home, indice e Service Worker si rigenerano da soli.
- `GUIDA-PUBBLICAZIONE.md` va aggiornato quando cambia il modo di pubblicare o il layout condiviso.
- Queste regole valgono anche per la documentazione: modifiche a `README.md`, `GUIDA-PUBBLICAZIONE.md` e `AGENTS.md` passano da branch e PR.

## 5. Verifiche prima della pull request

1. Il front matter è valido e la data non è nel futuro.
2. Il permalink è univoco e non duplica un articolo esistente.
3. Non ci sono file CSS, JS o layout modificati senza motivo.
4. Il Markdown non contiene credenziali né dati riservati.
5. I link esterni rispondono e le fonti sono citate quando l'articolo riporta dati.
6. Dopo il merge, il workflow `Validate Appunti PWA` e la build di Pages risultano verdi.
7. Il permalink pubblicato risponde `200` e l'articolo compare in home.

## 6. Cosa non fare

- Push diretti su `main`.
- Force push su branch condivisi.
- Modificare o rinominare il `permalink` di un articolo già pubblicato.
- Aggiungere CSS o JS "solo per questo articolo".
- Pubblicare un articolo con data futura e considerarlo online.
- Aggiornare a mano `sw.js` o l'elenco della home.
