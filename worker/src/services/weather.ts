export interface WeatherData {
  conditionCode: number;
  conditionMain: string;
  description: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  cityName: string;
}

export async function fetchWeather(apiKey: string, city: string): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=it`;

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('CITY_NOT_FOUND');
    }
    throw new Error(`OpenWeatherMap API error: ${res.status}`);
  }

  const data = (await res.json()) as any;

  return {
    conditionCode: data.weather[0].id,
    conditionMain: data.weather[0].main,
    description: data.weather[0].description,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    cityName: data.name,
  };
}

type WeatherCategory = 'temporale' | 'pioggia' | 'neve' | 'nebbia' | 'sereno' | 'nuvole' | 'caldo' | 'freddo';

function categorizeWeather(weather: WeatherData): WeatherCategory {
  if (weather.temperature >= 35) return 'caldo';
  if (weather.temperature <= 0) return 'freddo';

  const code = weather.conditionCode;
  if (code >= 200 && code < 300) return 'temporale';
  if (code >= 300 && code < 600) return 'pioggia';
  if (code >= 600 && code < 700) return 'neve';
  if (code >= 700 && code < 800) return 'nebbia';
  if (code === 800) return 'sereno';
  return 'nuvole';
}

const TEMPLATES: Record<WeatherCategory, string[]> = {
  temporale: [
    '{temp}\u00B0C, {desc}. Fuori sembra che Dio stia tirando bestemmie sotto forma di fulmini. Se esci sei un coglione.',
    '{temp}\u00B0C e temporale! Lampi e tuoni come il culo di tua zia quando si siede. Stai a casa brutto stronzo.',
    '{temp}\u00B0C, {desc}. L\u2019unica cosa che scarica pi\u00F9 di questo temporale \u00E8 la diarrea dopo il kebab delle 3 di notte.',
    '{temp}\u00B0C con temporale della madonna! Piove che Dio la manda, e la manda proprio a te perch\u00E9 sei un peccatore di merda.',
    '{temp}\u00B0C, {desc}. Manco No\u00E8 uscirebbe con questo tempo. E quello aveva un cazzo di arca.',
    '{temp}\u00B0C e temporale! L\u2019unico flash pi\u00F9 accecante dei lampi \u00E8 la pelata di tuo padre al sole.',
    '{temp}\u00B0C, {desc}! Se senti tuonare non \u00E8 il temporale, \u00E8 tua madre che ha scoperto il tuo estratto conto.',
    '{temp}\u00B0C con un temporale che manco nel film Twister! Chiudi le finestre e tieni aperta la bocca... anzi no, chiudi pure quella.',
  ],

  pioggia: [
    '{temp}\u00B0C e piove come il cazzo! L\u2019unica cosa pi\u00F9 bagnata di te \u00E8 la fica di tua sorella quando vede il postino.',
    '{temp}\u00B0C, {desc}. Esci con l\u2019ombrello, anzi no, esci col preservativo che \u00E8 l\u2019unica protezione che non usi mai.',
    '{temp}\u00B0C e {desc}. Pi\u00F9 acqua fuori che nel tuo bidet... che tanto non lo usi, puzzone.',
    '{temp}\u00B0C, piove che sembra il pianto di tua madre quando le hanno detto che sei tu il suo figlio preferito... scherzo, non lo sei.',
    '{temp}\u00B0C e {desc}. Se devi uscire, sappi che farai meno schifo bagnato. \u00C8 un miglioramento.',
    '{temp}\u00B0C con sta pioggia del cazzo. Il meteo dice che smette alle 18. Il meteo mente come te quando dici "sto arrivando".',
    '{temp}\u00B0C, {desc}. Piove a dirotto, tipo le lacrime del tuo conto in banca a fine mese.',
    '{temp}\u00B0C e piove! L\u2019unica cosa che scorre pi\u00F9 di questa pioggia \u00E8 il moccio dal naso di tuo cugino.',
  ],

  neve: [
    '{temp}\u00B0C e nevica! Pi\u00F9 freddo del cuore della tua ex quando ti ha mollato. Copriti, coglione.',
    '{temp}\u00B0C, {desc}! L\u2019unica cosa pi\u00F9 bianca di questa neve \u00E8 la faccia di tuo padre quando ha visto la bolletta del gas.',
    '{temp}\u00B0C e neve! Se fai un pupazzo di neve avr\u00E0 comunque pi\u00F9 personalit\u00E0 di te.',
    '{temp}\u00B0C, {desc}. Fuori \u00E8 un ghiacciolo, tipo il cazzo di tuo marito... sempre freddo e inutile.',
    '{temp}\u00B0C e neve a catinelle! L\u2019unico fiocco che conosci \u00E8 quello di mais della colazione, ignorante.',
    '{temp}\u00B0C, nevica! Il tuo QI e la temperatura finalmente coincidono. Sotto zero.',
    '{temp}\u00B0C e {desc}. Mettiti 4 strati addosso, tanto nemmeno cos\u00EC qualcuno ti guarder\u00E0.',
    '{temp}\u00B0C con la neve! L\u2019unica palla di neve pi\u00F9 grossa \u00E8 quella che ti racconti quando dici "questo \u00E8 il mio anno".',
  ],

  nebbia: [
    '{temp}\u00B0C e nebbia fitta! Non si vede un cazzo, tipo il tuo futuro.',
    '{temp}\u00B0C, {desc}. Manco la nebbia riesce a nascondere quanto sei brutto.',
    '{temp}\u00B0C con sta nebbia! Se ti perdi, tranquillo: nessuno ti cercher\u00E0.',
    '{temp}\u00B0C e {desc}. Visibilit\u00E0 zero, come le tue possibilit\u00E0 di trovare qualcuno che ti sopporti.',
    '{temp}\u00B0C, nebbia ovunque! Meno confuso di cos\u00EC sei solo quando provi a leggere la ricevuta del bancomat.',
    '{temp}\u00B0C e una nebbia della madonna! Pi\u00F9 denso di cos\u00EC c\u2019\u00E8 solo il tuo cervello.',
    '{temp}\u00B0C, {desc}. Oggi i coglioni guidano peggio del solito, e la nebbia \u00E8 solo la scusa.',
    '{temp}\u00B0C con la nebbia. L\u2019unica cosa pi\u00F9 grigia di oggi \u00E8 la tua vita sentimentale.',
  ],

  sereno: [
    '{temp}\u00B0C e c\u2019\u00E8 il sole della madonna! Esci da quella tana che puzza di piedi, tanto pi\u00F9 brutto di cos\u00EC non diventi.',
    '{temp}\u00B0C, {desc}! Una giornata bella quasi quanto la sorella del tuo amico. Quasi.',
    '{temp}\u00B0C e cielo sereno! L\u2019unica cosa che brilla pi\u00F9 del sole \u00E8 la pelata di tuo padre.',
    '{temp}\u00B0C e {desc}. Il sole splende, gli uccellini cantano... e tu sei sempre il solito stronzo. Ma almeno col sole.',
    '{temp}\u00B0C, cielo limpido! Giornata perfetta per uscire e deludere le persone di persona anzich\u00E9 via chat.',
    '{temp}\u00B0C e un sole che spacca! Metti la crema solare o diventi rosso come la faccia del tuo capo quando vede i tuoi report.',
    '{temp}\u00B0C, {desc}. Con questo sole la gente \u00E8 felice! Tu no, ma almeno non piove sulle tue lacrime.',
    '{temp}\u00B0C e cielo azzurro! L\u2019unica cosa pi\u00F9 sgombra di questo cielo \u00E8 il tuo frigo a fine mese.',
  ],

  nuvole: [
    '{temp}\u00B0C e nuvoloso. Il cielo \u00E8 grigio come la tua personalit\u00E0. Almeno il cielo ha una scusa.',
    '{temp}\u00B0C, {desc}. Giornata triste come la tua vita sentimentale.',
    '{temp}\u00B0C e nuvole ovunque. L\u2019unica cosa pi\u00F9 coperta di questo cielo \u00E8 la verit\u00E0 sulle tue misure.',
    '{temp}\u00B0C, {desc}. N\u00E9 sole n\u00E9 pioggia, tipo te: n\u00E9 bello n\u00E9 brutto. Anzi no, brutto s\u00EC.',
    '{temp}\u00B0C con ste nuvole del cazzo. Il cielo non sa cosa fare, tipo te in ufficio ogni luned\u00EC.',
    '{temp}\u00B0C e {desc}. Le nuvole passano, la tua faccia di culo resta.',
    '{temp}\u00B0C, nuvoloso. Potrebbe piovere, potrebbe uscire il sole. La vita \u00E8 un mistero, come il contenuto del tuo frigo.',
    '{temp}\u00B0C e cielo coperto. Coperto come il tuo talento: nessuno l\u2019ha mai visto.',
  ],

  caldo: [
    '{temp}\u00B0C! Si muore di caldo! L\u2019unica cosa pi\u00F9 calda di oggi \u00E8 l\u2019inferno che ti aspetta, peccatore di merda!',
    '{temp}\u00B0C! Si schiatta! Sudate pi\u00F9 voi di un prete in un parco giochi!',
    '{temp}\u00B0C, un forno a cielo aperto! L\u2019unica cosa che si scioglie pi\u00F9 di te al sole \u00E8 il tuo gelato da 5 euro che cola sul marciapiede.',
    '{temp}\u00B0C e si crepa! Il caldo ti fa puzzare pi\u00F9 del solito, e gi\u00E0 normalmente fai schifo.',
    '{temp}\u00B0C! Oggi l\u2019unica cosa da fare \u00E8 stare fermi e puzzare il meno possibile. Per te \u00E8 impossibile.',
    '{temp}\u00B0C di caldo infernale! Se vuoi sapere come ci si sente all\u2019inferno, esci. Spoiler: uguale ma con meno parcheggi.',
    '{temp}\u00B0C! L\u2019asfalto si scioglie, le uova si cuociono sul cofano... e il tuo cervello \u00E8 sempre pi\u00F9 bollito del solito.',
    '{temp}\u00B0C! Fa cos\u00EC caldo che il mio circuito si sta surriscaldando. E io sono un bot, tu immagina.',
  ],

  freddo: [
    '{temp}\u00B0C! Un freddo cane, pi\u00F9 freddo delle tue ex quando ti hanno mollato! Copriti quel cazzo di naso.',
    '{temp}\u00B0C! L\u2019unica cosa pi\u00F9 fredda di oggi \u00E8 il cuore della tua suocera.',
    '{temp}\u00B0C! Restate sotto le coperte, tanto non avete un cazzo da fare.',
    '{temp}\u00B0C e gela! Il termometro e il tuo conto in banca hanno una cosa in comune: sono entrambi sotto zero.',
    '{temp}\u00B0C! Fa talmente freddo che pure i pinguini ti mandano a fanculo se gli chiedi di uscire.',
    '{temp}\u00B0C! I tuoi capezzoli sono pi\u00F9 duri della matematica al liceo. Copriti, cretino.',
    '{temp}\u00B0C e freddo polare! L\u2019unica cosa che si congela pi\u00F9 velocemente di te \u00E8 la tua chat con la tipa che non ti risponde.',
    '{temp}\u00B0C! Se esci diventi blu. Come l\u2019umore di chi ti vede la mattina.',
  ],
};

export function buildWeatherMessage(weather: WeatherData): string {
  const category = categorizeWeather(weather);
  const templates = TEMPLATES[category];
  const template = templates[Math.floor(Math.random() * templates.length)];

  const windKmh = Math.round(weather.windSpeed * 3.6);

  return template
    .replace(/\{temp\}/g, String(weather.temperature))
    .replace(/\{feels_like\}/g, String(weather.feelsLike))
    .replace(/\{desc\}/g, weather.description)
    .replace(/\{humidity\}/g, String(weather.humidity))
    .replace(/\{wind\}/g, String(windKmh));
}
