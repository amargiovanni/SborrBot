-- Migration 0015: televendita, asta, esorcismo, intercettazione, ex, terapia
-- 6 nuove categorie, ~200 contenuti IPER-CATTIVI

INSERT INTO categories (slug, name, type, description) VALUES
  ('televendita', 'Televendita', 'text', 'Televendita stile Mastrota per un target'),
  ('asta', 'Asta', 'text', 'Asta eBay devastante per un target'),
  ('esorcismo', 'Esorcismo', 'text', 'Rituale di esorcismo per un target'),
  ('intercettazione', 'Intercettazione', 'text', 'Intercettazione telefonica tra due membri del gruppo'),
  ('ex', 'Ex', 'text', 'Messaggi dall''ex per chi nomina l''ex'),
  ('terapia', 'Terapia', 'text', 'Sedute di terapia per chi nomina lo psicologo');

-- ═══════════════════════════════════════════════════════════════════════════════
-- TELEVENDITA ({name}) — 35 entries
-- ═══════════════════════════════════════════════════════════════════════════════
INSERT INTO text_responses (category_id, content) VALUES

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — OFFERTA IMPERDIBILE!*

🎤 "AMICI TELESPETTATORI! Stasera vi presentiamo {name}! Un prodotto UNICO nel suo genere — nel senso che nessuno ne ha mai voluto un secondo!

✅ Include: delusione cronica, alito pestilenziale, e un set di scuse da 48 pezzi!
✅ BONUS: peli incarniti GRATIS su tutto il corpo!
✅ GARANZIA: vi deludera'' entro 24 ore o vi rimborsiamo il disgusto!

💰 PREZZO LANCIO: -€9,99 (VI PAGHIAMO NOI per portarvelo via)

📞 CHIAMATE ORA! Le prime 10 telefonate ricevono ANCHE il suo odore permanente in omaggio!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — SOLO PER OGGI!*

🎤 "MA CHE PRODOTTO STRAORDINARIO! {name}, il primo essere umano certificato come RIFIUTO NON RICICLABILE!

✅ Funzioni: nessuna
✅ Pregi: occupa spazio, consuma ossigeno
✅ Difetti: TUTTI GLI ALTRI
✅ Peso: quello che pesa sulla coscienza dei genitori

💰 A SOLI €0,00 — E NESSUNO LO VUOLE MANCO GRATIS!

📞 Non vi serve il telefono, vi basta aprire la finestra e urlare ''ME LO PRENDO IO'' — nessuno vi contesterà!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — SOTTOCOSTO!*

🎤 "Avete presente quando dite ''peggio di cosi'' non puo'' andare''? VI PRESENTIAMO {name}!

✅ Materiale: 70% acqua, 30% cazzate
✅ Alimentazione: kebab delle 4 di notte
✅ Manutenzione: IMPOSSIBILE
✅ Reso: rifiutato da Amazon, Wish, e dall''Esercito della Salvezza

💰 PREZZO: un calcio nel culo e una pacca sulla spalla per la pazienza

📞 OPERATORI IN ATTESA! Scherzo, pure loro sono scappati quando hanno visto {name}!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — EDIZIONE LIMITATA!*

🎤 "SIGNORE E SIGNORI! Dal laboratorio degli orrori genetici, ecco a voi {name}!

✅ Cervello: opzionale (non incluso)
✅ Dignita'': esaurita nel 2003
✅ Utilita'': inferiore a quella di un posacenere in moto
✅ BONUS: include depressione stagionale tutto l''anno!

💰 OFFERTA SHOCK: te lo tiri dietro e ti regaliamo anche le sue scuse per esistere!

📞 Rispondono gli operatori del 118 perche'' chi compra {name} ha bisogno di assistenza medica!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — LIQUIDAZIONE TOTALE!*

🎤 "DOBBIAMO SVUOTARE IL MAGAZZINO! E cosa c''e'' in magazzino? {name}! Da anni! Perche'' nessuno lo vuole!

✅ Caratteristiche: puzza, parla a vanvera, mangia con la bocca aperta
✅ Accessori inclusi: forfora, calzini bucati, ego ingiustificato
✅ Batteria: si scarica dopo 5 minuti di conversazione utile
✅ Made in: un errore di gioventu''

💰 PREZZO: facciamo che ce lo togliete dalle palle e siamo pari

📞 CHIAMATE IL 666 — TANTO IL DIAVOLO E'' L''UNICO CHE LO RIVUOLE!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — BLACK FRIDAY!*

🎤 "ATTENZIONE! {name} ora al 99% DI SCONTO! Ma il 99% di zero e'' sempre zero, come il suo valore!

✅ Livello intellettuale: inferiore a una ciabatta
✅ Sex appeal: repellente per zanzare e per esseri umani
✅ Igiene: opzionale
✅ Confezione: non necessaria, tanto puzza anche da chiuso

💰 PRENDI 1, PAGHI 0, PENTITI PER SEMPRE!

📞 I nostri operatori piangono ad ogni ordine — non per commozione, per pieta''!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — ESCLUSIVA TV!*

🎤 "GUARDATE CHE MERAVIGLIA! {name}, l''unico prodotto che FA SCHIFO anche nella scatola!

✅ Tempo di consegna: gia'' in ritardo, come in tutto nella vita
✅ Qualita'': quella del kebab delle 3 di notte, cioe'' inesistente
✅ Assistenza post-vendita: una bestemmia e un Maalox
✅ Recensioni clienti: ⭐ 0,2/5 — ''Mai piu''. Piuttosto compro un cactus.''

💰 COSTA MENO DELLA DIGNITA'' CHE PERDI A FREQUENTARLO!

📞 SBRIGATEVI! Offerta valida finche'' non ci denunciano per truffa!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — COME VISTO IN TV!*

🎤 "GIORGIO MASTROTA dal paradiso urla: ''NON VENDETE QUELLA MERDA!'' Ma noi ci proviamo lo stesso! Ecco {name}!

✅ Compatibile con: NIENTE e NESSUNO
✅ Certificazione: bocciato dall''ASL, dall''OMS e dalla nonna
✅ Punti di forza: riesce a deludere anche chi non si aspetta niente
✅ Controindicazioni: nausea, vomito, pentimento immediato

💰 A RATE! 12 comode rate di vergogna da €0,00 ciascuna!

📞 Non chiamate. Ve lo mandiamo lo stesso. Non potete rifiutare. E'' tipo la morte."'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — NOVITA'' ASSOLUTA!*

🎤 "Dalla Silicon Valley? NO! Dal cesso piu'' sporco d''Italia, arriva {name}!

✅ Innovazione: ZERO
✅ Design: quello di un sacchetto dell''umido dimenticato al sole
✅ Durata: resistente come una scusa del lunedi'' mattina
✅ Feedback: ''L''ho regalato alla suocera. Adesso neanche lei mi parla.''

💰 PAGHI CON LA CARTA DI CREDITO? Non serve, basta la carta igienica!

📞 ORDINA ORA e ricevi GRATIS la depressione di chi lo conosce gia''!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — SVENDITA TOTALE!*

🎤 "Amici, non lo nascondo: {name} ci e'' rimasto sul groppone. Come una verruca. Come un debito con Equitalia. Come la gonorrea.

✅ Uso consigliato: spaventapasseri, fermaporta, esempio negativo per i figli
✅ Ingredienti: 50% stronzate, 30% aria fritta, 20% peli
✅ Scadenza: gia'' scaduto da tempo ma nessuno se n''e'' accorto
✅ Avvertenze: tenere lontano da bambini, adulti e animali

💰 LO REGALIAMO! Anzi, vi paghiamo €50 per portarvelo via!

📞 OPERATORE: ''Per favore, qualcuno lo prenda. Vi prego. Sto perdendo la volonta'' di vivere.''"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — SPECIAL EDITION!*

🎤 "DIRETTAMENTE dalla fabbrica dei DISASTRI UMANI! {name} DELUXE EDITION!

✅ Include: ego smisurato, capacita'' cognitive ridotte, e un abbonamento a vita alla sfiga
✅ NON include: dignita'', fascino, intelligenza, igiene
✅ Assemblaggio: alcuni pezzi mancanti (tipo il cervello)
✅ Eta'' consigliata: a nessuna eta'' e'' consigliabile

💰 PREZZO DI FABBRICA: il costo di un profilattico che i genitori non hanno usato!

📞 AFFRETTATEVI! Rimane solo 1 pezzo! Perche'' nessuno lo compra!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — 3x2!*

🎤 "OFFERTA PAZZESCA! Comprate {name} e vi regaliamo DUE motivi per pentirvi!

✅ Velocita'': piu'' lento di una tartaruga con la depressione
✅ Potenza: quella di un criceto morto
✅ Garanzia: non garantiamo NIENTE, tanto si rompe da solo
✅ Testimonianza: ''Da quando ho {name}, la mia vita e'' peggiorata del 340%.''

💰 PREZZO RIDOTTO COME IL SUO QI!

📞 Ordina chiamando il numero che trovi nella tua disperazione piu'' profonda!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — ULTIMA CHANCE!*

🎤 "Ci hanno detto: ''non potete vendere una persona!'' E noi: ''avete visto {name}? Non e'' una persona, e'' un incidente!''

✅ Funziona a: lamentele, ruttini e aria fritta
✅ Alimentazione: tutto cio'' che non dovrebbe mangiare
✅ Colore: grigio tristezza
✅ Dimensioni: piu'' largo che alto, piu'' inutile che largo

💰 PREZZO: un abbraccio di pieta'' e due bestemmie

📞 Gli operatori sono in sciopero. Anche loro non ne possono piu'' di {name}."'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — SUPER PROMO!*

🎤 "Avete mai desiderato un oggetto COMPLETAMENTE INUTILE? No? Beh, eccovi {name} COMUNQUE!

✅ Capacita'' di ascolto: come un muro, ma meno interessante
✅ Abilita'' sociali: quelle di un calzino bagnato
✅ Valore sentimentale: inferiore a quello di un buono pasto scaduto
✅ Odore: presente. Sempre. Ovunque.

💰 COMPRI {name} E TI REGALIAMO: una bottiglia di amuchina e le nostre scuse!

📞 CHIAMA il 800-DISPERAZIONE — attivo 24/7, come il disagio di {name}!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — FUORI TUTTO!*

🎤 "Dovevamo buttarlo nell''indifferenziato ma l''AMSA ha rifiutato! Quindi ve lo proponiamo: {name}!

✅ Tecnologia: quella del paleolitico, ma meno evoluta
✅ Software: cervello non aggiornato dal 1997
✅ RAM: 0.5 MB (Meta'' Bestia)
✅ Processore: piu'' lento di un funerale

💰 IN OFFERTA A MENO DI QUANTO COSTA UN CAFFE''! Cioe'' gratis, perche'' il caffe'' almeno serve a qualcosa!

📞 I nostri operatori rispondono in lacrime! E'' normale, hanno dovuto descrivere {name} tutto il giorno!"'),

((SELECT id FROM categories WHERE slug = 'televendita'), '📺 *TELEVENDITA SBORRBOT — PRODOTTO DELL''ANNO!*

🎤 "PREMIATO come il peggior prodotto dell''anno da TUTTI I GIURATI! Standing ovation di disgusto per {name}!

✅ Multifunzione: sa essere inutile in ALMENO 47 modi diversi
✅ Resistente: ai complimenti, alla logica e al sapone
✅ Portatile: nel senso che puoi portarlo dove vuoi ma nessuno lo fara''
✅ Eco-friendly: NON RICICLABILE

💰 ZERO RATE, ZERO INTERESSI, ZERO MOTIVI PER COMPRARLO!

📞 Per ordinare lasciate il vostro testamento e chiamate!"'),

-- ═══════════════════════════════════════════════════════════════════════════════
-- ASTA ({name}) — 35 entries
-- ═══════════════════════════════════════════════════════════════════════════════

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #420*

📦 *OGGETTO:* {name}
📋 *CONDIZIONI:* Usato malissimo — segni evidenti di degrado fisico e morale
📍 *UBICAZIONE:* Divano della mamma, impronta permanente sul cuscino centrale
📏 *DIMENSIONI:* Ingombrante. In tutti i sensi.

⭐ *VALUTAZIONE VENDITORE:*
"Lo vendo perche'' mi serve spazio. Per la dignita'', principalmente."

💰 *OFFERTA ATTUALE:* -€5,00 (il compratore viene pagato per il disturbo)
🏷️ *COMPRALO SUBITO:* Gratis + spese di smaltimento rifiuti speciali
📦 *SPEDIZIONE:* Con un calcio nel culo — GRATUITA

⚠️ _Non si accettano resi. Non si accettano lamentele. Non si accettano le condoglianze._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #069*

📦 *OGGETTO:* {name} — Modello base (molto base)
📋 *CONDIZIONI:* Come nuovo nel senso che non e'' mai stato usato (da nessuno)
📍 *UBICAZIONE:* Camera propria, circondato da calzini sporchi e sogni infranti
📏 *DIMENSIONI:* Quelle di un fallimento XXL

⭐ *FEEDBACK ACQUIRENTI PRECEDENTI:*
"Ho comprato un tostapane rotto e funzionava meglio." — ⭐ 0,1/5

💰 *OFFERTA ATTUALE:* €0,00 — e siamo generosi
🏷️ *COMPRALO SUBITO:* un pacchetto di fazzoletti e due Moment
📦 *SPEDIZIONE:* lo lanciamo dalla finestra — a carico nostro

⚠️ _Vendita per disperazione. Il venditore non e'' responsabile di danni psicologici._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #001*

📦 *OGGETTO:* {name} — Pezzo unico (e ci mancherebbe)
📋 *CONDIZIONI:* Pari al nuovo se il nuovo fosse un disastro nucleare
📍 *UBICAZIONE:* Ovunque non dovrebbe essere
📏 *PESO:* Quello che pesa sulle palle di chi lo conosce

⭐ *DESCRIZIONE:*
"Vendo causa sgombero morale. {name} occupa spazio fisico ed emotivo senza dare nulla in cambio. Ideale come spaventapasseri o come monito per i figli."

💰 *BASE D''ASTA:* €0,01 — nessuno ha ancora rilanciato
🏷️ *COMPRALO SUBITO:* una preghiera e un Maalox
📦 *SPEDIZIONE:* catapulta medievale — consegna in 3-5 giorni lavorativi

⚠️ _Attenzione: {name} potrebbe arrivare con opinioni non richieste._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #666*

📦 *OGGETTO:* {name} — Edizione Maledetta
📋 *CONDIZIONI:* Rotto dentro e fuori — non riparabile
📍 *UBICAZIONE:* inferno, settimo cerchio, posto fisso
📏 *GARANZIA:* AHAHAHAHAHAHA no.

⭐ *RECENSIONE DEL VENDITORE:*
"L''ho avuto per 30 anni e non ho ancora capito a cosa serva. Non funziona, non si spegne, e consuma tutto il cibo in frigo."

💰 *OFFERTA ATTUALE:* -€20 (offriamo soldi per liberarcene)
🏷️ *COMPRALO SUBITO:* vendita dell''anima + 2 Tachipirine
📦 *SPEDIZIONE:* viene da solo, non sa dove altro andare

⚠️ _Il prodotto emette rumori molesti (parla) e odori sospetti (esiste)._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #187*

📦 *OGGETTO:* {name} — Modello "Deluxe" (il nome e'' ironico)
📋 *CONDIZIONI:* Graffiato, ammaccato, con l''autostima a pezzi
📍 *UBICAZIONE:* Nella friendzone dal 2016
📏 *CONTENUTO:* 60% acqua, 40% delusione concentrata

⭐ *FEEDBACK:*
⭐ 0/5 — "Peggio di un pacco da Wish. Almeno Wish ti rimborsa." — Gianluca, Frosinone

💰 *PREZZO DI RISERVA:* non esiste, prendetevelo per l''amor di dio
🏷️ *COMPRALO SUBITO:* un rutto e una stretta di mano
📦 *SPEDIZIONE:* a calci, come merita

⚠️ _Il venditore declina ogni responsabilita''. Su tutto. Per sempre._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #042*

📦 *OGGETTO:* {name} — Kit di Sopravvivenza Sociale (DIFETTOSO)
📋 *CONDIZIONI:* Mai aperto (da nessuna donna/uomo)
📍 *UBICAZIONE:* Sul divano a scrollare TikTok, come ogni giorno da 4 anni
📏 *ACCESSORI INCLUSI:* cringe infinito, battute non divertenti, ego XXL

⭐ *MOTIVO VENDITA:*
"Non serve piu'' a niente. In realta'' non e'' mai servito a niente, ma adesso ne siamo ufficialmente certi."

💰 *OFFERTA ATTUALE:* 3 monetine trovate sotto il cuscino del divano
🏷️ *COMPRALO SUBITO:* un abbraccio (di pieta'')
📦 *SPEDIZIONE:* gru + trasporto eccezionale (per l''ego)

⚠️ _Non ci assumiamo responsabilita'' per crisi esistenziali post-acquisto._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #999*

📦 *OGGETTO:* {name} — Versione 1.0 (mai aggiornato)
📋 *CONDIZIONI:* Obsoleto dal giorno della nascita
📍 *UBICAZIONE:* In coda per qualcosa che non otterra'' mai
📏 *SPECIFICHE:* CPU: 386. RAM: insufficiente. GPU: non pervenuta.

⭐ *NOTA DELL''ESPERTO:*
"Ho valutato migliaia di oggetti nella mia carriera. {name} e'' il primo che ho valutato meno di zero. Mi ha fatto riconsiderare la mia professione."

💰 *BASE D''ASTA:* il prezzo di un profilattico (quello che i genitori hanno risparmiato)
🏷️ *COMPRALO SUBITO:* €0,00 + terapia di gruppo inclusa
📦 *SPEDIZIONE:* trebuchet — impatto garantito

⚠️ _Vietato ai minori, ai maggiori, e a chiunque abbia un minimo di buon gusto._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #404*

📦 *OGGETTO:* {name} — ERRORE 404: Utilita'' Non Trovata
📋 *CONDIZIONI:* Malfunzionante dalla nascita, nessun aggiornamento disponibile
📍 *UBICAZIONE:* Al bar a parlare di cose che non capisce
📏 *CERTIFICAZIONI:* Nessuna. Bocciato anche dall''autolavaggio.

⭐ *DOMANDE DEGLI ACQUIRENTI:*
"Ma fa qualcosa?" — "No."
"Almeno e'' decorativo?" — "Neanche."
"Posso usarlo come fermaporta?" — "Troppo molle."

💰 *OFFERTA PIU'' ALTA:* nessuno ha offerto. Nessuno offrira''. Mai.
🏷️ *COMPRALO SUBITO:* accettiamo buoni pasto scaduti
📦 *SPEDIZIONE:* lo carichiamo su un asino e lo mandiamo

⚠️ _Prodotto non coperto da garanzia, assicurazione, o speranza._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #013*

📦 *OGGETTO:* {name} — Porta sfiga certificato
📋 *CONDIZIONI:* Come un lunedi'' mattina: brutto, inutile, e non va via
📍 *UBICAZIONE:* Attaccato al WiFi della mamma come un parassita
📏 *COLORE:* Grigio depressione con sfumature di beige tristezza

⭐ *TESTIMONIANZA:*
"Ho avuto {name} in casa per 2 ore. Mi si e'' rotto il televisore, il cane e'' scappato, e ho perso il lavoro. Coincidenze? Non credo."

💰 *PREZZO:* SOTTOZERO, come la sua personalita''
🏷️ *COMPRALO SUBITO:* sacrificio di un pollo + 3 Ave Maria
📦 *SPEDIZIONE:* corriere espresso (il corriere e'' espresso perche'' scappa)

⚠️ _Prodotto maledetto. Acquistare a proprio rischio e pericolo._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #800*

📦 *OGGETTO:* {name} — Esperimento Fallito
📋 *CONDIZIONI:* Usato — e non e'' migliorato con l''uso
📍 *PROVENIENZA:* Un errore di gioventu'' dei genitori
📏 *PESO NETTO:* troppo. PESO LORDO: esagerato.

⭐ *DESCRIZIONE DETTAGLIATA:*
"Cesso totale. Non cucina, non pulisce, non lavora, non scopa. L''unica cosa che fa e'' occupare spazio e lamentarsi. Se fosse un elettrodomestico sarebbe un tostapane che brucia tutto."

💰 *OFFERTA ATTUALE:* una pacca sul culo e via
🏷️ *COMPRALO SUBITO:* ci basta un cenno col capo
📦 *SPEDIZIONE:* pacco bomba (lui e'' la bomba)

⚠️ _Attenzione: il prodotto potrebbe tentare di tornare indietro. Cambiare le serrature._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #2006*

📦 *OGGETTO:* {name} — Vintage (nel senso che puzza di vecchio)
📋 *CONDIZIONI:* Ammaccato dalla vita. Graffiato dagli eventi. Scheggiato dalla realta''.
📍 *UBICAZIONE:* In un luogo che non vuole rivelare (lo capiamo)
📏 *MISURE:* Misurare {name} equivarrebbe a quantificare il vuoto cosmico

⭐ *PERCHE'' LO VENDIAMO:*
"Perche'' regalarlo sarebbe un insulto a chi lo riceve. Venderlo e'' una truffa. Buttarlo e'' reato ambientale. Non sappiamo piu'' cosa fare."

💰 *OFFERTA:* accettiamo qualsiasi cosa, anche insulti
🏷️ *COMPRALO SUBITO:* GRATIS — offerta troppo alta? Fate voi.
📦 *SPEDIZIONE:* ve lo catapultiamo col trabucco

⚠️ _Nessun animale e'' stato maltrattato nella produzione. Solo esseri umani (noi, che l''abbiamo sopportato)._'),

((SELECT id FROM categories WHERE slug = 'asta'), '🔨 *ASTA SBORRBOT — LOTTO #DISPERAZIONE*

📦 *OGGETTO:* {name} — Usato, abusato, e mai desiderato
📋 *CONDIZIONI:* Pari a un chewing-gum sotto la scarpa: appiccicoso e impossibile da eliminare
📍 *UBICAZIONE:* Nella vita degli altri, senza invito
📏 *AUTONOMIA:* 0 km — non si muove dal divano

⭐ *FAQ:*
"E'' rimborsabile?" — Solo in bestemmie.
"Si puo'' restituire?" — Abbiamo provato, ce lo rimandano indietro.
"Funziona?" — Definisci "funziona".

💰 *BASE D''ASTA:* un respiro e un sospiro di rassegnazione
🏷️ *COMPRALO SUBITO:* basta guardarlo negli occhi (se avete il coraggio)
📦 *SPEDIZIONE:* raccomandata con ricevuta di pentimento

⚠️ _L''acquirente rinuncia automaticamente alla felicita''._'),

-- ═══════════════════════════════════════════════════════════════════════════════
-- ESORCISMO ({name}) — 35 entries
-- ═══════════════════════════════════════════════════════════════════════════════

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ IN NOMINE PATRIS, ET FILII...

Il demonio e'' stato convocato per uscire dal corpo di {name}. Ha risposto: "No grazie, sto meglio all''inferno."

Il prete: "Vade retro, Satana!"
Il demonio: "Guarda che quello li'' non sono io, e'' proprio cosi'' di suo."

📜 *ESITO:* Esorcismo FALLITO
Il male non puo'' essere rimosso perche'' e'' strutturale.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ EXORCIZAMUS TE, OMNIS IMMUNDUS SPIRITUS...

L''acqua santa e'' stata versata su {name}. Reazione: ha iniziato a sfrigolare. Non per il demonio — per lo sporco.

Il Vaticano ha emesso un comunicato ufficiale: "Non e'' posseduto. E'' cosi''. Ci dispiace."

📜 *ESITO:* ANNULLATO — il demonio ha chiesto l''avvocato.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ TE ROGAMUS, AUDI NOS...

Padre Amorth dal paradiso ha guardato {name} e ha detto: "Questo e'' troppo anche per me. Chiamate Goku."

L''acqua santa e'' evaporata al contatto. Il crocifisso si e'' girato dall''altra parte. La Bibbia si e'' autocensurata.

📜 *ESITO:* IMPOSSIBILE — servono almeno 47 preti e un lanciafiamme.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ LIBERA NOS A MALO...

Abbiamo provato tutto:
🔸 Acqua santa: si e'' rifiutata di toccarlo
🔸 Crocifisso: si e'' piegato dall''altra parte
🔸 Preghiere: Dio ha messo la segreteria telefonica
🔸 Incenso: {name} se l''e'' fumato

📜 *ESITO:* Il demonio ha lasciato {name}. Non perche'' l''esorcismo ha funzionato, ma perche'' non ce la faceva piu'' neanche lui.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ ADJUTORIUM NOSTRUM IN NOMINE DOMINI...

TENTATIVO 1: il prete recita il Padre Nostro. {name} rutta.
TENTATIVO 2: acqua santa. {name} dice "grazie, avevo sete."
TENTATIVO 3: il prete urla "IL POTERE DI CRISTO TI ESPELLE!" {name}: "Calmo fra'', non sono alla partita."

📜 *ESITO:* Il prete si e'' dimesso dalla Chiesa. Ha detto: "Preferisco l''inferno a un altro minuto con {name}."'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ SANCTE MICHAEL ARCHANGELE, DEFENDE NOS...

San Michele Arcangelo e'' stato invocato. Ha guardato {name}, ha messo via la spada e ha detto: "Non e'' il mio dipartimento. Provate con l''INPS."

Il Diavolo in persona ha commentato: "Quello li'' non l''ho mandato io. E'' un freelance della sfiga."

📜 *ESITO:* ARCHIVIATO — il male in {name} e'' DOC, non e'' importato.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ CRUX SACRA SIT MIHI LUX...

Il rituale e'' iniziato alle 3:00 di notte. {name} dormiva. Il demonio pure. L''unico sveglio era il prete, che dopo aver visto la camera di {name} ha avuto un attacco di panico.

"Ho visto cose in quella stanza che manco all''inferno..." — Padre Giuseppe, prima del ricovero

📜 *ESITO:* Tutti posseduti. Pure il gatto.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ VADE RETRO, SATANA!

Satana: "Stai parlando con me o con {name}? Perche'' onestamente io faccio meno danni."

L''acqua santa e'' stata sostituita con la grappa perche'' il prete aveva bisogno di coraggio. Dopo 3 bicchieri ha iniziato a bestemmiare anche lui.

📜 *ESITO:* Il demonio e'' rimasto. Il prete ha cambiato mestiere. {name} si e'' mangiato i cioccolatini dell''offertorio.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ DOMINE, MISERERE NOBIS...

Il Vaticano ha convocato una riunione d''emergenza. Papa Francesco ha visto la foto di {name} e ha detto: "Madonna santa..." poi si e'' corretto: "Cioe'', volevo dire... no, ho detto bene la prima volta."

Sono stati consultati 14 esorcisti, 3 sciamani, 2 stregoni e un idraulico. Nessuno sa cosa fare.

📜 *ESITO:* RINVIATO A GIUDIZIO — anche il Tribunale Divino ha la coda.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ IN NOMINE PATRIS...

Il prete: "C''e'' qualcuno dentro di te?"
{name}: "Si'', la carbonara di ieri sera."
Il prete: "Intendo un''entita'' maligna!"
{name}: "Ah, quello sono io di lunedi'' mattina."

Il demonio si e'' fatto avanti per chiarire: "Io qui non c''entro niente. Questo e'' stronzo di suo."

📜 *ESITO:* Il prete bestemmia piu'' di {name} adesso.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ AGIOS ISCHYROS...

Abbiamo portato {name} in chiesa. Il campanile ha suonato da solo. Non per l''esorcismo — per avvertire il quartiere.

Le statue dei santi si sono girate. La Madonna ha coperto gli occhi al Bambinello. San Giuseppe ha chiesto il divorzio.

📜 *ESITO:* La chiesa e'' stata sconsacrata. Per colpa di {name}. Primo caso nella storia.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ EXAUDI NOS, DOMINE...

Resoconto del rituale:
⏰ 00:00 — Inizio preghiere
⏰ 00:15 — {name} chiede il WiFi della parrocchia
⏰ 00:30 — Il prete piange
⏰ 01:00 — {name} ordina una pizza
⏰ 01:30 — Il demonio chiede di essere trasferito in un altro corpo
⏰ 02:00 — Arriva la pizza. Il demonio ne mangia una fetta.
⏰ 02:30 — Tutti d''accordo: {name} e'' irrecuperabile.

📜 *ESITO:* Caso chiuso. Irreversibile. Senza appello.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ SPIRITUS DOMINI SUPER ME...

Il prete ha aperto la Bibbia. {name} ha aperto Instagram. Il demonio ha aperto un blog per raccontare la sua esperienza.

"Sono stato dentro a serial killer, politici corrotti e presentatori TV. Ma {name}... {name} e'' un''altra cosa. Li'' dentro c''e'' il VUOTO." — Belzebu'', intervista esclusiva

📜 *ESITO:* Il Vaticano ha emesso un comunicato: "{name} non e'' posseduto. E'' proprio cosi''. Preghiamo per chi lo conosce."'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ PER INTERCESSIONEM SANCTORUM...

FASE 1: Aspersione con acqua santa — {name} si e'' lamentato che era fredda
FASE 2: Recita del Rosario — {name} si e'' addormentato al secondo mistero
FASE 3: Imposizione delle mani — il prete ha sentito una scossa e ha ritirato la mano
FASE 4: Invocazione diretta — il demonio ha mandato un vocale: "Ma lasciatemi in pace, con quello li'' non ci sto!"

📜 *ESITO:* L''unico spirito presente era quello del Limoncello che {name} aveva bevuto prima.'),

((SELECT id FROM categories WHERE slug = 'esorcismo'), '✝️ *RITUALE D''ESORCISMO PER {name}*

🕯️ OREMUS...

Abbiamo consultato le piu'' alte autorita'' spirituali:
🔸 Il Papa: "Non mi pagano abbastanza per questo."
🔸 Il Dalai Lama: "Ho dedicato 60 anni alla pazienza. Per {name} non bastano."
🔸 Buddha: "Anche il nirvana ha un limite."
🔸 Maometto: "Next."
🔸 Scientology: "Nemmeno noi siamo cosi'' disperati."

📜 *ESITO:* Tutte le religioni del mondo sono d''accordo su una cosa sola: {name} e'' irrecuperabile.'),

-- ═══════════════════════════════════════════════════════════════════════════════
-- INTERCETTAZIONE ({name1}, {name2}) — 35 entries
-- ═══════════════════════════════════════════════════════════════════════════════

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 4269*
📅 Data: oggi, ore 03:47

{name1}: "Hai portato la roba?"
{name2}: "Si'', 3 kg."
{name1}: "Tutta buona?"
{name2}: "La migliore. Carbonara della nonna."

📋 NOTA INQUIRENTE: "Sospetto traffico di colesterolo. Richiesta autorizzazione per perquisizione del frigorifero."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 6969*
📅 Data: ieri, ore 23:15

{name1}: "Ce l''hai il contatto?"
{name2}: "Si'', ma costa caro."
{name1}: "Quanto?"
{name2}: "20 euro l''ora."
{name1}: "Ma e'' bravo?"
{name2}: "E'' l''unico idraulico che viene di domenica."

📋 NOTA INQUIRENTE: "Falso allarme. Erano solo due poveracci col tubo del cesso rotto."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 1312*
📅 Data: oggi, ore 02:30

{name1}: "Non dire niente a nessuno."
{name2}: "Giuro sulla mia vita."
{name1}: "Ho fatto una cosa terribile."
{name2}: "Cosa?!"
{name1}: "Ho messo l''ananas sulla pizza."
{name2}: [silenzio di 47 secondi]
{name2}: "La nostra amicizia e'' finita."

📋 NOTA INQUIRENTE: "Reato confermato. Arrestare entrambi."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 0001*
📅 Data: oggi, ore 16:20

{name1}: "Ho un piano infallibile."
{name2}: "Dimmi tutto."
{name1}: "Prendiamo le ferie lo stesso giorno..."
{name2}: "Ok..."
{name1}: "E non ci presentiamo al lavoro."
{name2}: "...quello si chiama licenziamento."
{name1}: "Dettagli."

📋 NOTA INQUIRENTE: "Soggetti classificati come ''troppo stupidi per delinquere''."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 0666*
📅 Data: stanotte, ore 04:12

{name1}: "Devo confessarti una cosa..."
{name2}: "Mi stai spaventando."
{name1}: "Ho tradito..."
{name2}: "COSA?!"
{name1}: "...la dieta. Ho mangiato un tiramisù intero alle 3 di notte."
{name2}: "Io ti ammazzo."
{name1}: "Era buonissimo pero''."

📋 NOTA INQUIRENTE: "Il tiramisù e'' stato recuperato. Era effettivamente buonissimo. L''inquirente ne ha mangiato una fetta."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 5050*
📅 Data: oggi, ore 09:00

{name1}: "Il pacco e'' arrivato?"
{name2}: "Si'', e'' enorme."
{name1}: "Nascondilo prima che qualcuno lo veda."
{name2}: "E'' il compleanno di tua madre, il pacco e'' per lei."
{name1}: "Appunto, deve essere una sorpresa."
{name2}: "Il pacco e'' una friggitrice ad aria."
{name1}: "La sorpresa e'' che l''ho rubata dall''ufficio."

📋 NOTA INQUIRENTE: "Furto aggravato di elettrodomestico. La friggitrice e'' stata sequestrata e usata per fare le patatine in ufficio."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 0420*
📅 Data: oggi, ore 17:45

{name1}: "Operazione completata."
{name2}: "Nessuno ti ha visto?"
{name1}: "Nessuno."
{name2}: "Perfetto. Adesso elimina le prove."
{name1}: "Fatto. Ho cancellato la cronologia di PornHub."
{name2}: "Bravo. Tua moglie non deve mai sapere."

📋 NOTA INQUIRENTE: "L''inquirente si identifica con i soggetti e chiude il caso per conflitto d''interessi."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 1234*
📅 Data: ieri, ore 20:00

{name1}: "Quanto hai perso?"
{name2}: "Non me lo chiedere."
{name1}: "QUANTO?"
{name2}: "€347 al Fantacalcio."
{name1}: "Ma come cazzo e'' possibile?"
{name2}: "Ho puntato tutto su un portiere che si e'' rotto il crociato al riscaldamento."

📋 NOTA INQUIRENTE: "Nessun reato riscontrato. Solo una stupidita'' cosmica."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 0800*
📅 Data: oggi, ore 11:30

{name1}: "Ho bisogno di un favore grosso."
{name2}: "Spara."
{name1}: "Devi dire alla mia ragazza che ieri sera ero con te."
{name2}: "E dove eri veramente?"
{name1}: "A casa. A dormire. Alle 21:30."
{name2}: "E perche'' devi mentire?"
{name1}: "Perche'' se sa che vado a letto alle 21:30 mi molla per noia."

📋 NOTA INQUIRENTE: "Caso piu'' triste dell''anno. Archiviato con una lacrima."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 0069*
📅 Data: sabato notte, ore 01:30

{name1}: "Sono in situazione."
{name2}: "Che tipo di situazione?"
{name1}: "Sono chiuso fuori casa. Senza chiavi. Senza portafoglio. In mutande."
{name2}: "COME CAZZO E'' POSSIBILE?"
{name1}: "Sono uscito a buttare la spazzatura e la porta si e'' chiusa."
{name2}: "...in mutande?"
{name1}: "Non giudicarmi."

📋 NOTA INQUIRENTE: "I vigili del fuoco sono intervenuti. Hanno riso per 20 minuti prima di aprire la porta."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 7777*
📅 Data: oggi, ore 14:00

{name1}: "Ho scoperto il segreto."
{name2}: "Quale segreto?"
{name1}: "So chi caga e non tira lo sciacquone in ufficio."
{name2}: "CHI?!"
{name1}: "Il capo."
{name2}: "NOOO."
{name1}: "L''ho beccato. L''ho guardato negli occhi. Lui ha guardato me. Adesso ho un aumento."

📋 NOTA INQUIRENTE: "L''inquirente richiede trasferimento. Troppe informazioni."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 1111*
📅 Data: oggi, ore 08:00

{name1}: "Dobbiamo eliminare il problema."
{name2}: "Sono d''accordo. Ma come?"
{name1}: "Ho gia'' comprato tutto il necessario."
{name2}: "Acido?"
{name1}: "Acido muriatico. Per il calcare del cazzo nel bagno."
{name2}: "Mio eroe. Il calcare mi stava uccidendo."

📋 NOTA INQUIRENTE: "La GdF ha fatto irruzione trovando solo due uomini con i guanti di gomma che pulivano la doccia. Caso imbarazzante."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 9999*
📅 Data: oggi, ore 19:30

{name1}: "Mission accomplished."
{name2}: "Hai fatto sparire tutto?"
{name1}: "Tutto. Non rimane niente."
{name2}: "Ma proprio TUTTO tutto?"
{name1}: "Si''. Ho finito la Nutella da 5 kg in 3 giorni. Non ne rimane una goccia. Sono un eroe e un mostro allo stesso tempo."

📋 NOTA INQUIRENTE: "Incredibile ma vero. La Ferrero ha inviato le condoglianze al barattolo."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 3141*
📅 Data: ieri, ore 22:00

{name1}: "Ho fatto una cazzata."
{name2}: "Un''altra?"
{name1}: "Ho risposto ''ok'' alla mia ragazza."
{name2}: [silenzio]
{name2}: "E'' stato bello conoscerti."
{name1}: "Sono gia'' morto, vero?"
{name2}: "Sei morto quando hai premuto invio."

📋 NOTA INQUIRENTE: "Abbiamo inviato supporto psicologico per {name1}. Il terapeuta ha confermato: e'' spacciato."'),

((SELECT id FROM categories WHERE slug = 'intercettazione'), '🎙️ *INTERCETTAZIONE RISERVATA — PRATICA N. 2024*
📅 Data: oggi, ore 12:30

{name1}: "Operazione ''Svolta Epocale'' in corso."
{name2}: "Aggiornami."
{name1}: "Ho creato un curriculum."
{name2}: "Finalmente!"
{name1}: "L''ho mandato a 50 aziende."
{name2}: "Bravissimo!"
{name1}: "Nessuna ha risposto."
{name2}: "...quand''e'' che l''hai mandato?"
{name1}: "6 mesi fa."

📋 NOTA INQUIRENTE: "Abbiamo letto il curriculum. Capisco le aziende."'),

-- ═══════════════════════════════════════════════════════════════════════════════
-- EX (auto-trigger, {name}) — 30 entries
-- ═══════════════════════════════════════════════════════════════════════════════

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ciao, ti scrivo perche''... no niente, volevo solo assicurarmi che stessi ancora peggio di me. Confermato. Baci (finti)."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Mi manchi. Cioè no, mi mancano i soldi che mi prestavi. Quando puoi richiamami. Ma tipo mai."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ho sognato te stanotte. Era un incubo. Mi sono svegliata/o urlando. Il terapista dice che e'' PTSD."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Volevo dirti che sto con uno/a nuovo/a. E'' meglio di te in tutto. Ma proprio TUTTO. Si'', anche in quello. Soprattutto in quello."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"La mia amica mi ha detto che ti ha visto al supermercato. Compravi surgelati per uno. Mi ha fatto quasi pena. Quasi."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ti ho sbloccato per dirti una cosa importante: sei stato/a la peggior decisione della mia vita. E ho investito in Bitcoin al massimo. Ora ti riblocco."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ciao! Ho trovato le tue cose in una scatola. Le ho buttate. Non per cattiveria, ma perche'' manco l''Esercito della Salvezza le voleva."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ho visto che hai cambiato la foto profilo. Era meglio prima. E prima faceva schifo. Fai i tuoi calcoli."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Il mio psicologo mi ha detto di scriverti per chiudere un capitolo. Eccolo: CAPITOLO CHIUSO. Il libro era una merda comunque."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Mi hai insegnato tanto. Tipo cosa NON cercare in una persona. Ora ho una lista lunga 3 pagine. Si chiama ''Non un altro {name}''."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Stavo facendo pulizie e ho trovato una tua maglietta. L''ho usata per pulire il pavimento. E'' la cosa piu'' utile che tu abbia mai fatto in questa casa."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"La mia mamma mi ha chiesto di te. Le ho detto che sei morto/a. Non e'' vero ma era piu'' facile che spiegare perche'' sono stata/o con te."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"HAHAHA ho appena riletto le nostre vecchie chat. Che cringe. Ma io ero drogata/o? Come cazzo ho fatto a dire ''ti amo'' a TE?"'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Sai qual e'' la cosa bella di averti lasciato? TUTTO. Tutto e'' la cosa bella. Ogni singolo momento. Anche il lunedi'' mattina e'' meglio di un sabato sera con te."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ho rivisto le nostre foto insieme. In tutte hai quella faccia da pesce lesso. Come facevo a non notarlo? L''amore e'' davvero cieco. E sordo. E senza olfatto nel tuo caso."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Il mio nuovo ragazzo/a mi ha chiesto del mio ex. Gli/Le ho fatto vedere la tua foto. Ha riso per 4 minuti. Poi mi ha abbracciato/a e ha detto ''poverina/o''."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ciao! Volevo solo dirti che il cane che avevamo insieme mi vuole piu'' bene. E mi ha sempre voluto piu'' bene. In realta'' ti ringhiava. Come tutti."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Un anno fa ci siamo lasciati. Il miglior anniversario della mia vita. Stasera festeggio. Con persone migliori di te. Cioe'' con chiunque."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Mi hanno chiesto perche'' ci siamo lasciati. Ho detto ''incompatibilita'' caratteriale''. Ma la verita'' e'' che sei insopportabile, brutto/a dentro e fuori, e russi come un trattore."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Scusa se ti scrivo a quest''ora. Sono ubriaca/o. Ma non abbastanza da rivolerti. Per quello servirebbero droghe pesanti."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ciao, ho cambiato numero ma volevo che avessi il nuovo. Ah no, aspetta, per quale cazzo di motivo dovresti averlo? Cancella questo messaggio e la mia esistenza dalla tua memoria."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Mi manca il nostro gatto. Tu no, proprio per niente. Ma il gatto si''. Potresti mandarmi il gatto e sparire? Grazie."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Sai cosa mi manca di te? Il momento in cui te ne sei andato/a. Quello e'' stato il picco della nostra relazione. L''apice. Il capolavoro."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ho un nuovo ragazzo/a. E'' gentile, bello/a, intelligente, e ha un lavoro vero. Praticamente il tuo opposto in tutto. La natura mi ha rimborsato."'),

((SELECT id FROM categories WHERE slug = 'ex'), '📱 *MESSAGGIO DALL''EX DI {name}*

"Ho sentito che stai cercando qualcuno su Tinder. Tranquillo/a, non ti trovo io. Non ti trova nessuno. Sei il buco nero degli appuntamenti."'),

-- ═══════════════════════════════════════════════════════════════════════════════
-- TERAPIA (auto-trigger, {name}) — 30 entries
-- ═══════════════════════════════════════════════════════════════════════════════

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA N. 247 — PAZIENTE {name}*

Terapeuta: "Come ti senti oggi?"
{name}: "Male."
Terapeuta: "Rispetto all''ultima volta?"
{name}: "Peggio."
Terapeuta: "Ah."
[silenzio di 40 minuti]
Terapeuta: "Sono €150. La prossima volta porta un problema risolvibile."'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

NOTA CLINICA: Il paziente presenta sintomi di coglionite acuta. La malattia e'' cronica, ereditaria e incurabile.

TERAPIA PRESCRITTA: Due schiaffi ogni 4 ore e un clistere di buon senso al bisogno.

PROGNOSI: Infausta. Non per la malattia, per chi gli sta intorno.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Lo psicologo ha ascoltato {name} per 10 minuti. Poi ha chiamato il suo psicologo. Il suo psicologo ha chiamato un prete. Il prete ha chiamato Dio. Dio ha riattaccato.

La fattura e'' di €300. €150 per la seduta, €150 per danni morali allo psicologo.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Terapeuta: "Parliamo della tua infanzia."
{name}: "Era normale."
Terapeuta: "Non credo. Guardati."
{name}: "..."
Terapeuta: "..."
{name}: "..."
Terapeuta: "Ti rimborso io. Mi dispiace per te."'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

RAPPORTO CLINICO:
📋 Sessioni completate: 147
📋 Progressi: zero
📋 Cause identificate: 312
📋 Cause risolvibili: 0
📋 Consumo fazzoletti: 4.800
📋 Stato del terapeuta: anche lui in terapia adesso

CONCLUSIONE: Il paziente e'' classificato come IRRECUPERABILE.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Il terapeuta di {name} ha cambiato numero, citta'' e identita''. Ha lasciato un biglietto: "Alcuni casi vanno oltre la scienza. Oltre la medicina. Oltre la pazienza umana. {name} e'' uno di questi. Addio."

Il nuovo terapeuta e'' durato 3 sedute. Poi ha aperto un bar.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Terapeuta: "Su una scala da 1 a 10, come stai?"
{name}: "-4."
Terapeuta: "La scala parte da 1."
{name}: "Appunto."

Il terapeuta ha aggiornato il manuale diagnostico. Hanno aggiunto la categoria: "Cazzi di {name} — inclassificabile."'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

{name} ha provato 7 psicologi. Il primo si e'' licenziato. Il secondo si e'' trasferito in Tibet. Il terzo ha iniziato a bere. Il quarto ha cambiato professione. Il quinto ha pianto. Il sesto ha pianto di piu''. Il settimo... il settimo non risponde piu'' al telefono.

Ora {name} va dallo sciamano. Lo sciamano ha messo la segreteria.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Terapeuta: "Raccontami un ricordo felice."
{name}: [pensa per 22 minuti]
{name}: "Una volta ho trovato 2 euro per terra."
Terapeuta: "E basta?"
{name}: "Era un buon giorno."
Terapeuta: [scrive nella cartella: DEPRESSIONE GALATTICA — NESSUN RIMEDIO NOTO]'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

REFERENZA INTER-SPECIALISTICA:
Psicologo → "Non e'' un problema psicologico."
Psichiatra → "Non e'' un problema psichiatrico."
Neurologo → "Non e'' un problema neurologico."
Esorcista → "Non e'' un problema demoniaco."

Tutti d''accordo: {name} e'' semplicemente fatto cosi''. Male. Molto male.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Terapeuta: "Qual e'' il tuo piu'' grande problema?"
{name}: "Non lo so."
Terapeuta: "Ecco, quello."

NOTA: Il terapeuta ha aggiunto {name} alla lista delle cose per cui LUI va in terapia.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Il terapeuta ha provato:
✅ Terapia cognitivo-comportamentale — fallita
✅ Psicanalisi freudiana — fallita
✅ Ipnosi — fallita (il terapeuta si e'' addormentato)
✅ Terapia di gruppo — il gruppo e'' scappato
✅ Arteterapia — {name} ha disegnato un cazzo
✅ Musicoterapia — {name} ha cantato Despacito stonato

CONCLUSIONE: Proposta eutanasia della carriera del terapeuta.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Terapeuta: "Prova a dire 3 cose positive su di te."
{name}: "Ehm... sono puntuale."
Terapeuta: "Sei arrivato 20 minuti in ritardo."
{name}: "Ah. Allora... sono onesto?"
Terapeuta: "Mi hai detto che stavi bene e sei chiaramente a pezzi."
{name}: "Ok... almeno non puzzo?"
Terapeuta: [apre la finestra]'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

DIARIO CLINICO — SETTIMANA 52:
Il paziente non migliora. Anzi, peggiora. Anzi, fa peggiorare anche me. La mia moglie mi ha chiesto perche'' torno a casa e piango. Le ho mostrato le note su {name}. Adesso piange anche lei.

RICHIESTA: Passare il paziente a qualcun altro. A chiunque. Anche a un veterinario. Non mi importa.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

L''Ordine degli Psicologi ha emesso un comunicato ufficiale riguardo al caso di {name}:

"Dopo 200+ sedute con 7 diversi professionisti, confermiamo che {name} rappresenta il primo caso documentato di persona TOTALMENTE IMPERMEABILE alla terapia. Non per resistenza — per densita'' del problema."

Il caso e'' stato inserito nei manuali come esempio di IRREVERSIBILITA'' CLINICA.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Terapeuta: "Hai provato a meditare?"
{name}: "Si''."
Terapeuta: "E com''e'' andata?"
{name}: "Mi sono addormentato e ho sognato di essere al lavoro."
Terapeuta: "Cioe'' manco nei sogni stai bene?"
{name}: "Nel sogno il capo mi urlava addosso, pero'' in pigiama."
Terapeuta: "...il tuo subconscio e'' un posto terribile."'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

CONFERENZA INTERNAZIONALE DI PSICHIATRIA — Caso studio: {name}

Dott. Smith (Harvard): "In 40 anni di carriera, mai visto nulla di simile."
Dott. Tanaka (Tokyo): "Neanche io. E ho lavorato in Giappone."
Dott. Rossi (Milano): "Io l''ho avuto come paziente. Sono qui come paziente adesso."
Dott. Mueller (Berlino): "Propongo di classificarlo come disastro naturale."

VOTAZIONE: Unanimita''. {name} e'' ufficialmente un FENOMENO ATMOSFERICO.'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

Terapeuta: "Ho una buona notizia e una cattiva."
{name}: "La buona?"
Terapeuta: "Dopo 3 anni di terapia, ho capito esattamente qual e'' il tuo problema."
{name}: "E la cattiva?"
Terapeuta: "Sei tu. Il problema sei tu. Tutto tu. Ogni singola parte di te."
{name}: "Posso avere un rimborso?"
Terapeuta: "Per la terapia o per la tua vita?"
{name}: "Per tutto."'),

((SELECT id FROM categories WHERE slug = 'terapia'), '🛋️ *SEDUTA DI TERAPIA — PAZIENTE {name}*

ALERT — FASCIA ROSSA:
Il paziente {name} ha fatto piangere 3 terapeuti, 1 psichiatra e la segretaria dello studio. In una sola seduta.

Non per le cose che ha detto. Ma perche'' e'' arrivato, si e'' seduto, e la sua aura di disagio ha contaminato l''intero edificio. Il piano di sotto (uno studio dentistico) ha evacuato per precauzione.

AZIONE: Lo studio sara'' fumigato e benedetto.');


