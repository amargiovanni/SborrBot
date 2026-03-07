# SborrBot

<p align="center">
  <a href="https://t.me/SborrrrBot_bot?startgroup=true">
    <img src="https://img.shields.io/badge/%F0%9F%92%A6%20AGGIUNGI%20SBORRBOT%20AL%20TUO%20GRUPPO-blue?style=for-the-badge&logo=telegram&logoColor=white&labelColor=0088cc&color=0088cc&link=https://t.me/SborrrrBot_bot?startgroup=true" alt="Aggiungi SborrBot al tuo gruppo" height="60">
  </a>
</p>

**Il bot Telegram piu sborrante che esista.** Ispirato al leggendario SpacoBot, ma piu cattivo, piu scurrile e con un pannello admin che te lo sogni.

Insulta i tuoi amici, mandali affanculo con stile, bestemmia come Germano Mosconi e fai piovere tette e culi nelle chat di gruppo. Tutto su Cloudflare, perche anche le porcherie meritano un'infrastruttura seria.

**Landing page**: [sborrbot.pages.dev](https://sborrbot.pages.dev)

---

## Che cazzo fa questo bot?

SborrBot e un bot di intrattenimento per gruppi Telegram che risponde a keyword naturali (niente slash del cazzo per i comandi principali). Scrivi "insulta Mario" e il bot gli fa il culo a strisce. Scrivi "bestemmia" e ti parte un porco dio che Germano Mosconi si gira nella tomba.

### Comandi Testuali (scrivi e godi)

| Comando | Che fa |
|---------|--------|
| `insulta [nome]` | Genera un insulto personalizzato per la vittima designata |
| `insulta combo [nome]` | Triplo insulto devastante. FATALITY. |
| `minaccia [nome]` | Minaccia di morte (scherzosa... forse) il malcapitato |
| `necrologio [nome]` | Elogio funebre del designato |
| `processo [nome]` | Processo penale al malcapitato |
| `cv [nome]` | Curriculum vitae (devastante) della vittima |
| `complimento [nome]` | Un complimento... a modo nostro |
| `autopsia [nome]` | Referto autoptico dettagliato |
| `diagnosi [nome]` | Diagnosi medica impietosa |
| `chi e [nome]` | Presentazione del soggetto |
| `giudizio [nome]` | Giudizio insindacabile |
| `tinder [nome]` | Profilo Tinder della vittima |
| `bestemmia` | Una bella bestemmia fresca fresca |
| `come diceva mio nonno` | Saggezza popolare rivisitata in chiave scurrile |
| `buongiorno` / `buonanotte` / `ciao` | Saluti personalizzati dallo Sborratore |
| `oroscopo [segno]` | Oroscopo osceno (random se non specifichi il segno) |
| `meteo [citta]` | Meteo reale + commento da stronzi (via OpenWeatherMap) |
| `notizia` | Fake news coinvolgendo membri random del gruppo |
| `segreto` | Rivela un segreto tra due membri random del gruppo |
| `bollettino` | Bollettino ufficiale del gruppo |
| `complotto` | Complotto rivelato tra membri del gruppo |
| `eredita` / `testamento` | Testamento aperto con beneficiari random |
| `profezia` | Profezia personalizzata per chi scrive |
| `consiglio` | Consiglio (non) utile |
| `motivazione` | Frase motivazionale... a modo nostro |
| `fact check` | Fact check del cazzo |
| `ricetta` | Ricetta dello chef |
| `frase celebre` / `citazione` | Perla di saggezza |
| `grazie` | Ringraziamento con la delicatezza che ci contraddistingue |
| `auguri` / `buon compleanno` | Auguri personalizzati |

### Auto-trigger (risposte automatiche)

Il bot risponde automaticamente quando rileva queste keyword nel testo:

| Keyword | Che fa |
|---------|--------|
| Squadre di calcio (`juve`, `roma`, `lazio`, `milan`) | Insulti mirati alla squadra |
| Lamenti (`ho fame`, `sono stanco`, `che palle`, ...) | Presa per il culo |
| Ego (`sono il migliore`, `sono forte`, ...) | Ridimensionamento |
| Napoletano (`napoli`, `pizza`, `maradona`, ...) | Stereotipi napoletani |
| Palestra (`palestra`, `dieta`, `crossfit`, ...) | Prese per il culo fitness |

### Comandi Foto (NSFW)

| Comando | Che fa |
|---------|--------|
| `fica` | Invia una foto di fica random |
| `culo` | Culi. Tanti culi. |
| `tette` | Tette. Che domande. |
| `degrado` | Il peggio del peggio |

> I contenuti NSFW li devi caricare tu dal backoffice. Il bot non genera porno da solo.

### Comandi Audio

| Comando | Chi parla |
|---------|-----------|
| `germano mosconi` | Il mitico Germano Mosconi. PORCO DIO IN DIRETTA. |
| `christian de sica` | Le perle di Christian De Sica |
| `homer simpson` | D'oh! Le citazioni di Homer |
| `i soliti idioti` | Audio de I Soliti Idioti |
| `richard benson` | IL GRANDE RICHARD BENSON |
| `effetti sonori` | Effetti sonori vari per ogni occasione |

### Sticker

| Comando | Sticker |
|---------|---------|
| `apple` | Steve Jobs che ti giudica |
| `banana` / `minion` | Minion del cazzo |
| `non ci sono` | Sticker di disapprovazione totale |

### Controllo

| Comando | Effetto |
|---------|---------|
| `zitto sborrbot` | Metti a cuccia il bot nel gruppo (sta zitto ma non se ne va) |
| `sveglia sborrbot` | Risveglia la bestia |

### Slash Commands

| Comando | Descrizione |
|---------|-------------|
| `/start` | Messaggio di benvenuto |
| `/help` | Lista completa dei comandi |
| `/info` | Info sul bot |
| `/testo` | Lista categorie testo |
| `/foto` | Lista categorie foto |
| `/audio` | Lista categorie audio |
| `/sticker` | Lista categorie sticker |
| `/privacy` | Informativa privacy (GDPR Art. 13) |
| `/mydata` | Visualizza i tuoi dati (GDPR Art. 15) |
| `/deleteme` | Cancella tutti i tuoi dati (GDPR Art. 17) |

---

## Architettura

```
                        +------------------+
                        |  Telegram API    |
                        +--------+---------+
                                 | Webhook POST
                                 v
+------------------+     +-------+--------+     +------------------+
|   Astro SSR      |     | CF Worker      |     | OpenWeatherMap   |
|   Backoffice     |     | (Bot Handler)  |     | API              |
|   + Tailwind     |     +--+-------+-----+     +------------------+
+--------+---------+        |       |
         |                  v       v
         |            +-----+--+ +--+------+
         +----------->|   D1   | |   R2    |
                      |Database| | Storage |
                      +--------+ +---------+

Cron Trigger (03:00 UTC) --> Worker --> Purge logs > 90 giorni
```

### Stack Tecnologico

| Componente | Tecnologia |
|-----------|------------|
| **Bot** | Cloudflare Worker (TypeScript) |
| **Database** | Cloudflare D1 (SQLite at the edge) |
| **Media Storage** | Cloudflare R2 (S3-compatible) |
| **Backoffice** | Astro 5 + Tailwind CSS su Cloudflare Pages (auto-deploy da Git) |
| **Landing Page** | Astro SSR su Cloudflare Pages |
| **Auth** | Session cookie + D1 + Cloudflare Turnstile |
| **Meteo** | OpenWeatherMap API |
| **Cron** | Cloudflare Cron Triggers (purge log 90 giorni) |

### Struttura del Progetto

```
SborrBot/
├── worker/                 # Il cervello del bot (Cloudflare Worker)
│   ├── src/
│   │   ├── index.ts        # Entry point: webhook + cron scheduler
│   │   ├── bot.ts          # Dispatcher principale
│   │   ├── types.ts        # Env interface
│   │   ├── commands/
│   │   │   ├── slash.ts    # /start, /help, /privacy, /mydata, /deleteme
│   │   │   ├── text.ts     # 30+ comandi testuali + auto-trigger
│   │   │   ├── media.ts    # Audio e foto (R2 -> Telegram)
│   │   │   ├── sticker.ts  # Sticker per file_id
│   │   │   └── control.ts  # zitto/sveglia
│   │   ├── middleware/
│   │   │   ├── group-check.ts  # Verifica se il bot e attivo nel gruppo
│   │   │   └── logger.ts       # Logga ogni comando su D1
│   │   └── services/
│   │       ├── db.ts        # Query D1 (GDPR: getUserStats, deleteUserData, purgeOldLogs)
│   │       ├── storage.ts   # Lettura R2
│   │       ├── telegram.ts  # Client API Telegram
│   │       └── weather.ts   # Client OpenWeatherMap
│   └── wrangler.toml
│
├── backoffice/             # Pannello admin + landing page (Astro + Tailwind)
│   ├── src/
│   │   ├── layouts/Layout.astro    # Layout dark con sidebar
│   │   ├── middleware.ts           # Auth guard (session + D1)
│   │   ├── pages/
│   │   │   ├── index.astro         # Landing page pubblica
│   │   │   ├── login.astro         # Login (Turnstile + credenziali da env)
│   │   │   ├── dashboard.astro     # Statistiche
│   │   │   ├── content/            # CRUD testi, audio, foto, sticker
│   │   │   ├── groups.astro        # Gestione gruppi
│   │   │   ├── logs.astro          # Log comandi searchable
│   │   │   └── settings.astro      # Configurazione bot
│   │   └── lib/
│   │       ├── auth.ts             # Constant-time comparison, session CRUD
│   │       └── db.ts               # Query D1 per backoffice
│   ├── public/
│   │   ├── _headers                # Security headers (CSP, HSTS, etc.)
│   │   ├── .well-known/security.txt
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── wrangler.toml
│
├── migrations/             # Schema D1
│   ├── 0001_initial_schema.sql
│   ├── 0002_seed_data.sql
│   ├── 0003_bulk_content.sql
│   ├── 0003_anti_juve.sql
│   ├── 0004_extra_dirty_content.sql
│   ├── 0005_new_features.sql
│   ├── 0006_media_uploads.sql
│   ├── 0007_new_features_2.sql
│   ├── 0008_new_features_3.sql
│   ├── 0009_extreme_features.sql
│   ├── 0010_napoletano.sql
│   ├── 0011_new_triggers.sql
│   ├── 0012_tinder_profezia.sql
│   └── 0013_bollettino_capslock.sql
│
├── shared/                 # Tipi TypeScript condivisi
│   └── types.ts
│
└── package.json            # Root monorepo (npm workspaces)
```

---

## Setup

### Prerequisiti

- Node.js 18+
- Un account Cloudflare (gratis)
- Un bot Telegram (crealo su [@BotFather](https://t.me/BotFather))
- `wrangler` CLI installato (`npm install -g wrangler`)

### 1. Clona e installa

```bash
git clone https://github.com/amargiovanni/SborrBot.git
cd SborrBot
npm install
cd worker && npm install && cd ..
cd backoffice && npm install && cd ..
```

### 2. Crea le risorse Cloudflare

```bash
wrangler login

# Crea il database D1
wrangler d1 create sborrbot-db
# -> Copia il database_id e mettilo in worker/wrangler.toml E backoffice/wrangler.toml

# Crea il bucket R2
wrangler r2 bucket create sborrbot-media
```

### 3. Aggiorna i wrangler.toml

Prendi il `database_id` dall'output del comando precedente e sostituiscilo in:
- `worker/wrangler.toml`
- `backoffice/wrangler.toml`

### 4. Esegui le migrazioni

```bash
cd worker

# Locale (per sviluppo)
for f in ../migrations/*.sql; do
  npx wrangler d1 execute sborrbot-db --local --file="$f"
done

# Remoto (per produzione)
for f in ../migrations/*.sql; do
  npx wrangler d1 execute sborrbot-db --remote --file="$f"
done

cd ..
```

> **Nota sui media:** Le migrazioni creano schema, testi di esempio e categorie. I record media puntano a file R2 che **non sono inclusi nel repo** (vanno caricati tramite il backoffice). I comandi testuali funzionano subito dopo le migrazioni.

### 5. Configura i secrets

```bash
# Worker
cd worker
wrangler secret put BOT_TOKEN           # Token da BotFather
wrangler secret put BOT_SECRET          # Stringa casuale per validare webhook
wrangler secret put OPENWEATHERMAP_API_KEY  # API key da openweathermap.org (per il meteo)
cd ..

# Backoffice (via Cloudflare Dashboard -> Pages -> Settings -> Environment Variables)
# ADMIN_USERNAME    — username per il login
# ADMIN_PASSWORD    — password per il login
# TURNSTILE_SECRET_KEY — secret key da Cloudflare Turnstile
```

### 6. Deploy

```bash
# Deploy il worker
cd worker
npx wrangler deploy
# -> URL: https://sborrbot-worker.tuousername.workers.dev

# Il backoffice fa auto-deploy da Git (Cloudflare Pages con Git provider)
# Ogni push su main deploya automaticamente
```

### 7. Registra il webhook

```bash
curl -H "Authorization: Bearer TUO_BOT_SECRET" \
  https://sborrbot-worker.tuousername.workers.dev/register
```

Se vedi `{"ok":true}` sei a posto. Il bot e vivo e pronto a sborrare.

---

## Backoffice

Il pannello admin e una figata. Dark theme, sidebar, tutto responsive.

### Come accedere

1. Vai su `https://sborrbot.pages.dev/login`
2. Inserisci le credenziali configurate nelle environment variables
3. Supera il CAPTCHA Turnstile
4. Goditi il pannello

### Cosa puoi fare

- **Dashboard** — Statistiche: comandi eseguiti, gruppi attivi, comandi piu usati, trend 7/30 giorni, attivita oraria, top gruppi/utenti
- **Testi** — Aggiungi/elimina frasi per ogni categoria. Usa `{name}` come placeholder per il nome della vittima, `{name1}`/`{name2}` per comandi con due target
- **Audio** — Carica file audio (mp3, ogg) per ogni personaggio. Il bot li scarica da R2 e li manda su Telegram
- **Foto** — Carica foto per le categorie NSFW
- **Sticker** — Aggiungi sticker tramite `file_id` di Telegram
- **Gruppi** — Vedi tutti i gruppi, mettili in pausa o bannali
- **Log** — Cerca e filtra ogni singolo comando eseguito dal bot
- **Settings** — Configurazione bot

---

## Privacy e GDPR

SborrBot prende la privacy sul serio (no, davvero).

### Dati raccolti

Il bot raccoglie il minimo indispensabile per funzionare:
- **Telegram user ID** (numerico)
- **Username** (pubblico su Telegram)
- **Comando inviato** e timestamp
- **ID del gruppo** in cui e stato usato

### Diritti dell'utente

| Comando | GDPR | Cosa fa |
|---------|------|---------|
| `/privacy` | Art. 13 | Mostra informativa completa sulla raccolta dati |
| `/mydata` | Art. 15 | Mostra i dati raccolti sull'utente (totale comandi, prima/ultima interazione) |
| `/deleteme` | Art. 17 | Cancella TUTTI i dati dell'utente dal database |

### Retention automatica

Un cron trigger gira ogni giorno alle 03:00 UTC e cancella automaticamente tutti i log piu vecchi di **90 giorni** (Art. 5.1.e — limitazione della conservazione).

---

## Sicurezza

### Misure implementate

- **Auth backoffice**: Session cookie + D1, comparazione password constant-time (HMAC), token 32 byte da `crypto.getRandomValues()`
- **CAPTCHA**: Cloudflare Turnstile sul login
- **Webhook validation**: Secret token su ogni richiesta da Telegram
- **SQL injection**: Zero. Tutte le query D1 usano parametri con `.bind()`
- **Security headers**: CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (`public/_headers`)
- **security.txt**: `/.well-known/security.txt` con contatto per vulnerability disclosure
- **Secrets**: Tutti esternalizzati via `wrangler secret put` o Cloudflare Dashboard. Niente in codice o wrangler.toml.
- **Path normalization**: Middleware normalizza double-slash per prevenire auth bypass
- **R2 deletion**: Key verificata da D1, non dal client

---

## Database

8 tabelle in D1 (SQLite at the edge):

| Tabella | Che ci sta dentro |
|---------|-------------------|
| `categories` | Categorie di contenuti (insulti, audio Mosconi, foto, ecc.) |
| `text_responses` | Frasi per le categorie testuali. `{name}` / `{name1}` / `{name2}` come placeholder |
| `media` | Metadata dei file su R2 (audio, foto, sticker) + cache telegram_file_id |
| `groups` | Gruppi Telegram tracciati (attivo/pausa/bannato) |
| `group_settings` | Impostazioni per gruppo |
| `command_logs` | Log di ogni comando (chi, dove, quando, che ha chiesto) — purge automatico 90gg |
| `bot_config` | Configurazione globale key-value |
| `sessions` | Sessioni login backoffice (24h expiry, cleanup automatico) |

---

## Storage R2

```
sborrbot-media/
├── audio/
│   ├── germano-mosconi/
│   ├── christian-de-sica/
│   ├── homer-simpson/
│   ├── soliti-idioti/
│   ├── richard-benson/
│   ├── effetti-sonori/
│   └── audio-vari/
├── photos/
│   ├── fica/
│   ├── culo/
│   ├── tette/
│   └── degrado/
└── stickers/
    ├── apple/
    ├── minion/
    └── disapprovazione/
```

I file vengono caricati dal backoffice e serviti dal worker. La prima volta che il bot invia un file su Telegram, salva il `telegram_file_id` in D1 per non dover re-uploadare ogni volta.

---

## Sviluppo Locale

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
# In un terminale
cd worker && npx wrangler dev

# In un altro terminale
cloudflared tunnel --url http://localhost:8787

# Prendi l'URL del tunnel e registra il webhook
curl -H "Authorization: Bearer TUO_BOT_SECRET" "https://TUNNEL-URL/register"
```

---

## Performance e Caching

- **Cloudflare Workers**: il bot gira al edge, latenza bassissima ovunque nel mondo
- **D1**: SQLite distribuito, query veloci per contenuti random (`ORDER BY RANDOM() LIMIT 1`)
- **telegram_file_id caching**: dopo il primo invio di un media, il bot salva l'ID Telegram. Le volte successive usa l'ID invece di ri-scaricare da R2
- **R2**: storage a basso costo, niente egress fees

---

## Contribuire

Vuoi aggiungere features? Fork, branch, PR. Le solite cose.

Idee per il futuro:
- Inline mode completo
- Comandi personalizzabili per gruppo
- Generazione dinamica di insulti con AI
- Quiz e giochi in chat
- Classifica degli utenti piu sborranti

---

## Disclaimer

SborrBot e un progetto di intrattenimento. Il bot e pensato per essere usato tra amici in chat private/di gruppo per fare cazzate e ridere. Non siamo responsabili se:

- Il tuo prete ti scomunica dopo aver letto le bestemmie
- Tua madre legge la chat e ti toglie il WiFi
- Qualcuno si offende per un insulto generato da un bot
- Telegram ti banna perche hai uploadato troppo porno

**Usalo con criterio.** O senza, chissenefotte.

---

## Licenza

MIT License — fai quello cazzo che vuoi. Vedi [LICENSE](LICENSE).

---

*Fatto con amore, bestemmie e tanto caffe. Powered by Cloudflare.*
