---
title: "Furto da 6.3 miliardi in Binance: Anatomia di un furto multichain"
date: 2026-10-31 08:00:00 +0100
description: "Analisi tecnica delle transazioni, delle autorizzazioni EIP-7702 e dei limiti delle evidenze pubbliche sul furto da 6,3 miliardi di dollari."
tags: [sicurezza, blockchain, ethereum, bitcoin, binance, analisi-forense]
article_style: true
---

<section class="binance-status" aria-labelledby="binance-status-heading">
  <header class="binance-status-header">
    <h2 id="binance-status-heading">Stato delle informazioni</h2>
    <p class="binance-status-revision">Ultima revisione: 4 novembre 2026</p>
  </header>
  <p>L'articolo presenta una ricostruzione tecnica basata sulle informazioni pubblicamente disponibili.</p>
</section>

## Sintesi

Il 29 ottobre 2026, intorno alle **20:05 UTC**, Binance ha segnalato la compromissione di hot wallet con circa **6,3 miliardi di dollari** in asset sottratti. Binance afferma di avere congelato circa **3 miliardi** tramite cooperazione con emittenti e partner, di coprire le perdite con fondi SAFU e aziendali e di non avere, al momento, evidenze di esfiltrazione delle chiavi private. L'ipotesi iniziale di un laptop DevOps compromesso è stata ampliata dopo l'identificazione di ulteriori punti d'ingresso. [1](https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7) [2](https://www.binance.com/en/support/announcement/detail/d3306d9dca5243548c813b605e1d1751)

Le analisi di società specializzate descrivono movimenti coordinati su Ethereum, Bitcoin, Tron, XRP Ledger, Solana e varie reti EVM. L'elemento tecnico più insolito è l'uso segnalato di **EIP-7702** su Ethereum: una delega di codice può conferire a un account esterno capacità di esecuzione programmabile senza trasferire la sua chiave privata. [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)

**Tesi investigativa:** la contemporaneità delle spese su chain con differenti sistemi di firma è compatibile con l'abuso di un'infrastruttura di autorizzazione multi-chain. Non dimostra, da sola, né un singolo sistema centrale compromesso né l'assenza di furto delle chiavi.


## Cronologia

| Momento | Evento | Evidenza |
|---|---|---|
| 28 ottobre | Attività preparatorie e finanziamento di wallet operativi secondo ricercatori | Analisti on-chain |
| 29 ottobre, ~20:05 | Inizio dell'incidente riportato da Binance | Binance [2](https://www.binance.com/en/support/announcement/detail/d3306d9dca5243548c813b605e1d1751) |
| ~20:05–20:10 | Primi deflussi XRP e attività su altre reti | Analisti [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/) |
| ~20:20–20:25 | Operazioni su Bitcoin, Ethereum e Tron; delega e drenaggio Ethereum descritti dai ricercatori | Analisti [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/) |
| Ore successive | Ulteriori sweep, conversioni e congelamenti | Analisti [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/) |
| 30 ottobre | Contenimento, revoca di autorizzazioni, sospensione temporanea dei prelievi | Binance [1](https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7) [2](https://www.binance.com/en/support/announcement/detail/d3306d9dca5243548c813b605e1d1751) |
| 3 novembre | Binance pubblica i risultati tecnici iniziali, inclusi dettagli su intrusione, servizio di firma e contenimento delle deleghe EIP-7702 | Binance [6](https://www.binance.com/en/square/post/384336744180903) |

**Tutti gli orari della cronologia sono in UTC.** Gli orari riportati da diverse fonti possono identificare la firma, l'inclusione nel blocco o il rilevamento; non vanno fusi senza normalizzazione.

## 1. Ethereum: EIP-7702 e persistenza dell'attacco

### Cos'è EIP-7702?

Con EIP-7702, un account Ethereum tradizionale (EOA) può autorizzare una delega verso codice di smart contract. La delega è distinta dal trasferimento della chiave privata: se il codice delegato permette operazioni arbitrarie, il suo abuso può comunque spostare gli asset dell'account. Il protocollo verifica firme e nonce; non può stabilire se un'autorizzazione valida sia stata ottenuta legittimamente. Si veda la [specifica EIP-7702](https://eips.ethereum.org/EIPS/eip-7702).

### Sequenza riportata

Le analisi pubbliche riferiscono di un insieme di **50 autorizzazioni con nonce differenti**, concepite per aumentare la probabilità che una corrispondesse al nonce effettivo del wallet operativo. Una volta stabilita la delega, un contratto *sweeper* avrebbe drenato fondi iniziali e nuovi depositi fino alla revoca. [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)

L'indirizzo pubblico comunemente etichettato **Binance 14** è `0x28c6c06298d514db089934071355e5743bf21d60`. Un'etichetta di explorer non è però prova sufficiente di proprietà o ruolo operativo.

**Transazioni indicate da ricercatori, da verificare indipendentemente:**

| Evento attribuito | Hash | Explorer |
|---|---|---|
| Autorizzazione/delega | `0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b` | [Etherscan](https://etherscan.io/tx/0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b) |
| Drenaggio principale | `0x53bd38b816c23e74134786c29a8c18d792777998a3b9326047b583100e88e2f3` | [Etherscan](https://etherscan.io/tx/0x53bd38b816c23e74134786c29a8c18d792777998a3b9326047b583100e88e2f3) |
| Revoca | `0xafbf94c92a8d749988411669fa14d4f8866d9b4420b4ebd299f28e958dac7209` | [Etherscan](https://etherscan.io/tx/0xafbf94c92a8d749988411669fa14d4f8866d9b4420b4ebd299f28e958dac7209) |

**Verifiche necessarie:** tipo della transazione, `authorization_list`, `chain_id`, `nonce`, account autorizzante, indirizzo delegato, bytecode, trace interne, eventi ERC-20, gas, ordinamento per blocco e stato del codice dopo la revoca. Senza queste verifiche non si può trattare la lista come un dataset forense certificato.

### Movimento laterale

Alcuni analisti riportano che i privilegi o le relazioni operative dell'account delegato avrebbero permesso di coinvolgere un secondo hot wallet e circa **823 milioni di USDC**. Resta ignoto il preciso meccanismo autorizzativo: ruolo amministrativo, delega preesistente o altro controllo compromesso. [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)

## 2. Bitcoin: firme valide e frammentazione UTXO

Le ricostruzioni riportano circa **18.270 BTC** sottratti. Il modello UTXO permette di seguire gli output spesi e creati, ma la successiva frammentazione in più indirizzi non prova di per sé riciclaggio o perdita della tracciabilità. [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)

Indirizzi da controllare nei dataset pubblici:
- Sorgente attribuita a Binance: `bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h`
- Destinatario iniziale attribuito: `bc1q0mtc2f5agpkvlq6hhahmfr3hlr55kyfjhl2mnm`

Per ricostruire il flusso occorrono gli hash delle transazioni, tutti gli input e output, l'identificazione del resto (*change*), le fee, l'altezza dei blocchi e il grafo di spesa successivo. Una firma Bitcoin valida non prova se la chiave sia stata rubata o usata da un servizio compromesso.

## 3. Tron: USDT, TRX e rischio di congelamento

Le analisi riportano circa **612,7 milioni USDT** e **46,4 milioni TRX** in uscita. I ricercatori descrivono anche swap di stablecoin in TRX, che può ridurre l'esposizione a congelamenti dell'emittente ma non cancella la cronologia pubblica. [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)

Indirizzi segnalati:
- Sorgente: `TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf`
- Destinazione: `TG5iBMQPrDzJJAUM8GMVBf1hRaJ1wvzsGi`

Per distinguere furto iniziale e conversioni successive bisogna confrontare `Transfer` TRC-20, trasferimenti nativi TRX, chiamate ai router DEX e variazioni dei saldi. Sommare tutte le movimentazioni successive al furto genererebbe doppi conteggi.

## 4. XRP Ledger: più sorgenti e un destinatario

Le ricostruzioni attribuiscono a cinque wallet Binance il trasferimento complessivo di circa **233,46 milioni XRP** verso `rK21t6nGLy4MNDqhvy3pGwcLFy25qgfzMx`. [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)

Per verificare l'attribuzione occorrono cinque hash, ledger index, sequence, `DestinationTag`, fee e saldi prima/dopo. Il mantenimento della riserva minima di un account non prova da solo l'identità dell'attaccante.

## 5. Solana: trasferimenti SOL

Secondo i dataset pubblicati sarebbero stati sottratti circa **970.500 SOL**. [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)

- Sorgente attribuita: `5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9`
- Destinazione: `AffzFDKZbyMiU11zmVBoAqD25ugpr7xoWWyRyGigBEaU`

Una verifica richiede signature delle transazioni, slot, istruzioni System Program, signer, account coinvolti e bilanci pre/post. Solana non usa EIP-7702: il suo coinvolgimento rafforza l'esigenza di indagare il livello applicativo e di autorizzazione comune, senza dimostrare quale componente sia stato violato.

## 6. Arbitrum, Base, Optimism, Avalanche e Polygon

Le analisi descrivono deflussi anche su queste reti, con differenze tra le stime del numero complessivo di chain. Non è metodologicamente corretto assegnare un importo preciso a ogni rete senza un inventario di hash e token contract. [3](https://www.bitquery.io/investigations/binance-hack) [4](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)

L'intervento riportato del Security Council di Arbitrum e i congelamenti operati da emittenti di stablecoin sono **meccanismi diversi**: un controllo sulla rete o sulla sua infrastruttura non equivale alla funzione di blacklist incorporata in un token.

## 7. Dove sono finiti i fondi?

Occorre separare quattro grandezze:

1. **Deflusso iniziale** dai wallet Binance.
2. **Movimenti interni** tra indirizzi dell'attaccante.
3. **Swap e bridge**, che cambiano forma o rete degli asset ma non costituiscono un nuovo furto.
4. **Fondi congelati, recuperati o ancora disponibili**, misurati a una precisa data e ora.

Bitquery riferisce conversioni di stablecoin prima dei congelamenti e una parte consistente degli asset ancora detenuta in wallet riconducibili agli aggressori al momento della propria fotografia. Le stime di Binance (~3 miliardi congelati) e degli analisti possono divergere per tempistica e perimetro. [2](https://www.binance.com/en/support/announcement/detail/d3306d9dca5243548c813b605e1d1751) [3](https://www.bitquery.io/investigations/binance-hack)

## 8. Ipotesi di compromissione e limiti

Sulla base delle informazioni pubbliche, la sequenza generale è: compromissione di postazioni e credenziali → accesso non autorizzato al servizio di firma → trasferimenti su più chain → delega EIP-7702 persistente su Ethereum → contenimento, conversioni e congelamenti. Il rapporto preliminare di Binance del 3 novembre descrive alcune fasi dell'intrusione, ma non costituisce ancora il post-mortem definitivo. [6](https://www.binance.com/en/square/post/384336744180903)

Non sappiamo:
- La catena completa delle vulnerabilità e dei controlli aggirati durante l'intrusione.
- Se siano state sottratte credenziali, sessioni, chiavi o più elementi insieme.
- Come fossero configurati in dettaglio il sistema MPC, le policy di firma e gli eventuali altri dispositivi di protezione. Binance ha confermato l'uso di MPC per l'hot wallet Ethereum coinvolto. [6](https://www.binance.com/en/square/post/384336744180903)
- Quali controlli abbiano fallito, in quale ordine e con quali log.
- L'identità accertata degli aggressori.

Attribuzioni geopolitiche pubblicate da società di intelligence vanno riportate come **valutazioni degli analisti**, non come identificazioni giudiziarie definitive.

## 9. Come riprodurre un audit indipendente

Un dataset forense verificabile dovrebbe contenere, per **ogni transazione**, almeno: `chain`, `tx_hash/signature`, `block/slot`, `timestamp_utc`, `from`, `to`, `asset`, `token_contract`, `raw_amount`, `decimals`, `fee`, `event_type`, `cluster_attribution`, `source`, `confidence`.

Pipeline consigliata:

1. Acquisire transazioni e trace da nodi o API blockchain affidabili.
2. Normalizzare token, decimali, timestamp e ID di chain.
3. Etichettare separatamente deflussi iniziali, sweep, swap, bridge e congelamenti.
4. Riconciliare il valore sottratto **una sola volta** per asset e transazione originaria.
5. Registrare i prezzi storici e la metodologia di conversione USD.
6. Conservare query, block hash e data di acquisizione per consentire la riproduzione.
7. Confrontare i risultati con il futuro post-mortem Binance e pubblicare un changelog delle correzioni.

## 10. Lezioni per la sicurezza dei sistemi di custodia

Il caso suggerisce di valutare separazione rigorosa dei privilegi, approvazioni indipendenti, limiti di spesa per wallet e chain, policy di firma verificabili, blocchi automatici su anomalie, inventario delle deleghe EIP-7702 e procedure rapide di revoca. Queste sono **raccomandazioni generali**, non prove che Binance ne fosse sprovvista.

Per i possessori di ETH e USDC, la distinzione cruciale è tra rischio dell'exchange e rischio del protocollo: un hardware wallet riduce l'esposizione delle chiavi a dispositivi connessi, ma non elimina phishing, firme dannose o il rischio di congelamento delle stablecoin.

## Conclusione

Le evidenze pubbliche supportano l'esistenza di un grave incidente multi-chain e rendono credibile un abuso dei processi di autorizzazione e firma. **Non consentono ancora una verifica indipendente completa della catena d'intrusione né di attribuire una causa tecnica definitiva.** Il post-mortem ufficiale dovrà chiarire accesso, escalation, firma, controlli falliti e contenimento.

## Fonti e approfondimenti

1. [Binance — Security Incident Update (30 ottobre 2026)](https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7)
2. [Binance — Security Incident Update #2 (30 ottobre 2026)](https://www.binance.com/en/support/announcement/detail/d3306d9dca5243548c813b605e1d1751)
3. [Bitquery — Binance Hack: analisi on-chain](https://www.bitquery.io/investigations/binance-hack)
4. [Reuters — Gone in 20 minutes: How the biggest heist in crypto history unfolded](https://www.reuters.com/legal/government/gone-20-minutes-how-biggest-heist-crypto-history-unfolded-2026-10-30/)
5. [Ethereum Improvement Proposal 7702](https://eips.ethereum.org/EIPS/eip-7702)
6. [Binance — Initial Findings and Response Update (3 novembre 2026, rapporto preliminare)](https://www.binance.com/en/square/post/384336744180903)

*Il rapporto Binance del 3 novembre è preliminare. L'articolo sarà aggiornato alla pubblicazione del post-mortem definitivo e alla disponibilità di un dataset completo e riproducibile.*
