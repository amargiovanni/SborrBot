-- Migration 0013: bollettino e caps lock
-- 2 nuove categorie

INSERT INTO categories (slug, name, type, description) VALUES
  ('bollettino', 'Bollettino', 'text', 'Bollettino di guerra/meteo/medico del gruppo con due utenti random'),
  ('capslock', 'Caps Lock', 'text', 'Risposte sarcastiche per chi scrive tutto in maiuscolo');

-- ─── BOLLETTINO ─────────────────────────────────────────────────────────────
INSERT INTO text_responses (category_id, content) VALUES
((SELECT id FROM categories WHERE slug = 'bollettino'), '📋 *BOLLETTINO DI GUERRA — ORE 14:00*

Fronte Nord: {name1} avanza con arroganza ma viene respinto dalla realta''.
Fronte Sud: {name2} si e'' trincerato nel divano e rifiuta di combattere.
Perdite: la dignita'' di entrambi.
Morale delle truppe: sotto zero.
Previsione: resa incondizionata entro sera.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '🏥 *BOLLETTINO MEDICO — AGGIORNAMENTO*

Paziente {name1}: condizioni stabili. Stabilmente pessime.
Paziente {name2}: in osservazione per eccesso di cazzate nel sangue.
Il primario consiglia a entrambi di stare lontani dai social.
Prognosi: incerta. Come le loro vite.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '🌪️ *BOLLETTINO METEO DEL GRUPPO*

Cielo coperto di stronzate su tutta la chat.
Precipitazioni di insulti nella zona di {name1}.
{name2} genera una perturbazione di lamenti in arrivo da sud-ovest.
Temperature: roventi tra i due.
Si consiglia di non uscire dalla chat. Anzi no, usciteci.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '📊 *BOLLETTINO STATISTICO DEL GRUPPO*

{name1}: 47 messaggi oggi, 0 contenuti utili. Record personale di inutilita''.
{name2}: 3 messaggi ma ognuno piu'' stupido del precedente. Efficienza impressionante.
Media QI del gruppo: in calo costante dal momento della creazione.
Raccomandazione: chiudere il gruppo e ricominciare da zero.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '⚠️ *BOLLETTINO PROTEZIONE CIVILE*

Allerta rossa nella chat.
{name1} ha espresso un''opinione e {name2} non e'' d''accordo.
Si prevedono shitstorm di livello 4 con possibilita'' di vocali di 3 minuti.
La popolazione e'' invitata a silenziare le notifiche.
Si sconsiglia di dare ragione a nessuno dei due.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '📰 *BOLLETTINO STAMPA — EDIZIONE STRAORDINARIA*

ULTIM''ORA: {name1} e {name2} avvistati nello stesso gruppo Telegram.
Gli esperti confermano: e'' la piu'' grande concentrazione di caos dal Big Bang.
Il governo valuta l''intervento dell''esercito.
L''OMS sconsiglia di leggere i loro messaggi a stomaco vuoto.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '🔬 *BOLLETTINO SCIENTIFICO*

Studio condotto su {name1} e {name2} rivela:
- Il 98% dei loro messaggi non contiene informazioni utili
- Il restante 2% sono errori grammaticali
- La loro presenza in chat riduce il QI collettivo di 15 punti
- I ricercatori hanno chiesto un aumento per i danni psicologici subiti.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '📉 *BOLLETTINO ECONOMICO DEL GRUPPO*

Inflazione di cazzate: +340% rispetto al mese scorso.
{name1} contribuisce al 60% del PIL di stronzate.
{name2} e'' in recessione di idee da 6 mesi consecutivi.
Il FMI consiglia: ban immediato per risanare i conti.
Borsa dei meme: in forte ribasso.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '🚨 *BOLLETTINO DI POLIZIA*

Denuncia n. 42069/2026
Oggetto: disturbo della quiete digitale.
Indagati: {name1} e {name2}.
Capi d''accusa: messaggi inutili con aggravante della recidiva.
Il PM chiede il massimo della pena: ban definitivo e confisca delle emoji.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '🏟️ *BOLLETTINO SPORTIVO*

{name1} vs {name2}: la sfida del secolo!
Primo tempo: {name1} domina con messaggi vuoti. {name2} risponde con sticker a caso.
Secondo tempo: entrambi esauriscono le energie. Nessun gol, nessun contenuto, nessuna speranza.
Risultato finale: 0-0, il pubblico chiede il rimborso.
MVP: nessuno. Demeritatamente.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '📻 *BOLLETTINO RADIO DEL GRUPPO — h. 08:00*

Situazione critica su tutti i fronti.
{name1} ha aperto la giornata con un buongiornissimo. Il morale e'' crollato.
{name2} ha risposto con un meme del 2018. Le truppe sono in rivolta.
Si registrano diserzioni di massa: 3 utenti hanno silenziato il gruppo.
Il comandante suggerisce la resa.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '🧪 *BOLLETTINO TOSSICOLOGICO*

Campione analizzato: chat del gruppo.
Risultati: livelli di cringe superiori alla norma del 800%.
{name1}: positivo a eccesso di opinioni non richieste.
{name2}: positivo a spam di link che nessuno apre.
Verdetto: chat tossica. Si raccomanda quarantena immediata.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '🌡️ *BOLLETTINO SANITARIO — AGGIORNAMENTO ORE 20:00*

Nuovi contagi di stupidita'': 2 ({name1} e {name2}).
Totale contagiati nel gruppo: praticamente tutti.
Tasso di guarigione: 0%.
L''ISS conferma: non esiste vaccino contro la coglionaggine.
Si consiglia distanziamento sociale da questa chat.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '🗞️ *BOLLETTINO DEL GIORNO*

Ore 09:00 — {name1} scrive qualcosa di inutile. Nessuna novita''.
Ore 12:00 — {name2} risponde con qualcosa di ancora piu'' inutile. Record battuto.
Ore 15:00 — Silenzio. Il gruppo tira un sospiro di sollievo.
Ore 15:01 — {name1} torna. Il sollievo e'' durato un minuto.
Ore 20:00 — Entrambi sono ancora qui. Nessuno sa perche''.'),

((SELECT id FROM categories WHERE slug = 'bollettino'), '🛡️ *BOLLETTINO DELLA DIFESA*

Intelligence report: {name1} e {name2} pianificano un attacco di messaggi vocali.
Livello di minaccia: CRITICO.
Contromisure attivate: mute totale, blocco notifiche, fuga dal gruppo.
Il Ministro della Difesa dichiara: "Non siamo preparati. Nessuno lo e''."'),

-- ─── CAPS LOCK ──────────────────────────────────────────────────────────────
((SELECT id FROM categories WHERE slug = 'capslock'), 'PIANO PIANO CHE SE ROMPE IL TELEFONO, URLATORE DEL CAZZO.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Ehi, il tasto CAPS LOCK si sblocca premendolo di nuovo. Prego.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Oh ma stai urlando o ti si e'' bloccata la tastiera? In entrambi i casi: calmati.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Scrivi in maiuscolo come mia nonna su Facebook. Ti mancano solo i buongiornissimi.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'AAAH STIAMO TUTTI URLANDO?! OK ALLORA URLO PURE IO! ...no vabbeh, che imbarazzo.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Hai lasciato il CAPS LOCK attivo o sei proprio cosi'' disperato che devi urlare in chat?'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Scrivere in maiuscolo non rende il tuo messaggio piu'' intelligente. Anzi.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'BRO IL CAPS LOCK NON TI DA'' RAGIONE, TI DA'' SOLO L''ASPETTO DI UNO SQUILIBRATO.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Ma lo sai che scrivere tutto in maiuscolo equivale a urlare? E nessuno vuole sentirti urlare. Manco dal vivo.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Tranquillo, ti abbiamo letto anche senza il maiuscolo. Il problema non e'' il volume, e'' il contenuto.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'CAPS LOCK: il grido d''aiuto di chi non sa farsi ascoltare con le idee.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Hai scritto in maiuscolo. Ora il tuo messaggio e'' ugualmente inutile, ma piu'' fastidioso.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Sto cercando di leggere il tuo messaggio ma il maiuscolo mi ha accecato. Grazie mille.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Abbassiamo i toni? No? Ok, allora abbassa almeno il CAPS LOCK, animale.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'IL MAIUSCOLO E'' L''EQUIVALENTE SCRITTO DI PARLARE CON LO SPUTACCHIO. Disgusting.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Ma quanto devi essere incazzato per scrivere tutto in maiuscolo? O sei proprio un boomer e non lo sai spegnere?'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Il tuo messaggio in maiuscolo e'' stato recepito. Ed e'' stato giudicato: una cagata, ma ad alta voce.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Sai chi scrive in maiuscolo? I serial killer nei film e tua zia su WhatsApp. Non so quale dei due sei, ma entrambi fanno paura.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Il CAPS LOCK e'' il karaoke della scrittura: pensi di spaccare, ma stai solo rompendo i coglioni.'),
((SELECT id FROM categories WHERE slug = 'capslock'), 'Oh, complimenti per il maiuscolo! Ora il tuo messaggio stupido si legge anche dallo spazio.');
