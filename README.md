# 🤖💦 SborrBot

**Il bot Telegram più sborrante che esista.** Ispirato al leggendario SpacoBot, ma più cattivo, più scurrile e con un pannello admin che te lo sogni.

Insulta i tuoi amici, mandali affanculo con stile, bestemmia come Germano Mosconi e fai piovere tette e culi nelle chat di gruppo. Tutto su Cloudflare, perché anche le porcherie meritano un'infrastruttura seria.

---

## 🍆 Che cazzo fa questo bot?

SborrBot è un bot di intrattenimento per gruppi Telegram che risponde a keyword naturali (niente slash del cazzo per i comandi principali). Scrivi "insulta Mario" e il bot gli fa il culo a strisce. Scrivi "bestemmia" e ti parte un porco dio che Germano Mosconi si gira nella tomba.

### Comandi Testuali (scrivi e godi)

| Comando | Che fa |
|---------|--------|
| `insulta [nome]` | Genera un insulto personalizzato per la vittima designata |
| `minaccia [nome]` | Minaccia di morte (scherzosa... forse) il malcapitato |
| `bestemmia` | Una bella bestemmia fresca fresca. Dio porco. |
| `come diceva mio nonno` | Saggezza popolare rivisitata in chiave scurrile |
| `buongiorno` | Un buongiorno dei nostri |
| `buonanotte` | Augurio della buonanotte col cuore |
| `ciao` | Saluto personalizzato dallo Sborratore |

### Comandi Foto (NSFW, cazzo) 📸

| Comando | Che fa |
|---------|--------|
| `fica` | Invia una foto di fica random. Sì, proprio quello che pensi. |
| `culo` | Culi. Tanti culi. |
| `tette` | Tette. Che domande. |

> ⚠️ Ovviamente i contenuti NSFW li devi caricare tu dal backoffice, coglione. Il bot non genera porno da solo.

### Comandi Audio 🔊

| Comando | Chi parla |
|---------|-----------|
| `germano mosconi` | Il mitico Germano Mosconi. PORCO DIO IN DIRETTA. |
| `christian de sica` | Le perle di Christian De Sica |
| `homer simpson` | D'oh! Le citazioni di Homer |
| `i soliti idioti` | Audio de I Soliti Idioti |
| `richard benson` | IL GRANDE RICHARD BENSON |
| `effetti sonori` | Effetti sonori vari per ogni occasione |

### Sticker 🎨

| Comando | Sticker |
|---------|---------|
| `apple` | Steve Jobs che ti giudica |
| `banana` / `minion` | Minion del cazzo |
| `non ci sono` | Sticker di disapprovazione totale |

### Controllo ⚙️

| Comando | Effetto |
|---------|---------|
| `zitto sborrbot` | Metti a cuccia il bot nel gruppo (sta zitto ma non se ne va) |
| `sveglia sborrbot` | Risveglia la bestia |

### Slash Commands (per i boomer)

| Comando | Descrizione |
|---------|-------------|
| `/start` | Messaggio di benvenuto |
| `/help` | Lista completa dei comandi |
| `/info` | Info sul bot |
| `/testo` | Lista categorie testo |
| `/foto` | Lista categorie foto |
| `/audio` | Lista categorie audio |
| `/sticker` | Lista categorie sticker |

---

## 🏗️ Architettura (roba seria, per una volta)

```
┌──────────────────┐
│  Telegram API    │
└────────┬─────────┘
         │ Webhook POST
         ▼
┌──────────────────┐     ┌─────────┐     ┌─────────┐
│ Cloudflare Worker│────▶│   D1    │◀────│  Astro  │
│   (Bot Handler)  │     │Database │     │Backoffice│
│                  │────▶│         │     │  + TW   │
└──────────────────┘     └─────────┘     └─────────┘
         │                                    │
         ▼                                    ▼
    ┌─────────┐                          ┌─────────┐
    │   R2    │◀─────────────────────────│  Upload │
    │ Storage │                          │  Media  │
    └─────────┘                          └─────────┘
```

### Stack Tecnologico

| Componente | Tecnologia |
|-----------|------------|
| **Bot** | Cloudflare Worker (TypeScript) |
| **Database** | Cloudflare D1 (SQLite at the edge) |
| **Media Storage** | Cloudflare R2 (S3-compatible) |
| **Backoffice** | Astro 5 + Tailwind CSS su Cloudflare Pages |
| **Auth** | Session cookie + credenziali da env vars Cloudflare |

### Struttura del Progetto

```
SborrBot/
├── worker/                 # Il cervello del bot (Cloudflare Worker)
│   ├── src/
│   │   ├── index.ts        # Entry point: webhook + register
│   │   ├── bot.ts          # Dispatcher principale
│   │   ├── commands/
│   │   │   ├── slash.ts    # /start, /help, /info, etc.
│   │   │   ├── text.ts     # insulta, minaccia, bestemmia, nonno, saluti
│   │   │   ├── media.ts    # Audio e foto (R2 → Telegram)
│   │   │   ├── sticker.ts  # Sticker per file_id
│   │   │   └── control.ts  # zitto/sveglia
│   │   ├── middleware/
│   │   │   ├── group-check.ts  # Verifica se il bot è attivo nel gruppo
│   │   │   └── logger.ts       # Logga ogni comando su D1
│   │   └── services/
│   │       ├── db.ts        # Query D1
│   │       ├── storage.ts   # Lettura R2
│   │       └── telegram.ts  # Client API Telegram
│   └── wrangler.toml
│
├── backoffice/             # Pannello admin (Astro + Tailwind)
│   ├── src/
│   │   ├── layouts/Layout.astro    # Layout dark con sidebar
│   │   ├── pages/
│   │   │   ├── login.astro         # Login (credenziali da env)
│   │   │   ├── dashboard.astro     # Statistiche fighe
│   │   │   ├── content/            # CRUD testi, audio, foto, sticker
│   │   │   ├── groups.astro        # Gestione gruppi
│   │   │   ├── logs.astro          # Log comandi searchable
│   │   │   └── settings.astro      # Configurazione bot
│   │   ├── middleware/index.ts     # Auth guard
│   │   └── lib/                    # Helpers D1 e auth
│   └── wrangler.toml
│
├── migrations/             # Schema D1
│   ├── 0001_initial_schema.sql
│   └── 0002_seed_data.sql
│
├── shared/                 # Tipi TypeScript condivisi
│   └── types.ts
│
└── package.json            # Root monorepo (npm workspaces)
```

---

## 🚀 Setup (per i non ritardati)

### Prerequisiti

- Node.js 18+
- Un account Cloudflare (gratis, tirchio del cazzo)
- Un bot Telegram (crealo su [@BotFather](https://t.me/BotFather), è gratis pure quello)
- `wrangler` CLI installato (`npm install -g wrangler`)

### 1. Clona e installa

```bash
git clone https://github.com/tuorepo/SborrBot.git
cd SborrBot
npm install
cd worker && npm install && cd ..
cd backoffice && npm install && cd ..
```

### 2. Crea le risorse Cloudflare

```bash
# Logga su Cloudflare
wrangler login

# Crea il database D1
wrangler d1 create sborrbot-db
# → Copia il database_id e mettilo in worker/wrangler.toml E backoffice/wrangler.toml

# Crea il bucket R2
wrangler r2 bucket create sborrbot-media
```

### 3. Aggiorna i wrangler.toml

Prendi il `database_id` dall'output del comando precedente e sostituiscilo in:
- `worker/wrangler.toml` → `database_id = "il-tuo-id-qui"`
- `backoffice/wrangler.toml` → `database_id = "il-tuo-id-qui"`

### 4. Esegui le migrazioni

```bash
# Locale (per sviluppo)
cd worker
npx wrangler d1 execute sborrbot-db --local --file=../migrations/0001_initial_schema.sql
npx wrangler d1 execute sborrbot-db --local --file=../migrations/0002_seed_data.sql

# Remoto (per produzione)
npx wrangler d1 execute sborrbot-db --remote --file=../migrations/0001_initial_schema.sql
npx wrangler d1 execute sborrbot-db --remote --file=../migrations/0002_seed_data.sql
cd ..
```

### 5. Configura i secrets

```bash
# Worker — il token del bot (quello di BotFather)
cd worker
wrangler secret put BOT_TOKEN
# → Incolla il token quando te lo chiede

# Il BOT_SECRET nel wrangler.toml cambialo con qualcosa di serio, coglione.
# Non lasciare "change-me-in-production"

cd ../backoffice
# Backoffice — credenziali admin
wrangler secret put ADMIN_USERNAME
wrangler secret put ADMIN_PASSWORD
wrangler secret put SESSION_SECRET
cd ..
```

### 6. Deploy

```bash
# Deploy il worker
cd worker
npx wrangler deploy
# → Ti darà un URL tipo: https://sborrbot-worker.tuousername.workers.dev

# Deploy il backoffice
cd ../backoffice
npx astro build
npx wrangler pages deploy dist
# → Ti darà un URL tipo: https://sborrbot-backoffice.pages.dev
```

### 7. Registra il webhook

Apri nel browser:
```
https://sborrbot-worker.tuousername.workers.dev/register
```

Se vedi `{"ok":true}` sei a posto. Il bot è vivo e pronto a sborrare.

---

## 🖥️ Backoffice

Il pannello admin è una figata. Dark theme, sidebar, tutto responsive.

### Come accedere

1. Vai su `https://sborrbot-backoffice.pages.dev/login`
2. Inserisci le credenziali che hai impostato come secrets
3. Goditi il pannello

### Cosa puoi fare

- **Dashboard** — Vedi quanti comandi sono stati eseguiti, i gruppi attivi, i comandi più usati, il trend degli ultimi 7 giorni
- **Testi** — Aggiungi/elimina frasi per ogni categoria (insulti, minacce, bestemmie, nonno, saluti). Usa `{name}` come placeholder per il nome della vittima
- **Audio** — Carica file audio (mp3, ogg) per ogni personaggio. Il bot li scarica da R2 e li manda su Telegram
- **Foto** — Carica foto per le categorie NSFW. Stessa roba dell'audio
- **Sticker** — Aggiungi sticker tramite `file_id` di Telegram (usa [@RawDataBot](https://t.me/RawDataBot) per trovare i file_id)
- **Gruppi** — Vedi tutti i gruppi, mettili in pausa o bannali se rompono il cazzo
- **Log** — Cerca e filtra ogni singolo comando eseguito dal bot
- **Settings** — Cambia il rate limit, attiva/disattiva NSFW, eccetera

---

## 🗄️ Database

8 tabelle in D1 (SQLite at the edge):

| Tabella | Che ci sta dentro |
|---------|-------------------|
| `categories` | Le 18 categorie di contenuti (insulti, audio Mosconi, foto culo, ecc.) |
| `text_responses` | Frasi per le categorie testuali. `{name}` come placeholder |
| `media` | Metadata dei file su R2 (audio, foto, sticker) + cache telegram_file_id |
| `groups` | Gruppi Telegram tracciati (attivo/pausa/bannato) |
| `group_settings` | Impostazioni per gruppo |
| `command_logs` | Log di ogni singolo comando (chi, dove, quando, che ha chiesto) |
| `bot_config` | Configurazione globale key-value |
| `sessions` | Sessioni login backoffice |

---

## 📦 Storage R2

```
sborrbot-media/
├── audio/
│   ├── germano-mosconi/     # PORCO DIO.mp3
│   ├── christian-de-sica/   # vacanze_di_natale.ogg
│   ├── homer-simpson/       # doh.mp3
│   ├── soliti-idioti/
│   ├── richard-benson/
│   ├── effetti-sonori/
│   └── audio-vari/
├── photos/
│   ├── fica/                # ...
│   ├── culo/                # ...
│   └── tette/               # ...
└── stickers/
    ├── apple/
    ├── minion/
    └── disapprovazione/
```

I file vengono caricati dal backoffice e serviti dal worker. La prima volta che il bot invia un file su Telegram, salva il `telegram_file_id` in D1 per non dover re-uploadare ogni volta (risparmio di banda e tempo, non siamo coglioni).

---

## 🔧 Sviluppo Locale

```bash
# Worker
cd worker
npx wrangler dev
# Il bot gira su http://localhost:8787
# Per testare con Telegram serve un tunnel (cloudflared, ngrok, ecc.)

# Backoffice
cd backoffice
npm run dev
# Gira su http://localhost:4321
```

### Dev con tunnel (per testare il webhook)

```bash
# Installa cloudflared
# https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

# In un terminale
cd worker && npx wrangler dev

# In un altro terminale
cloudflared tunnel --url http://localhost:8787

# Prendi l'URL del tunnel e registra il webhook
curl "https://TUNNEL-URL/register"
```

---

## ⚡ Performance e Caching

- **Cloudflare Workers**: il bot gira al edge, latenza bassissima ovunque nel mondo
- **D1**: SQLite distribuito, query veloci per contenuti random (`ORDER BY RANDOM() LIMIT 1`)
- **telegram_file_id caching**: dopo il primo invio di un media, il bot salva l'ID Telegram. Le volte successive usa l'ID invece di ri-scaricare da R2. Geniale, lo so.
- **R2**: storage a basso costo, niente egress fees. Perfetto per tonnellate di audio di bestemmie.

---

## 🤝 Contribuire

Vuoi aggiungere features? Fork, branch, PR. Le solite cose.

Idee per il futuro:
- Inline mode completo (non solo testi)
- Comandi personalizzabili per gruppo
- Generazione dinamica di insulti con AI
- Oroscopo del cazzo
- Quiz e giochi in chat
- Classifica degli utenti più sborranti

---

## ⚠️ Disclaimer

SborrBot è un progetto di intrattenimento. Il bot è pensato per essere usato tra amici in chat private/di gruppo per fare cazzate e ridere. Non siamo responsabili se:

- Il tuo prete ti scomunica dopo aver letto le bestemmie
- Tua madre legge la chat e ti toglie il WiFi
- Qualcuno si offende per un insulto generato da un bot
- Telegram ti banna perché hai uploadato troppo porno

**Usalo con criterio.** O senza, chissenefotte.

---

## 📜 Licenza

Fai quello cazzo che vuoi. MIT License o qualcosa del genere.

---

*Fatto con amore, bestemmie e tanto caffè. Powered by Cloudflare.* ☁️💦
