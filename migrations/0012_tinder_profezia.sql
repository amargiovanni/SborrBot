-- Migration 0012: tinder e profezia
-- 2 nuove categorie, ~80 contenuti

INSERT INTO categories (slug, name, type, description) VALUES
  ('tinder', 'Tinder', 'text', 'Profili Tinder devastanti per un target'),
  ('profezia', 'Profezia', 'text', 'Profezie apocalittiche personalizzate');

-- ─── TINDER ─────────────────────────────────────────────────────────────────
INSERT INTO text_responses (category_id, content) VALUES
((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, 27 anni (dichiarati, in realta'' 42)
📍 Casa della mamma, piano terra
💼 Disoccupato creativo
🎓 Universita'' della vita (fuoricorso)

Bio: "Cerco qualcuno che mi accetti per quello che sono: un disastro ambulante. Amo le lunghe passeggiate... verso il frigorifero. Altezza: dipende dalle scarpe. Se mi scrivi ''ciao'' ti blocco, se non mi scrivi piango."

❤️ 0 match questo mese'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, eta'' imprecisata
📍 Vive "nel centro" (periferia estrema)
💼 CEO di un''azienda che non esiste
🎓 Master in Ghosting

Bio: "Non sono qui per robe serie (traduzione: nessuno mi vuole per robe serie). Amo viaggiare (Rimini 2019 unico viaggio). 1.80 di pura delusione. Amante del buon vino (Tavernello)."

❤️ L''ultimo match era un bot'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, "spirito libero"
📍 Ovunque tranne dove serve
💼 Influencer (34 follower)
🎓 Scuola della strada (bocciato pure li'')

Bio: "Quello/a che la tua ex ti ha detto di non preoccuparti. Infatti non preoccuparti, guarda che faccia. Cerco avventure ma mi stanco a camminare. Il mio tipo ideale? Chiunque abbia il polso."

❤️ Swipe left dal 2019'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, 30 anni e zero risultati
📍 Camera da letto dei genitori (la sua e'' diventata lo studio del padre)
💼 Trader (ha perso 47€ su eToro)
🎓 Laurea in procrastinazione

Bio: "No perditempo (come se ce ne fossero in fila). Cerco una persona vera, non come le mie ex immaginarie. Amo cucinare (riscaldare surgelati). Dog lover (non ha il cane)."

❤️ Ha superlikato sua cugina per sbaglio'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, eta'' mentale: 14
📍 Sul divano, terzo cuscino da sinistra
💼 Filosofo incompreso (cameriere al Mcdonald''s)
🎓 Diplomato con il minimo sindacale

Bio: "Non cerco niente di serio perche'' nella vita non ho mai preso niente sul serio. Appassionato di sport (guardo la F1 dal divano). La mia red flag? Sono tutto una red flag."

❤️ Tinder gli ha mandato una mail: "va tutto bene?"'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, 25 anni biologici, 85 psicologici
📍 In un posto che non vuole dire (Frosinone)
💼 Freelancer (traduzione: disoccupato con il MacBook)
🎓 Tre anni fuoricorso e counting

Bio: "Cerco qualcuno che rida alle mie battute (nessuno lo fa nella vita reale). Altezza: sufficiente per arrivare al secondo scaffale. I miei amici dicono che sono simpatico. Non ho amici."

❤️ Profilo segnalato 3 volte'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, l''eta'' e'' solo un numero (un numero alto)
📍 In una citta'' che non nomina per vergogna
💼 Manager di se stesso (e sta fallendo)
🎓 Google University

Bio: "Buongustaio (mangio qualsiasi cosa). Amante dei viaggi (Google Maps). Sportivo (cammino fino al bar). La foto profilo e'' di 7 anni fa perche'' da allora e'' stato tutto in discesa. In senso negativo."

❤️ Il suo cane farebbe piu'' match'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, "giovane dentro" (vecchio fuori)
📍 Ancora a casa dei genitori "per scelta"
💼 Imprenditore digitale (vende roba su Subito.it)
🎓 Autodidatta (non ha imparato niente)

Bio: "Se mi fai ridere hai gia'' vinto. Per ora ha vinto solo la solitudine. Amo la natura (ho una pianta, e'' morta). Cerco la mia dolce meta''. L''altra meta'' e'' amara come la mia vita."

❤️ Ha pagato Tinder Gold, zero risultati lo stesso'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, eta'' variabile a seconda dell''interlocutore
📍 Non lontano (e'' una bugia)
💼 Artist (disegna cazzi sui banchi)
🎓 Accademia della vita (espulso)

Bio: "Romantico ma non troppo (zero). Mi piacciono le cene a lume di candela (Enel mi ha staccato la luce). Cerco una persona che mi completi. In pratica cerco una persona intera perche'' io sono a pezzi."

❤️ Tinder lo usa come esempio di cosa non fare'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, 28 anni (netti, lordi 45)
📍 Provincia di provincia
💼 Content creator (3 video, 12 views totali)
🎓 Erasmus a Bracciano

Bio: "Alpha male/female (tipo: la prima lettera dell''alfabeto e mi fermo li''). Amo il cinema (Netflix rubato al vicino). La mia canzone preferita e'' ''Rimmel'' di De Gregori perche'' anche io sono sfumato e nessuno mi rivuole."

❤️ Anche la mano sinistra lo ha friendzonato'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, "not here for hookups" (bugia)
📍 A 2 km (ma ne sembrano 200)
💼 Life coach (la sua vita e'' un disastro)
🎓 PhD in Red Flags

Bio: "Cerco qualcuno di maturo. Io non lo sono, ma cerco chi lo e'' per compensare. Mi descrivo in 3 parole: indeciso. Amo i cani piu'' delle persone e le persone piu'' di me stesso. Non e'' difficile."

❤️ L''AI di Tinder si e'' rifiutata di suggerirlo'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, eta'': "non la dico"
📍 In un monolocale che chiama "loft"
💼 Nomade digitale (va al bar con il portatile)
🎓 Corso online iniziato e mai finito

Bio: "La mia ex ha detto che sono un 3/10. Ma era generosa. Hobby: colleziono delusioni sentimentali. Se vuoi sapere com''e'' la depressione in formato umano, scorri le mie foto."

❤️ Ha scritto alla bio di Tinder e pure quella l''ha ignorato'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, 33 anni e in crisi
📍 Dove il WiFi arriva a malapena
💼 Motivational speaker (non motiva nemmeno se stesso)
🎓 Universita'' di Wish.com

Bio: "Sono come una lavatrice: mi serve qualcuno che mi faccia girare. Il mio love language e'' il silenzio perche'' quando parlo scappano tutti. Cerco il grande amore. Mi accontento anche del piccolo."

❤️ Tinder ha inviato le condoglianze'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, "age is just a number" (un numero preoccupante)
📍 Italia (piu'' specifico sarebbe imbarazzante)
💼 Consulente (di cosa nessuno lo sa)
🎓 Stage non retribuito dal 2015

Bio: "Cerco qualcuno per condividere le spese. Ah, anche l''amore. Ma prima le spese. Amo la cucina fusion (mescolo gli avanzi). Il mio piatto forte? La faccia tosta."

❤️ La sua foto migliore e'' quella senza faccia'),

((SELECT id FROM categories WHERE slug = 'tinder'), '🔥 *PROFILO TINDER DI {name}*

📛 {name}, eterno Peter Pan (ma senza il fascino)
📍 In un posto che su Google Maps ha 2 stelle
💼 Startupper (l''unico investitore e'' la nonna)
🎓 YouTube Academy

Bio: "Non mi servono filtri (ne servirebbero almeno 7). Amo ridere (principalmente di me stesso, e'' l''unica opzione). Il mio appuntamento ideale? Uno dove l''altra persona si presenti. Sarebbe gia'' un record."

❤️ Ha messo like a 3000 profili. Zero match. Manco per errore.'),

-- ─── PROFEZIA ───────────────────────────────────────────────────────────────
((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Le stelle hanno parlato e... non hanno detto niente di buono. Entro 48 ore calpesterai una cacca di cane con le scarpe nuove. Non e'' una metafora. E'' il destino.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

I tarocchi dicono: la carta della Torre Rovesciata. Traduzione: tutto quello che hai costruito crollera''. Ma tranquillo, non avevi costruito granché.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Vedo... vedo... un messaggio "dobbiamo parlare" nel tuo futuro prossimo. Da chi? Non importa. Fa male comunque.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Giove entra in Saturno e Mercurio se ne fotte. Per te questo significa: settimana di merda. Come le altre, ma con le stelle che confermano.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

La sfera di cristallo mostra: {name} che prova a cucinare qualcosa di elaborato. Risultato: ordinerai la pizza come sempre. Il destino e'' immutabile.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Attenzione! Vedo un futuro in cui ti arriva una multa che non ti aspettavi. Poi un''altra. Poi un''altra ancora. Complimenti, sei la Posta Italiana delle sfighe.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Le rune parlano chiaro: il tuo ex tornera''. Non per amore, per riprendersi la felpa. Era l''unica cosa di valore nella relazione.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Vedo un lunedi'' nel tuo futuro. Anzi ne vedo tanti. Uno dopo l''altro. Per sempre. Questa non e'' una profezia, e'' una condanna.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

La luna piena rivela: qualcuno parla di te alle tue spalle. Cosa dice? "Poverino/a". Non e'' simpatia, e'' pieta''.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Il pendolo oscilla verso... il disastro! Entro la fine del mese perderai qualcosa di importante. Le chiavi? La dignita''? Il lavoro? Sorpresa!'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Vedo {name} nel 2030: stessa casa, stesso divano, stessa serie TV in loop. Il progresso e'' sopravvalutato comunque.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

I pianeti si allineano per dirti una cosa sola: no. A qualsiasi cosa tu stia pensando di fare, la risposta e'' no.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Vedo... una notifica sul telefono! Il cuore batte forte... e'' lei? E'' lui? No. E'' la banca che ti dice che sei in rosso.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

La profezia dice: qualcuno ti fara'' un complimento questa settimana. Ma sara'' sarcastico e tu non lo capirai.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Mercurio retrogrado colpisce ancora! Manderai un messaggio alla persona sbagliata. Un messaggio molto imbarazzante. Buona fortuna.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Il tuo futuro e'' luminoso! Come il flash della telecamera dell''autovelox che ti beccherà domani.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Le carte rivelano: presto riceverai una proposta inaspettata. E'' quella di un abbonamento che avevi dimenticato di disdire.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Vedo amore nel tuo futuro! Con il cibo. Solo con il cibo. Per le persone la situazione resta critica.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Il fato ha deciso: il tuo prossimo taglio di capelli sara'' un disastro. Dirai "va bene cosi''" al parrucchiere e piangerai in macchina.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Venere e Marte si scontrano nel tuo cielo. Traduzione pratica: litigherai con qualcuno per una cazzata e avrai torto. Come sempre.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

La profezia suprema: un giorno sarai ricordato/a! Come esempio negativo, ma pur sempre ricordato/a.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Vedo un viaggio nel tuo futuro! Destinazione: il bagno, alle 3 di notte, dopo aver mangiato quella roba sospetta nel frigo.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Le stelle predicono: proverai a svegliarti presto domani. La sveglia suonera'' 4 volte. Ti alzerai tardi. Come tutti i giorni.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

L''oracolo ha parlato: il tuo WiFi cadra'' nel momento peggiore possibile. E'' scritto nelle stelle. E nelle impostazioni del tuo router scadente.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Profezia finanziaria: i tuoi soldi ti lasceranno prima della fine del mese. Come tutte le tue relazioni, ma piu'' velocemente.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Vedo {name} che dice "da lunedi'' cambio vita". Vedo anche il lunedi''. Non cambia niente. Il ciclo si ripete. Per l''eternita''.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

La nebbia del futuro si dirada e rivela... {name} che guarda il telefono aspettando un messaggio che non arrivera'' mai. Poetico.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Attenzione, profezia urgente: NON aprire quel link. Non cliccare "accetta". Non firmare niente. Fidati, non chiedere perche''.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Le stelle dicono che hai un grande potenziale. Le stelle pero'' sono a milioni di anni luce e non ti hanno mai visto dal vivo, quindi che ne sanno.'),

((SELECT id FROM categories WHERE slug = 'profezia'), '🔮 *PROFEZIA PER {name}*

Profezia definitiva: tutto andra'' bene. Sto scherzando. Sara'' un disastro. Ma almeno sarai in buona compagnia: la tua.');
