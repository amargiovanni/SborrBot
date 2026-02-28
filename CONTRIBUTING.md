# 🤝💦 Contribuire a SborrBot

Quindi vuoi contribuire a SborrBot? Bravo, coglione. Benvenuto nel cesso più bello di GitHub.

Prima di toccare qualsiasi cosa leggi questa guida **per intero**, perché se apri una PR del cazzo che non rispetta le regole te la chiudo in faccia e ti blocco. Non per cattiveria, ma perché ho altro da fare oltre a leggere il tuo codice scritto col culo.

---

## 📋 Regole d'Oro (a.k.a. se non le rispetti che diarrea ti colga)

1. **Non rompere il cazzo con PR inutili** — Se la tua PR cambia un commento da `// calcola` a `// fa il calcolo` ti banno. Contribuisci con roba vera.
2. **Il codice deve funzionare** — Sembra ovvio, vero? Eppure c'è gente che apre PR con errori di sintassi. Testa il tuo codice prima di committerlo, animale.
3. **Scrivi in TypeScript** — JavaScript vanilla nel 2026? Ma vai a cagare. Questo progetto è TypeScript e tale rimane.
4. **Rispetta il tono del progetto** — SborrBot è scurrile, irriverente e cazzaro. Se aggiungi risposte tipo "Oh cielo, che brutta parola!" sei nel progetto sbagliato.

---

## 🔧 Setup per lo Sviluppo

Prima di tutto, leggi il README. Sì, tutto. Se non riesci a fare il setup da solo dopo aver letto il README, forse contribuire a un progetto open source non fa per te. Torna a fare tutorial su YouTube.

```bash
# Forka il repo (bottone in alto a destra su GitHub, ce la fai?)
# Poi clona il TUO fork, non il mio
git clone https://github.com/IL-TUO-USERNAME/SborrBot.git
cd SborrBot
npm install
```

### Struttura del progetto (studia, capra)

```
SborrBot/
├── worker/        # Il bot vero e proprio (Cloudflare Worker)
├── backoffice/    # Pannello admin (Astro + Tailwind)
├── shared/        # Tipi TypeScript condivisi
├── migrations/    # Schema e dati D1
└── package.json   # Root monorepo (npm workspaces)
```

Non toccare roba a caso. Se devi aggiungere un comando al bot, stai nel `worker/`. Se devi migliorare il pannello admin, stai nel `backoffice/`. Se devi modificare i tipi condivisi, stai in `shared/`. Non è fisica quantistica, cretino.

---

## 🌿 Branching e Commit

### Crea un branch

Non committare su `main`. MAI. Se lo fai, che un'esplosione di diarrea ti sorprenda durante una call di lavoro.

```bash
git checkout -b feature/nome-della-feature
# oppure
git checkout -b fix/cosa-hai-fixato
```

Nomi di branch accettabili:
- `feature/comando-oroscopo`
- `fix/audio-non-si-sente`
- `refactor/cleanup-bot-dispatcher`

Nomi di branch da ritardati:
- `update`
- `fix`
- `prova`
- `aaaa`
- `test-cose`

### Messaggi di Commit

Scrivi commit message **decenti**, in inglese, e che spieghino cosa cazzo hai fatto. Il progetto usa Conventional Commits perché non siamo bestie (beh, non del tutto).

```
feat: add oroscopo command with zodiac sign detection
fix: audio files not playing in groups with restricted media
refactor: extract telegram API calls into service layer
```

Messaggi inaccettabili (che diarrea ti colga se li usi):
- `fix`
- `update`
- `changes`
- `asdlkjasd`
- `prova se funziona`
- `WIP WIP WIP`
- `commit finale` (non è mai finale, stronzo)

---

## 📝 Come Aprire una Pull Request

### 1. Prima di tutto: apri una Issue

Hai un'idea? Un bug da segnalare? **Apri prima una issue.** Non aprire PR dal nulla come un pazzo. Voglio sapere cosa vuoi fare PRIMA che tu scriva codice, così eviti di perdere tempo e io evito di perdere pazienza.

### 2. Scrivi codice che non fa schifo

Checklist prima di aprire la PR:

- [ ] Il codice compila senza errori (`npx tsc --noEmit` nella cartella giusta)
- [ ] Hai testato localmente che funziona (worker: `npx wrangler dev`, backoffice: `npm run dev`)
- [ ] Non hai committato `node_modules/`, `.wrangler/`, file `.env` o altri coglionate
- [ ] Non hai cambiato i `wrangler.toml` con i TUOI ID di database/bucket
- [ ] I tipi TypeScript sono corretti, non hai usato `any` a cazzo (se vedo un `as any` senza un ottimo motivo ti vengo a cercare)
- [ ] Il codice segue lo stile del progetto (guarda come è scritto il resto, copia quello, non inventarti formattazioni creative)

### 3. La PR deve avere

- **Titolo chiaro** — cosa fa questa PR, in una riga
- **Descrizione** — spiega PERCHÉ hai fatto queste modifiche, non solo COSA
- **Screenshot/video** — se è una modifica visiva al backoffice, metti gli screenshot. Non sono un indovino.
- **Issue collegata** — `Closes #123` o `Fixes #456`

### 4. Code Review

Leggerò il tuo codice. Lo criticherò. Non prenderla sul personale, sto cercando di mantenere il progetto pulito. Se chiedo modifiche, falle senza lamentarti. Se non capisci il feedback, chiedi — non ignorarlo e basta.

---

## 🏗️ Linee Guida per il Codice

### Worker (Bot)

Il bot vive in `worker/src/` ed è organizzato così:

- **`commands/`** — Ogni tipo di comando ha il suo file. Se aggiungi un comando nuovo, mettilo nel file giusto o creane uno nuovo se è una categoria completamente diversa.
- **`services/`** — Logica di business e interazione con D1, R2, API Telegram. Non mettere query SQL nei command handler, deficiente. Usa i service.
- **`middleware/`** — Roba che deve girare prima dei comandi (check gruppi, logging, ecc.)

Pattern da seguire quando aggiungi un comando:

```typescript
// 1. Aggiungi il pattern di match in bot.ts
// 2. Crea/aggiorna il handler nel file commands/ appropriato
// 3. Se serve un nuovo tipo di dato, aggiorna shared/types.ts
// 4. Se serve una nuova tabella, crea una migration in migrations/
```

### Backoffice

Il backoffice è Astro 5 con Tailwind CSS. È server-rendered su Cloudflare Pages.

- Le pagine stanno in `backoffice/src/pages/`
- Il layout con la sidebar è in `backoffice/src/layouts/Layout.astro`
- Lo stile è dark theme. Non aggiungere roba bianca accecante, non siamo su un sito del 2003
- Se aggiungi una nuova pagina, aggiungila anche alla sidebar nel layout

### Migrazioni D1

Se la tua feature richiede modifiche al database:

1. Crea un nuovo file in `migrations/` con il numero sequenziale successivo (es. `0009_tua_feature.sql`)
2. La migration deve essere **idempotente** dove possibile (`CREATE TABLE IF NOT EXISTS`, `INSERT OR IGNORE`)
3. Non modificare MAI le migrazioni esistenti. Le migrazioni sono come i tatuaggi: una volta fatte, te le tieni
4. Documenta cosa fa la migration con un commento SQL in cima al file

---

## 🚫 Cosa NON Fare (o giuro che ti maledico)

- **Non aggiungere dipendenze a cazzo** — Vuoi aggiungere lodash per usare `_.get()`? Ma usa l'optional chaining come una persona normale, dio bestia. Ogni dipendenza aggiunta deve essere giustificata nella PR.
- **Non cambiare la formattazione di file che non c'entrano** — Se il tuo editor auto-formatta tutto il file quando modifichi una riga, configura il tuo editor come si deve. Non voglio review da 500 righe cambiate di cui 2 rilevanti.
- **Non pushare secrets, token, o credenziali** — Se vedo un BOT_TOKEN nei tuoi commit ti segnalo a GitHub, a Telegram e a tua madre. Usa i file `.env` (che sono in `.gitignore` per una ragione, genio).
- **Non fare refactoring giganti senza chiedere** — Se vuoi ristrutturare mezza codebase apri prima una issue e discutiamone. Non voglio PR da 47 file che "migliorano la struttura" e rompono tutto.
- **Non aggiungere feature che nessuno ha chiesto** — Hai aggiunto un sistema di achievement con badge NFT? Bellissimo. Chiudi la PR.

---

## 💡 Idee per Contribuire

Se non sai da dove partire, ecco delle robe che servirebbero:

- **Nuovi comandi testuali** — Oroscopo del cazzo, ricette assurde, fatti falsi... la fantasia è il limite
- **Inline mode** — Al momento il bot funziona solo in gruppo. L'inline mode sarebbe una figata
- **Comandi personalizzabili per gruppo** — Ogni gruppo potrebbe attivare/disattivare categorie specifiche
- **Miglioramenti al backoffice** — Grafici migliori, UX più fluida, nuove pagine di gestione
- **Documentazione** — Sì, anche quella serve. Se scrivi documentazione utile ti voglio bene (ma non troppo)
- **Bug fix** — Guarda le issue aperte, ce n'è sempre qualcuna

---

## 🐛 Segnalare Bug

Hai trovato un bug? Bravo. Apri una issue con:

1. **Cosa dovrebbe succedere** — Il comportamento atteso
2. **Cosa succede invece** — Il comportamento reale (quello rotto)
3. **Come riprodurlo** — Step precisi per riprodurre il bug
4. **Contesto** — In che gruppo? Con che comando? Da mobile o desktop?

Issue tipo "il bot non funziona" verranno chiuse all'istante. Non sono un cazzo di sensitivo, dammi dettagli.

---

## 🏷️ Label delle Issue

| Label | Significato |
|-------|------------|
| `bug` | Qualcosa è rotto |
| `feature` | Qualcosa di nuovo da aggiungere |
| `enhancement` | Miglioria a qualcosa che esiste già |
| `good first issue` | Facile, per chi è alle prime armi (ma sa leggere) |
| `help wanted` | Serve una mano, chi c'è c'è |
| `wontfix` | No. |

---

## ⚖️ Licenza

Contribuendo a SborrBot accetti che il tuo codice sia rilasciato sotto licenza MIT. Se non sai cosa vuol dire, googlalo. Se non sai googlare, chiudi il computer e vai a fare una passeggiata.

---

## 🙏 Grazie

Se arrivi fino a qui e contribuisci sul serio, grazie davvero. Ogni PR valida è apprezzata, anche se ti insulto durante la code review. È il mio modo di mostrare affetto.

Ora vai a scrivere codice, e che la sborra sia con te. 💦
