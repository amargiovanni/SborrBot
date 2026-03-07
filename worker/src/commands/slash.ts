import { Env } from '../types';
import { TelegramApi } from '../services/telegram';
import { getCategoryList, getUserStats, deleteUserData } from '../services/db';

interface CommandResult {
  handled: boolean;
  command?: string;
}

export async function handleSlashCommand(
  text: string,
  chatId: string,
  userId: string,
  env: Env,
  api: TelegramApi
): Promise<CommandResult> {
  const cmd = text.split(/\s+/)[0].toLowerCase().replace(/@\w+$/, ''); // strip @botname

  switch (cmd) {
    case '/start':
      await api.sendMessage(chatId,
        '🤖 *SborrBot* è qui!\n\n' +
        'Sono il bot più sborrante di Telegram. ' +
        'Scrivi /help per vedere tutti i comandi.\n\n' +
        '_Scrivi "insulta [nome]" per cominciare il divertimento!_',
        'Markdown'
      );
      return { handled: true, command: '/start' };

    case '/help':
      await api.sendMessage(chatId,
        '📋 *Comandi SborrBot*\n\n' +
        '🔤 *Testo:*\n' +
        '• `insulta [nome]` — Insulta qualcuno\n' +
        '• `insulta combo [nome]` — Triplo insulto devastante\n' +
        '• `minaccia [nome]` — Minaccia qualcuno\n' +
        '• `necrologio [nome]` — Necrologio pre-mortem\n' +
        '• `processo [nome]` — Verdetto del Tribunale SborrBot\n' +
        '• `cv [nome]` / `curriculum [nome]` — CV disastroso\n' +
        '• `complimento [nome]` — Complimento backhanded\n' +
        '• `dottore [nome]` / `diagnosi [nome]` — Referto medico assurdo\n' +
        '• `chi è [nome]` / `presentami [nome]` — Bio inventata e volgare\n' +
        '• `autopsia [nome]` — Referto autoptico volgare\n' +
        '• `notizia` — Notizia flash su un membro del gruppo\n' +
        '• `segreto` — Storia torbida tra due membri del gruppo\n' +
        '• `complotto` — Teoria del complotto su due membri\n' +
        '• `eredità` / `testamento` — Testamento assurdo con due membri\n' +
        '• `fact check` — Fact check inventato e assurdo\n' +
        '• `ricetta` — Ricetta disgustosa dello chef\n' +
        '• `bestemmia` — Una bella bestemmia\n' +
        '• `come diceva mio nonno` — Saggezza del nonno\n' +
        '• `buongiorno` / `buonanotte` / `ciao` — Saluti\n\n' +
        '🔮 *Speciali:*\n' +
        '• `oroscopo [segno]` — Oroscopo dello sborrone\n' +
        '• `meteo [città]` — Meteo volgare in tempo reale\n' +
        '• `frase celebre` / `citazione` / `perla di saggezza` — Citazione trash\n\n' +
        '😭 *Auto-trigger:*\n' +
        '• Scrivi `grazie` — risposta adeguata\n' +
        '• Scrivi `auguri` / `buon compleanno` — auguri del cazzo\n' +
        '• Scrivi `sono il migliore` / `sono forte` / `sono bravo` — demolizione ego\n' +
        '• Scrivi "ho fame", "sono stanco/a" ecc. — risposta sarcastica\n' +
        '• Scrivi "juve" / "juventus" — reazione immediata 💩\n\n' +
        '📸 *Foto:*\n' +
        '• `fica` / `culo` / `tette` — Foto hot\n' +
        '• `degrado` — Immagini cursed\n\n' +
        '🔊 *Audio:*\n' +
        '• `germano mosconi` — Il mitico Germano\n' +
        '• `christian de sica` — Christian De Sica\n' +
        '• `homer simpson` — Homer Simpson\n' +
        '• `i soliti idioti` — I Soliti Idioti\n' +
        '• `richard benson` — Richard Benson\n\n' +
        '🎨 *Sticker:*\n' +
        '• `apple` — Steve Jobs\n' +
        '• `banana` / `minion` — Minion\n' +
        '• `non ci sono` — Disapprovazione\n\n' +
        '⚙️ *Controllo:*\n' +
        '• `zitto sborrbot` — Metti in pausa\n' +
        '• `sveglia sborrbot` — Riattiva\n\n' +
        '📂 /testo /foto /audio /sticker — Liste per categoria\n' +
        'ℹ️ /info — Info sul bot\n\n' +
        '🔒 *Privacy (GDPR):*\n' +
        '• /privacy — Informativa privacy\n' +
        '• /mydata — Visualizza i tuoi dati\n' +
        '• /deleteme — Cancella tutti i tuoi dati',
        'Markdown'
      );
      return { handled: true, command: '/help' };

    case '/info':
      await api.sendMessage(chatId,
        '🤖 *SborrBot v1.0*\n\n' +
        'Il bot più sborrante di Telegram!\n' +
        'Ispirato al leggendario SpacoBot.\n\n' +
        '🏗️ Powered by Cloudflare Workers + D1 + R2',
        'Markdown'
      );
      return { handled: true, command: '/info' };

    case '/testo': {
      const categories = await getCategoryList(env.DB, 'text');
      const list = categories.map(c => `• *${c.name}* — \`${c.slug}\``).join('\n');
      await api.sendMessage(chatId,
        `📝 *Categorie Testo:*\n\n${list || '_Nessuna categoria disponibile_'}`,
        'Markdown'
      );
      return { handled: true, command: '/testo' };
    }

    case '/foto': {
      const categories = await getCategoryList(env.DB, 'photo');
      const list = categories.map(c => `• *${c.name}* — scrivi \`${c.slug}\``).join('\n');
      await api.sendMessage(chatId,
        `📸 *Categorie Foto:*\n\n${list || '_Nessuna categoria disponibile_'}`,
        'Markdown'
      );
      return { handled: true, command: '/foto' };
    }

    case '/audio':
    case '/audioeffettisonori':
    case '/audiochristiandesica':
    case '/audiohomersimpson':
    case '/audiosolitiidioti':
    case '/audiorichardbenson':
    case '/audiovari': {
      const categories = await getCategoryList(env.DB, 'audio');
      const list = categories.map(c => `• *${c.name}* — scrivi \`${c.slug.replace(/-/g, ' ')}\``).join('\n');
      await api.sendMessage(chatId,
        `🔊 *Categorie Audio:*\n\n${list || '_Nessuna categoria disponibile_'}`,
        'Markdown'
      );
      return { handled: true, command: '/audio' };
    }

    case '/sticker': {
      const categories = await getCategoryList(env.DB, 'sticker');
      const list = categories.map(c => `• *${c.name}* — scrivi \`${c.slug.replace('sticker-', '')}\``).join('\n');
      await api.sendMessage(chatId,
        `🎨 *Categorie Sticker:*\n\n${list || '_Nessuna categoria disponibile_'}`,
        'Markdown'
      );
      return { handled: true, command: '/sticker' };
    }

    case '/privacy':
      await api.sendMessage(chatId,
        '🔒 *Informativa Privacy — SborrBot*\n\n' +
        '*Dati raccolti:*\n' +
        '• ID Telegram (chat e utente)\n' +
        '• Username (se disponibile)\n' +
        '• Comandi inviati e tipo di risposta\n' +
        '• Data e ora di ogni interazione\n\n' +
        '*Finalità:* funzionamento del bot e statistiche di utilizzo.\n' +
        '*Conservazione:* i log vengono eliminati automaticamente dopo 90 giorni.\n' +
        '*Base giuridica:* legittimo interesse (Art. 6.1.f GDPR).\n\n' +
        '*I tuoi diritti (GDPR):*\n' +
        '• /mydata — Visualizza i dati raccolti su di te\n' +
        '• /deleteme — Cancella tutti i tuoi dati\n\n' +
        '_Titolare: il gestore del bot. Per richieste: contatta l\'admin del gruppo._',
        'Markdown'
      );
      return { handled: true, command: '/privacy' };

    case '/mydata': {
      const stats = await getUserStats(env.DB, userId);
      if (!stats) {
        await api.sendMessage(chatId,
          '📊 *I tuoi dati*\n\nNon ho dati registrati su di te.',
          'Markdown'
        );
      } else {
        await api.sendMessage(chatId,
          '📊 *I tuoi dati su SborrBot*\n\n' +
          `• *Comandi registrati:* ${stats.totalCommands}\n` +
          `• *Prima interazione:* ${stats.firstSeen}\n` +
          `• *Ultima interazione:* ${stats.lastSeen}\n\n` +
          '_Usa /deleteme per cancellare tutti i tuoi dati._',
          'Markdown'
        );
      }
      return { handled: true, command: '/mydata' };
    }

    case '/deleteme': {
      const deleted = await deleteUserData(env.DB, userId);
      if (deleted === 0) {
        await api.sendMessage(chatId,
          '🗑️ *Cancellazione dati*\n\nNon avevi dati da cancellare.',
          'Markdown'
        );
      } else {
        await api.sendMessage(chatId,
          '🗑️ *Cancellazione dati completata*\n\n' +
          `Ho eliminato *${deleted}* record associati al tuo account.\n` +
          '_I tuoi dati sono stati rimossi in conformità all\'Art. 17 GDPR._',
          'Markdown'
        );
      }
      return { handled: true, command: '/deleteme' };
    }

    default:
      return { handled: false };
  }
}
