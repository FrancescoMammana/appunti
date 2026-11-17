---
article_style: true
title: "Le migliori alternative a OpenRouter (2026): prezzi, abbonamenti e modelli gratis"
date: 2026-11-18 00:20:00 +0100
description: "Confronto aggiornato dei router LLM tipo OpenRouter: quanto costano davvero, quali abbonamenti esistono e quali modelli gratuiti sono utilizzabili senza sorprese."
categories: [guide, intelligenza-artificiale]
tags: [openrouter, llm, api, prezzi, ai-gateway]
permalink: /articoli/alternative-openrouter/
---

<section class="binance-status" aria-labelledby="stato-prezzi">
  <header class="binance-status-header">
    <h2 id="stato-prezzi">Stato delle informazioni</h2>
    <p class="binance-status-revision">Ultima verifica: 18 novembre 2026</p>
  </header>
  <p>Prezzi, commissioni e limiti sono stati letti dalle pagine ufficiali dei fornitori. In questo mercato le condizioni cambiano ogni poche settimane: prima di collegare una carta o migrare un progetto, ricontrolla il costo sul sito del provider e fai una chiamata di prova con la tua chiave.</p>
</section>

## In breve

OpenRouter non è più l'unico modo per usare centinaia di modelli con una sola chiave API. Oggi esistono tre famiglie di alternative: **router gestiti** che fanno la stessa cosa, **gateway di piattaforma** (Vercel, Cloudflare) che aggiungono routing senza markup, e **software self-hosted** come LiteLLM, gratis ma con un costo di infrastruttura reale.

La differenza di prezzo tra questi servizi non sta quasi mai nel costo per token: quello è lo stesso, è il listino del provider. Sta nella **commissione che si mette attorno ai token**. Ed è lì che si gioca il risparmio.

| Se sei... | Scelta migliore | Perché |
|---|---|---|
| Sviluppatore singolo o piccolo studio | **Requesty** | 5% di markup, 200 richieste al giorno gratis senza carta, dati in UE |
| Progetto JavaScript con AI SDK | **Vercel AI Gateway** | Zero markup e 5 $ di credito gratis ogni mese |
| Vuoi il catalogo più ampio e il failover migliore | **OpenRouter** | Resta il riferimento, ma paghi 5,5% sui crediti |
| Side project quasi a costo zero | **Cloudflare AI Gateway** + Workers AI | Core gratuito e 10.000 neurons al giorno |
| Team in produzione con log e guardrail | **Portkey** o **LiteLLM** | Observability e controllo, non risparmio |
| Non programmi e vuoi solo chattare | Un abbonamento chat | Un router API non ti serve |

## 1. Cosa fa OpenRouter (e perché cercare altro)

OpenRouter espone centinaia di modelli di decine di provider dietro un'unica API compatibile con quella di OpenAI. Cambi una stringa nel campo `model` e passi da un modello economico a uno di frontiera, con fallback automatico se il provider è saturo. È il motivo per cui è diventato lo standard de facto per chi non vuole aprire dieci account.

Il prezzo è trasparente: OpenRouter dichiara di applicare il listino del provider senza markup sull'inferenza. La commissione è sull'**acquisto di crediti**: 5,5% sul piano Standard e 8% su Business, con un minimo di 0,80 $ per le ricariche con carta. Su una ricarica da 10 $ quel minimo pesa l'8%, non il 5,5%. Sopra i 25.000 $ mensili di inferenza fatturata con chiavi proprie (BYOK) scatta un ulteriore 5%.

A questo si aggiunge il livello gratuito: i modelli con suffisso `:free` sono limitati a 20 richieste al minuto e 50 al giorno. Il tetto giornaliero sale a 1.000 se hai acquistato almeno 10 $ di crediti nella vita dell'account: è una soglia una tantum, non un abbonamento. Attenzione a due dettagli: il contatore è in UTC e un saldo negativo blocca anche i modelli gratuiti.

Quindi perché cercare alternative? Per tre motivi concreti: la commissione sui crediti, la necessità di self-hosting o di residenza dei dati, e il fatto che per alcuni workload un provider diretto costa meno.

## 2. Le quattro formule di prezzo

Prima di confrontare i nomi conviene capire **come** ti fatturano. Sono quattro modelli, spesso confusi tra loro.

| Formula | Come funziona | Chi la usa | Rischio |
|---|---|---|---|
| Markup per token | Una percentuale sul costo del modello, per ogni richiesta | Requesty (5%), Eden AI (5,5%) | Cresce linearmente con l'uso, per sempre |
| Commissione sui crediti | Nessun markup, ma paghi una fee quando ricarichi | OpenRouter (5,5%), Cloudflare (5%) | Minimi fissi che pesano sulle ricariche piccole |
| Abbonamento / piattaforma | Canone mensile, spesso indipendente dal volume | Portkey (49 $/mese) | Conviene solo sopra una certa spesa |
| Self-hosted | Software gratis, paghi server e manutenzione | LiteLLM, Bifrost | Il costo si sposta, non sparisce |

### I costi che non vedi nel listino

- **Minimo sulla ricarica.** La fee di OpenRouter ha un minimo di 0,80 $: su 10 $ è l'8%, su 100 $ torna al 5,5%.
- **Overage dei log.** Portkey include 100.000 log al mese nel piano Production, poi 9 $ ogni 100.000. Un team che genera 500.000 log arriva a 85 $/mese, non 49 $.
- **Infrastruttura del self-host.** LiteLLM è gratis come licenza, ma un proxy di produzione richiede server, database, Redis e qualcuno che lo aggiorni: indicativamente 50–200 $/mese.
- **Crediti che scadono.** I crediti Vercel durano un anno; il trial Cerebras scade dopo 30 giorni. Non sono soldi che restano lì per sempre.
- **Data residency.** Instradare in UE o regioni specifiche può avere un sovrapprezzo: Vercel lo tariffa al 5% dell'inferenza.
- **BYOK non è sempre gratis.** Su OpenRouter e Requesty il markup con chiavi proprie è zero, su Vercel il BYOK è disponibile solo nel piano a pagamento.

## 3. La classifica per rapporto qualità/prezzo

L'ordine seguente pesa quattro cose: quanto costa davvero, quanto è ampio il catalogo, cosa ottieni gratis e quanto è facile uscirne. I punteggi sono un giudizio editoriale, non un benchmark.

### 1. Requesty — il miglior compromesso generale

Requesty fa la stessa cosa di OpenRouter: 600+ modelli, 30+ provider, routing, cache, fallback, budget per chiave. La differenza è il prezzo: **5% sul costo del modello**, zero markup se porti le tue chiavi, nessun costo per utente o spesa minima.

Il piano gratuito non è una demo: accesso ai modelli gratuiti con **200 richieste al giorno**, senza carta di credito e senza scadenza. In più la residenza dei dati in UE è inclusa in tutti i piani (gateway a Francoforte), cosa che per molti progetti europei vale più del punto percentuale di differenza.

**Pregi:** prezzo semplice da calcolare, free tier generoso, EU di default, passaggio a pagamento senza cambiare chiave o URL.
**Difetti:** 5% su ogni token consumato è più caro di un gateway a markup zero; il catalogo, pur ampio, non è vasto quanto quello di OpenRouter; le funzioni enterprise (SSO, RBAC, audit) sono solo su preventivo.

**Ideale per:** sviluppatori indipendenti e piccoli team che vogliono un router gestito senza aprire un ticket commerciale.

### 2. Vercel AI Gateway — zero markup, ma il gratis finisce

Vercel applica **zero markup e nessuna fee di piattaforma**: paghi il listino del provider. Ogni team riceve **5 $ di credito al mese** utilizzabile su un sottoinsieme di modelli, con rate limit più bassi. È il costo più basso in assoluto finché resti nel free.

Il dettaglio che quasi nessuno legge: **il credito mensile sparisce per sempre al primo acquisto di crediti**. Non si somma, non si sospende: termina. Se i 5 $ sono il tuo budget hobby, non comprare crediti sullo stesso team. Aggiungi anche che il BYOK è disponibile solo nel piano a pagamento e che gli add-on (ZDR di team, allowlist, trace drain) si pagano a richiesta.

**Pregi:** markup zero reale, integrazione nativa con AI SDK e l'ecosistema Vercel, ottimo per prototipi in JavaScript/TypeScript.
**Difetti:** free tier su un sottoinsieme di modelli, crediti che scadono dopo un anno, funzioni di controllo a pagamento, ecosistema che spinge verso Vercel.

**Ideale per:** chi sviluppa in JS/TS e vuole la via più corta tra codice e modello.

### 3. OpenRouter — il catalogo resta il migliore

OpenRouter non è più il più economico, ma resta il più completo: centinaia di modelli, routing per prezzo e disponibilità, controllo dell'ordine dei provider, fallback, policy sui dati. Se ti serve un modello appena uscito, spesso è lì prima che altrove.

Il conto va fatto sul volume. Al 5,5% su 1.200 $/anno di inferenza paghi 66 $ di commissione: poco in assoluto, molto in percentuale rispetto a un gateway a markup zero. La convenienza cambia se usi **BYOK**: fino a 25.000 $/mese di inferenza a listino non hai fee aggiuntiva, e in quel caso OpenRouter diventa un ottimo pannello di controllo gratuito sulle tue chiavi.

**Pregi:** catalogo e freschezza imbattuti, free tier utile (50 → 1.000 richieste al giorno), fallback multi-provider serio, compatibilità OpenAI.
**Difetti:** 5,5% (8% Business) sui crediti, minimo 0,80 $ sulle ricariche con carta, nessun self-hosting, i modelli `:free` non sono adatti alla produzione.

**Ideale per:** chi vuole sperimentare molto e cambiare modello spesso, o chi ha già chiavi proprie e vuole un routing sopra.

### 4. Cloudflare AI Gateway — quasi gratis per i side project

Cloudflare separa due cose che gli altri uniscono: il **gateway** (cache, rate limit, analytics, retry) è gratuito su tutti i piani; il **billing unificato** verso i provider costa il 5% sulle ricariche. Se usi le tue chiavi, il gateway non ti costa nulla. In più Workers AI include **10.000 neurons al giorno** gratis, che per risposte brevi valgono qualche migliaio di chiamate.

Il limite è il catalogo: Workers AI non copre i modelli di frontiera più recenti, e alcune famiglie richiedono un metodo di pagamento anche con neurons disponibili. Il routing multi-provider è più povero rispetto a un router dedicato.

**Pregi:** costo di partenza praticamente nullo, edge globale, cache e rate limit inclusi, ottimo se sei già su Cloudflare.
**Difetti:** catalogo modelli limitato, logica di routing essenziale, funzioni avanzate legate ai piani Workers.

**Ideale per:** side project, bot, piccoli servizi che devono stare in piedi con pochi dollari.

### 5. Provider diretti — più economici, ma senza rete di sicurezza

Groq, DeepInfra, Together, Fireworks, Cerebras: non sono router, sono inferenza. Sul singolo modello aperto spesso costano meno di qualsiasi gateway, e Groq resta imbattibile sulla latenza. Però perdi il failback automatico quando un provider è saturo, e devi gestire tu chiavi, quote e migrazioni quando un modello viene ritirato.

**Pregi:** prezzo per token spesso minimo, prestazioni prevedibili, poche sorprese.
**Difetti:** nessun failover cross-provider, un account per provider, cataloghi che cambiano senza preavviso.

**Ideale per:** workload stabili su un modello preciso, dove la latenza conta più della flessibilità.

### 6. Portkey — non è risparmio, è controllo

Portkey è un gateway con observability: log, tracce, versioning dei prompt, guardrail, budget per team. Il piano Developer è gratuito con 10.000 log al mese e tre giorni di retention; il piano Production costa **49 $/mese** con 100.000 log. Il gateway è anche open source (MIT) e self-hostabile.

A 49 $/mese, Portkey costa **588 $ l'anno** indipendentemente da quanto consumi. Sotto i ~1.000 $/mese di token, un 5% è più economico. Sopra, il fisso inizia a convenire, ma solo se resti dentro il tetto dei log.

**Pregi:** osservabilità completa, guardrail all'ingresso e all'uscita, fallback, ottimo per team distribuiti.
**Difetti:** costo fisso anche con poco traffico, overage dei log, superficie di configurazione ampia per un progetto piccolo.

**Ideale per:** team che devono spiegare "quale prompt ha girato, con quale versione, a che costo".

### 7. LiteLLM e Bifrost — gratis, ma lo paghi in tempo

Sono proxy open source da installare tu. LiteLLM (Python, 100+ provider) è il più diffuso; Bifrost (Go, Apache 2.0) punta sulle performance. Nessuno dei due applica markup: il costo è l'infrastruttura, più il tempo di chi la mantiene.

**Pregi:** controllo totale, dati che non escono dalla tua rete, chiavi virtuali, budget, nessuna fee.
**Difetti:** deployment, upgrade, monitoraggio e on-call sono tuoi; per un singolo sviluppatore è spesso overkill.

**Ideale per:** aziende con requisiti di residenza dei dati o volumi tali da rendere il 5% una cifra a sei zeri.

### 8. Le nicchie: Eden AI, GPT Proto, NanoGPT

Fuori dalla categoria "router LLM" ci sono servizi con altri punti di forza. Eden AI unisce LLM, OCR, voce e traduzione con una fee del 5,5% sui crediti. GPT Proto e NanoGPT lavorano a crediti prepagati, senza abbonamento, e coprono anche immagini, video e audio. Sono interessanti quando un unico saldo deve coprire più modalità, non quando serve il miglior prezzo per token.

### Tabella punteggi

| Servizio | Costo | Catalogo | Gratis | Semplicità | Portabilità | Totale |
|---|---|---|---|---|---|---|
| Requesty | 4 | 4 | 5 | 5 | 4 | **22** |
| Vercel AI Gateway | 5 | 4 | 5 | 4 | 3 | **21** |
| OpenRouter | 3 | 5 | 4 | 5 | 3 | **20** |
| Cloudflare AI Gateway | 5 | 2 | 4 | 3 | 3 | **17** |
| LiteLLM / Bifrost | 3 | 4 | 3 | 1 | 5 | **16** |
| Portkey | 2 | 5 | 3 | 2 | 3 | **15** |
| Provider diretti | 5 | 2 | 3 | 3 | 1 | **14** |
| Nicchie (Eden, GPT Proto) | 4 | 3 | 2 | 4 | 2 | **15** |

Scala 1–5, dove 5 è il valore migliore per chi paga. Il totale non è una media pesata: serve a rendere esplicito il compromesso, non a decidere al posto tuo.

## 4. Quanto costa davvero

La commissione sembra piccola finché non la moltiplichi. Ecco il costo annuo del solo gateway, esclusi i token, a tre livelli di spesa mensile.

| Spesa token/mese | OpenRouter 5,5% | Requesty 5% | Cloudflare 5% | Vercel 0% | Portkey fisso | LiteLLM (infra) |
|---|---|---|---|---|---|---|
| 10 $ | ~7 $/anno | ~6 $/anno | ~6 $/anno | 0 $ | 588 $ | 600–2.400 $ |
| 100 $ | ~66 $/anno | ~60 $/anno | ~60 $/anno | 0 $ | 588 $ | 600–2.400 $ |
| 1.000 $ | ~660 $/anno | ~600 $/anno | ~600 $/anno | 0 $ | 588 $ + overage | 600–2.400 $ |

Tre conclusioni che si leggono male nelle tabelle dei vendor:

1. **Sotto i 100 $/mese il fisso è veleno.** Portkey costa 49 $/mese anche se ne consumi 10: è il 490% della spesa in token.
2. **Il 5% e il 5,5% sono quasi identici.** Chi ti dice che cambiare router fa risparmiare "un sacco" di solito non ha fatto i conti: su 100 $/mese la differenza tra Requesty e OpenRouter è 50 centesimi al mese.
3. **Il self-host conviene solo su volumi alti.** LiteLLM a 50 $/mese di infrastruttura batte il 5% sopra i ~1.000 $/mese di token. Sotto, stai pagando flessibilità che non usi.

Il vero risparmio non è nel router: è nella **scelta del modello**. Passare da un modello di frontiera a uno "flash" o a un open-weight di buona qualità taglia il conto del 70–90%, mentre cambiare gateway lo muove del 5%.

## 5. Abbonamenti: cosa esiste davvero

Qui c'è molta confusione, perché il marketing usa la parola "piano" per cose diverse. In pratica:

| Cosa | Esiste? | Dettaglio |
|---|---|---|
| Abbonamento mensile a un router LLM | Raramente | I router sono pay-as-you-go; l'eccezione è Portkey (49 $/mese) |
| Credito mensile gratuito | Sì | Vercel 5 $/mese, ma termina al primo acquisto |
| Piano a consumo con minimo | No | Requesty non ha minimo; OpenRouter ha 0,80 $ per ricarica |
| Abbonamento chat "illimitato" | Sì, altro prodotto | ChatGPT, Claude, Poe: non danno una chiave API |
| Trial a scadenza | Sì | Cerebras: 5 $ di credito, 30 giorni, carta richiesta |
| Piano enterprise | Sì, su preventivo | SSO, RBAC, SLA: Eden AI, Requesty, LiteLLM |

Due trappole da conoscere:

- **Il credito gratuito che si perde.** Su Vercel il credito mensile è incompatibile con l'acquisto di crediti. Se lo usi come budget da hobby, tieni quel team separato da quello dove paghi.
- **L'abbonamento chat non è una API.** Un piano da 20 $/mese su un chatbot non ti dà accesso programmatico ai modelli. Se il tuo obiettivo è usare un modello dentro un'app, ti serve una chiave API e un listino per token.

## 6. Modelli gratis: quali sono usabili davvero

Il gratis esiste, ma quasi sempre con tre condizioni: rate limit bassi, dati usati per il training e nessuno SLA. Ecco lo stato verificato a novembre 2026.

| Servizio | Cosa ottieni gratis | Limiti | Carta | Note |
|---|---|---|---|---|
| OpenRouter `:free` | 25+ modelli con suffisso `:free` | 20 req/min, 50 req/giorno (1.000 dopo 10 $ di crediti) | No | Il router `openrouter/free` sceglie un modello free per te |
| Requesty | Modelli free del catalogo | 200 req/giorno | No | Nessuna scadenza, stesse funzioni del piano pagato |
| Groq | gpt-oss-120b, gpt-oss-20b, qwen3.8-27b | 30 req/min, 1.000 req/giorno, 200K token/giorno | No | Ricorrente, non un trial; i token in cache non contano |
| Google AI Studio | Gemini Flash e Flash-Lite | Quote per progetto, reset a mezzanotte Pacific | No | I dati del free tier sono usati per migliorare i prodotti |
| Cloudflare Workers AI | 10.000 neurons/giorno | Reset alle 00:00 UTC | No | Da ~3.000 a ~14.000 risposte brevi secondo il modello |
| Mistral Free mode | Uso incluso su Studio e API | Limiti non pubblicati, visibili nella console | No | Pool condiviso con l'app: l'uso intenso lo consuma |
| Cerebras | 5 $ di credito | 30 giorni, poi si paga | Sì | Non esiste un tier gratuito permanente |

### Le voci da non citare più come "gratis"

Tre servizi continuano a comparire in liste di sei mesi fa, ma non sono più gratuiti:

- **Hugging Face Inference**: i crediti gratuiti sono stati rimossi a ottobre 2026.
- **GitHub Models**: il servizio è stato chiuso a luglio 2026.
- **Cerebras**: non è un free tier ricorrente, è un trial con carta.

### Come usare i modelli free senza farci affidamento

I modelli gratuiti sono ottimi per **imparare l'API**, testare un prompt, fare demo. Non sono adatti alla produzione per tre ragioni: il rate limit del provider può scattare anche se la tua quota è libera (è il caso più frequente di errore 429), non c'è SLA, e i dati possono essere usati per il training.

La strategia ragionevole è ibrida: **free per lo sviluppo, un modello economico a pagamento per la produzione**, con il router che fa fallback quando il free è saturo. Su OpenRouter, ad esempio, comprare una volta 10 $ di crediti porta il tetto da 50 a 1.000 richieste al giorno: è il modo più economico per non sbattere contro il limite mentre si testa.

## 7. Come scegliere in 60 secondi

| La tua situazione | Scelta |
|---|---|
| "Voglio una chiave sola e cambiare modello ogni giorno" | OpenRouter o Requesty |
| "Ho già le chiavi dei provider" | Requesty (0% BYOK) o OpenRouter (fino a 25.000 $/mese) |
| "Sviluppo in TypeScript con AI SDK" | Vercel AI Gateway |
| "Devo restare in UE per GDPR" | Requesty con endpoint EU, o LiteLLM in casa |
| "Ho 5 $ al mese di budget" | Vercel (credito mensile) o Cloudflare Workers AI |
| "Faccio un side project che deve costare zero" | Cloudflare AI Gateway + modelli free |
| "Devo loggare e proteggere le richieste in produzione" | Portkey |
| "Ho un team e voglio i dati in casa" | LiteLLM o Bifrost |
| "Voglio solo chattare" | Abbonamento al chatbot, non un router |

## 8. Checklist prima di migrare

1. **Compatibilità non è identità.** Un endpoint "OpenAI-compatible" non garantisce lo stesso comportamento su streaming, tool calling, campi di reasoning e mappatura degli errori. Testa il tuo caso reale, non il "ciao mondo".
2. **Leggi la fee nel punto esatto in cui paghi.** Markup per token e commissione sui crediti producono numeri diversi sugli stessi consumi.
3. **Verifica il minimo di ricarica.** Sui budget piccoli può valere più della percentuale.
4. **Controlla la scadenza dei crediti.** Un credito che scade non è un credito.
5. **Chiedi dove finiscono i dati.** Gateway in UE non significa inferenza in UE: sono due passaggi distinti.
6. **Prevedi l'uscita.** Se il router espone solo la sua API, migrare costerà tempo. Un layer compatibile OpenAI ti salva.
7. **Misura prima di migrare.** Annota costo per richiesta, latenza p95 e tasso di 429 per due settimane: senza numeri, stai solo cambiando logo.

## Conclusione

Se dovessi dare un solo consiglio: **parti da Requesty se vuoi un router gestito, da Vercel se sei in JavaScript, da Cloudflare se il budget è vicino a zero**. OpenRouter resta la scelta giusta quando il catalogo e il failover contano più del 5,5%, e continua a essere il posto migliore dove scoprire i modelli nuovi.

La cosa che cambia davvero la bolletta non è il gateway, però: è smettere di usare un modello di frontiera per un compito che un modello economico risolve uguale. Il router decide dove va la richiesta; il modello decide quanto costa.

## Fonti

- [OpenRouter — Pricing](https://openrouter.ai/pricing) e [Rate limits](https://openrouter.ai/docs/api_reference/limits)
- [Requesty — Pricing](https://www.requesty.ai/pricing) e [Free models](https://www.requesty.ai/free-models)
- [Vercel AI Gateway — Pricing](https://vercel.com/docs/ai-gateway/pricing)
- [Cloudflare Workers AI — Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Portkey — Pricing](https://portkey.ai/pricing)
- [LiteLLM](https://www.litellm.ai/) e [Bifrost](https://github.com/maximhq/bifrost)
- [Groq — Rate limits](https://console.groq.com/docs/rate-limits)
- [Google — Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Cerebras — Rate limits](https://inference-docs.cerebras.ai/support/rate-limits)
