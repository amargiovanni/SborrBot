-- SborrBot Seed Data — Categorie iniziali

INSERT INTO categories (slug, name, type, description) VALUES
  ('insulti', 'Insulti', 'text', 'Insulti casuali per i tuoi amici'),
  ('minacce', 'Minacce', 'text', 'Minacce scherzose'),
  ('bestemmie', 'Bestemmie', 'text', 'Bestemmie creative'),
  ('nonno', 'Come diceva mio nonno', 'text', 'Frasi sagge del nonno'),
  ('saluti', 'Saluti', 'text', 'Buongiorno, buonanotte, ciao'),
  ('germano-mosconi', 'Germano Mosconi', 'audio', 'Le celebri frasi di Germano Mosconi'),
  ('christian-de-sica', 'Christian De Sica', 'audio', 'Audio di Christian De Sica'),
  ('homer-simpson', 'Homer Simpson', 'audio', 'Audio di Homer Simpson'),
  ('soliti-idioti', 'I Soliti Idioti', 'audio', 'Audio de I Soliti Idioti'),
  ('richard-benson', 'Richard Benson', 'audio', 'Audio di Richard Benson'),
  ('effetti-sonori', 'Effetti Sonori', 'audio', 'Effetti sonori vari'),
  ('audio-vari', 'Audio Vari', 'audio', 'Audio vari e divertenti'),
  ('fica', 'Fica', 'photo', 'Foto categoria fica'),
  ('culo', 'Culo', 'photo', 'Foto categoria culo'),
  ('tette', 'Tette', 'photo', 'Foto categoria tette'),
  ('sticker-apple', 'Apple / Steve Jobs', 'sticker', 'Sticker a tema Apple'),
  ('sticker-minion', 'Banana / Minion', 'sticker', 'Sticker dei Minion'),
  ('sticker-disapprovazione', 'Non ci sono', 'sticker', 'Sticker di disapprovazione');

-- Config iniziale
INSERT INTO bot_config (key, value) VALUES
  ('bot_name', 'SborrBot'),
  ('rate_limit_per_minute', '10'),
  ('nsfw_default', 'true'),
  ('audio_default', 'true');

-- Frasi di esempio per ogni categoria testuale
INSERT INTO text_responses (category_id, content) VALUES
  -- Insulti (category_id = 1)
  (1, 'Ehi {name}, sei talmente inutile che il tuo albero genealogico è un cerchio.'),
  (1, '{name}, se il cervello fosse dinamite, non ti basterebbe per soffiarti il naso.'),
  (1, '{name} è la prova vivente che anche i preservativi hanno una percentuale di fallimento.'),
  (1, 'Senti {name}, ho visto pozzanghere più profonde di te.'),
  (1, '{name}, se fossi più lento saresti fermo.'),
  -- Minacce (category_id = 2)
  (2, '{name}, ti faccio un culo così che ci puoi parcheggiare un TIR.'),
  (2, 'Attento {name}, la prossima volta ti mando i piccioni addestrati.'),
  (2, '{name}, giuro che ti faccio mangiare la tastiera lettera per lettera.'),
  (2, 'Stai attento {name}, che ti faccio diventare un meme.'),
  (2, '{name}, ti cancello dalla chat e dalla vita.'),
  -- Bestemmie (category_id = 3)
  (3, 'Porco di quel dio!'),
  (3, 'Dio cane maledetto!'),
  (3, 'Madonna puttana!'),
  (3, 'Dio bestia!'),
  (3, 'Porco il clero!'),
  -- Come diceva mio nonno (category_id = 4)
  (4, 'Come diceva mio nonno: chi dorme non piglia pesci, ma almeno non rompe i coglioni.'),
  (4, 'Come diceva mio nonno: meglio un giorno da leone che una vita da stronzo.'),
  (4, 'Come diceva mio nonno: la vita è come una scala, c''è chi sale e chi scende... e chi cade.'),
  (4, 'Come diceva mio nonno: non fidarti mai di chi non beve.'),
  (4, 'Come diceva mio nonno: a caval donato non si guarda in bocca, si guarda il culo.'),
  -- Saluti (category_id = 5)
  (5, 'Buongiorno coglioni! 🌞'),
  (5, 'Buonanotte stronzi, dormite bene! 🌙'),
  (5, 'Ciao belli! SborrBot è qui per voi! 👋'),
  (5, 'Buongiorno a tutti tranne a chi non se lo merita! ☀️'),
  (5, 'Buonanotte, e che Dio ve la mandi buona! 😴');
