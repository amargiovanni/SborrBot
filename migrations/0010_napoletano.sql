-- Migration 0010: frasi napoletane
-- Categoria per frasi random in napoletano, triggerate quando qualcuno nomina
-- Napoli, napoletani, Vesuvio, pizza, o cose strettamente napoletane

-- ============================================================
-- NUOVA CATEGORIA
-- ============================================================

INSERT INTO categories (slug, name, type, description) VALUES
  ('napoletano', 'Napoletano', 'text', 'Frasi in napoletano che scimmiottano lo stereotipo del napoletano verace');

-- ============================================================
-- FRASI NAPOLETANE (~100 frasi)
-- ============================================================

INSERT INTO text_responses (category_id, content) VALUES
-- Filosofia napoletana
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Chi ha parlat'' ''e Napule?! Nun te permettere, ca Napule e'' ''a capitale d''''o munno!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Aggio sentito "Napoli"... e m''e'' venuta ''a lacrimuccia. Chesta e'' ''a citta'' chiu'' bella d''''o creato!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', a Napoli ''o sole splende pure ''e notte, pecche'' ce penz'' ''o Vesuvio!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', tu parli ''e Napoli? Allora sient'' a me: tre cose so'' belle ''int'' ''o munno: ''o mare, ''a pizza e ''a mamma!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'' ue'' ue''! Qualcuno ha nominato ''a citta'' chiu'' bella d''''o pianeta! Napoli nun e'' na citta'', e'' nu sentimento!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli dicimm'': chi tene ''a salute e'' ricco e nun ''o sape. E chi tene ''a pizza e'' ricchissimo!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Frate'', a Napoli ''o cafe'' nun e'' na bevanda, e'' na filosofia ''e vita. ''O bivi e capisci tutto!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ma che stai parlanno ''e Napoli?! Vieni a vede'' ''o golfo e po'' ne parlammo, ue''!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', Napoli e'' comme ''a mamma: po'' essere incasinata, ma e'' sempe ''a cosa chiu'' bella ca tieni!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli ''o traffico nun esiste. Esiste ''a creativita'' stradale!'),

-- Cibo
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Chi ha ditto pizza?! PIZZA?! Fra'', ''a pizza ''e Napoli e'' patrimonio dell''umanita'', nun e'' comme chella schifezza ca magna tu!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', ''a pizza! A Napoli ''a pizza e'' sacra, e'' comme ''a Madonna! Chi ce mette l''ananas va direttamente all''inferno!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', tu mangi ''a pizza co'' ''e posate? A Napoli pe'' chesto te cacciano a calci! ''A pizza se mangia cu'' ''e mmane!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', tu parli ''e pizza? ''A vera pizza e'' solo a Napoli! Tutto ''o riesto e'' pane cu'' ''a pummarola!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), '''A pizza margherita e'' stata inventata a Napoli pe'' ''a Regina! Nuje simmo ''e re d''''a pizza, capi''?!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', ''a pizza ''e Napoli? ''O cornicione deve essere alto, ''a mozzarella filante, ''o basilico frisco... tutto ''o riesto e'' spazzatura!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Chi ha nominato ''a pizza?! Fermateve tutte cose! Mo'' ve racconto ''a storia d''''a vera pizza napoletana... no vabbe'', magnatevela e basta!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', a Napoli pure ''e pizze sbagliate so'' buone! Pecche'' nuje mettimmo l''ammore dinto!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', ''o ragu'' napoletano cuoce minimo sei ore. SEI ORE. Vuie fate ''o sugo in venti minuti e ''o chiamate ragu''? Ma per favore!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', ''a sfogliatella! Riccia o frolla, nun me importa, basta ca e'' napoletana!'),

-- Vesuvio
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Chi ha ditto Vesuvio?! ''O Vesuvio e'' ''o padrone ''e casa, nuje simmo solo ospiti! Ma che ospiti... ospiti col botto!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', ''o Vesuvio sta lla'', ce guarda tutte ''e juorne... e nuje ''o guardammo a isso. E'' na storia d''ammore pericolosa!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), '''O Vesuvio? Paisa'', chillo e'' ''o termosifone chiu'' grande d''''o munno! A Napoli nun ce serve ''o riscaldamento!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', ''o Vesuvio e'' comme ''o nonno: sta lla'', nun dice niente, ma quanno se sceta'' so'' cazzi amari!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), '''O Vesuvio e'' ''a montagna chiu'' famosa d''''o munno! L''Everest e'' alto, ma ''o Vesuvio tene ''o carattere!'),

-- Vita quotidiana
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''e semafori so'' consigli, nun so'' obblighi! Verde, giallo, rosso... tutte ''a stessa cosa: vai!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli ''o parcheggio e'' n''arte! Nuje parcheggiammo indove nisciuno osa manco pensare!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', a Napoli ''e motorini volano! Tre persone, ''o cane e ''a spesa... tutte ''ncopp'' a nu scooter!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', a Napoli ''a fila nun esiste. Esiste ''o "io stevo primma ''e te"! E'' democrazia avanzata!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli quanno chiove se ferma tutto. Pecche''? Pecche'' ''a pioggia e'' ''o modo ca Dio ce dice ''e piglia'' ''o cafe''!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', a Napoli ''o clacson nun serve pe'' avvisa'', serve pe'' saluta''! BEEP BEEP! Ue'', cumpa''!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''e panni stesi so'' bandiere! Ogne balcone e'' na nazione indipendente!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', a Napoli ''o caffe'' sospeso e'' poesia! Tu paghi pe'' chi nun po''! Nuje simmo ''o cuore d''''o munno!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli se dice: "Adda passa'' ''a nuttata." E pass'' sempe, pecche'' nuje simmo testardi comme ''e muli!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli ''a raccolta differenziata ''a facimmo: monnezza a destra, monnezza a sinistra!'),

-- Orgoglio napoletano
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ma tu che ne sai ''e Napoli?! Napoli e'' Maradona, e'' Toto'', e'' Eduardo, e'' Pino Daniele! Nuje tenimmo ''a storia!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', Diego Armando Maradona e'' ''o Dio d''''o pallone e Napoli e'' ''o Paradiso! Fine d''''a discussione!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', ''o napoletano nun e'' nu dialetto, e'' na lingua! Shakespeare? Dante? Dilettanti! Sentite a Toto''!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', Napoli ha inventato ''a pizza, ''o cafe'' come Dio comanda, e ''o presepe! Che avete inventato vuie? ''O niente!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli dicimmo: "Chi pecora se fa, ''o lupo se ''a mangia!" E nuje nun simmo pecure, simmo lupi!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', Napoli e'' comme Maradona: tutti ''a criticano, ma tutti ''a vogliono!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli pure ''a miseria e'' allegra! Nuje cantammo pure quanno nun tenimmo niente!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Chi dice ca Napoli e'' ''a citta'' d''''o caos nun ha capito niente. ''O caos e'' arte, e nuje simmo artisti!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', vuie tenite ''a tecnologia, nuje tenimmo ''o core! E cu'' ''o core se campa meglio!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''a mamma e'' sacra! Si parli male d''''a mamma ''e nu napoletano, te conviene scappa''!'),

-- Superstizioni e tradizioni
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', attiento a chello ca dici! A Napoli ''a jettatura e'' cosa seria! Fammi fa'' ''e corna...'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', a Napoli ''o corno rosso nun e'' accessorio, e'' armatura! Senza ''o curniciello nun esci ''a casa!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', a Napoli San Gennaro e'' ''o boss! Quanno ''o sangue se scioglie, e'' festa! Quanno nun se scioglie... so'' cazzi!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''o 13 porta fortuna e ''o 17 porta sfiga! Ma nuje sfidammo pure ''a sfiga, pecche'' simmo napoletani!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', ''a Smorfia napoletana e'' meglio ''e Google! Vuo'' sape'' che significa ''o suonno? Chiedilo a nu napoletano!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), '''O muorto ca parla? 48! ''A carne cotta? 49! A Napoli pure ''e suonni diventano numeri!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli ''o Natale e'' sacro! ''O presepe se fa a novembre, l''albero e'' pe'' chilli ''e fora!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', a Napoli ''e fuochi ''e Capodanno so'' comme na guerra! Ma nuje festeggammo accussi''!'),

-- Espressioni tipiche
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ma che vvuo''?!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'' ue''! Chi t''ha ditto ''e parla'' ''e Napoli?! Nuje simmo gelusi d''''a citta'' nosta!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Maronna mia! Qualcuno ha nominato Napoli e m''e'' partito ''o sentimento!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Seh, vabbe''... comme dicimmo a Napoli: "Fatte ''e cazzi tuoi e campa cent''anni!"'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli dicimmo: "Chi tene arte, ''mparti!" E nuje ''e arti ''e tenimmo tutte!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', sient'' a me: ''O Signore ha fatto ''o munno, ma Napoli l''ha fatta ''o sole!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), '''A Madonna! Comm'' e'' bello senti'' parla'' ''e Napoli! Me fa veni'' ''a pelle ''e gallina!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'' guaglio'', comme se dice a Napoli: "Haje voglia ''e mettere rum!" Cioe'': e'' inutile!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', a Napoli quanno uno e'' furbo dicimmo ca e'' "nu dritto"! E nuje simmo tutti dritti!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', "Chi tene ''o mare ''a rimpetto, tene ''o munno ''mpietto!" E nuje tenimmo ''o golfo chiu'' bello!'),

-- Confronti con altre citta
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Milano? Fra'', a Milano lavorano. A Napoli vivono! C''e'' differenza!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Roma? Paisa'', Roma e'' ''a capitale politica, ma Napoli e'' ''a capitale d''''o core!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Torino? Ue'', quilli fanno ''e macchine, nuje facimmo ''a felicita''!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Firenze? Bella si'', ma ''a bistecca fiorentina nun e'' ''a pizza margherita!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Venezia? Tene l''acqua pure Napoli, ma almeno nuje ce camminiamo senza barca!'),

-- Mandolino e musica
((SELECT id FROM categories WHERE slug = 'napoletano'), '''O sole mioooo! Se sta ''nnanze a te! ...ue'', che guardi? A Napoli se canta sempe!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', "Funiculi'' Funicula''" e'' nata a Napoli! ''A musica napoletana conquista ''o munno!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', Pino Daniele e'' nu santo! "Napule e''" e'' l''inno nazionale d''''a bellezza!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', a Napoli ''o mandolino nun e'' vintage, e'' cultura!'),

-- Comicita pura
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''o wifi nun serve! Ce bastano ''e urla d''''o balcone pe'' comunica''!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli ''a lavatrice e'' ''o mare! Risparmio energetico alla napoletana!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', ''o napoletano e'' l''unico ca riesce a litiga'' e a fa'' pace dint'' ''a stessa frase!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''e nonni so'' ''o GPS originale! "Vir'' a destra, po'' addove sta ''a Madonna, po'' adderitto!"'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', a Napoli ''o condizionatore e'' ''a corrente d''aria d''''o vicolo! Gratis e naturale!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', ''o napoletano e'' l''unico ca fa ''o bagno ''o primmo ''e maggio e dice: "''O mare e'' bellissimo!"'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''a dieta mediterranea significa: pasta ''a matina, pizza ''o miezojuorno e fritto ''a sera!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli se dice: "Meglio nu juorno ''a leone ca cient''anni ''a pecora!" E nuje ruggiamo forte!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', ''o napoletano quanno vede ''a neve pensa: "Bene, mo'' posso friggere ''e zeppole senza suda''!"'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''o dizionario ha tremila parole pe'' "mangiare" e una sola pe'' "dieta": NOOOO!'),

-- Saggezza popolare
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Comme diceva ''o bisnonno mio: "A Napoli ''e problemi se risolvono cu'' na tazzulella ''e cafe''!"'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli dicimmo: "Cu'' ''a salute e cu'' ''e soldi, ognuno se gratta addove ''o prude!"'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', antico proverbio napoletano: "Chi va piano va sano e va lontano... ma a Napoli chi va piano perde ''o posto!"'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli ''a pazienza e'' na virtu''... ma fino a nu certo punto! Po'' partono ''e moccole!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', saggezza napoletana: "Meglio cummanda'' ca fottere!" ...cioe'', no, aspetta, tutt'' ''e ddoje!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli se dice: "Ogne scarrafone e'' bello a mamma soja!" Pure tu, paisa''!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', a Napoli ''o cafe'' amaro e'' pe'' chi soffre, ''o cafe'' dolce e'' pe'' chi ama. Nuje ''o pigliammo dolcissimo!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Proverbio napoletano: "A gallina fa l''uovo e ''o gallo ''e canta!" E nuje cantammo sempe!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', comme dicimmo nuje: "Se l''ammore e'' bello, ''a gelosia e'' bellissima!"'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''o tempo nun esiste! Dice "cinque minuti" e so'' doje ore! Ma cu'' stile!'),

-- Extra - Vita sociale
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''o vicino ''e casa sape ''e fatti tuoi primma ''e te! E'' ''o servizio segreto chiu'' efficiente d''''o munno!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli quanno dice "vengo tra poco" significa "attaccate ''o telefono e aspetta tre ore"!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', a Napoli ''a carbonara nun esiste! Esiste ''a genovese, ''o ragu'', ''a pasta e patane! ''A carbonara e'' robba ''e Roma!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', ''o napoletano e'' ''o popolo chiu'' generoso d''''o munno: te da'' pure chello ca nun tene!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Guaglio'', a Napoli quanno ''a mamma dice "mettiti ''a maglia" fuori ce stanno 35 gradi, ma tu ''a metti!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli ''o pranzo d''''a domenica e'' sacro! Chi manca senza giustificazione viene diseredato!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Ue'', a Napoli ''e gatti so'' piu'' furbi d''''e persone! Mangiano, dormono e fanno ''o cazzo ca vogliono! Comme a nuje!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', a Napoli quanno chiudi ''a macchina fai tre segni della croce, due corna e nu scongiuro!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'A Napoli se dice: "''A meglia parola e'' chella ca nun se dice!" Ma nuje nun ''a seguimmo mai!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', ''o vero napoletano riconosce ''a mozzarella ''e bufala a occhi chiusi! E'' ''o nostro superpotere!'),

-- Extra - Stereotipi ribaltati
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Dicono ca simmo troppo rumorosi. Nun e'' vero! E'' ca vuie siente troppo poco!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Dicono ca ''e napoletani so'' furbi. E'' ''a verita''! Ma ce vuole pure intelligenza pe'' essere furbi!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Dicono ca a Napoli se ruba. Ma nuje rubiamo solo ''o core d''''a gente!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Paisa'', dicono ca ''o napoletano e'' esagerato. ESAGERATO?! MA COMME TE PERMETTI?! Nuje simmo PERFETTAMENTE NORMALI!!!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Dicono ca ''e napoletani parlano cu'' ''e mmane. E'' vero! ''E mmane nostre teneno chiu'' vocabolario d''''a Treccani!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Dicono ca a Napoli se mangia troppo. Ma che vuol di'' "troppo"?! E'' na parola ca nun esiste int'' ''o vocabolario napoletano!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Dicono ca ''e napoletani arrivano sempre in ritardo. Nun e'' vero, simmo nuje ca vivimmo in un fuso orario diverso!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Fra'', dicono ca ''o napoletano e'' melodrammatico. MELODRAMMATICO?! IO?! MA QUANNO MAI?! *si butta a terra piangendo*'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Dicono ca Napoli e'' caotica. Nuje ''a chiamiamo "vivace"! E'' questione di prospettiva!'),
((SELECT id FROM categories WHERE slug = 'napoletano'), 'Dicono ca ''e napoletani urlano. NUN E'' VERO CA URLAMMO! PARLIMMO SOLO A VOCE ALTA!!!');
