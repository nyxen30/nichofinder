// =====================================================================
//  NICHOS E SUBNICHOS DO NICHE FINDER
//  Cada subnicho tem uma busca por idioma (pt, en, es, de, fr).
//  Para mudar o que o robô procura, é só editar as frases abaixo.
// =====================================================================

export const LANGS = {
  pt: { label: 'Português', flag: '🇧🇷', region: 'BR' },
  en: { label: 'Inglês',    flag: '🇺🇸', region: 'US' },
  es: { label: 'Espanhol',  flag: '🇪🇸', region: 'MX' },
  de: { label: 'Alemão',    flag: '🇩🇪', region: 'DE' },
  fr: { label: 'Francês',   flag: '🇫🇷', region: 'FR' },
};

// ---------------------------------------------------------------------
//  MEU NICHO: roda TODO DIA, nas duas ordens (mais vistos e relevância)
// ---------------------------------------------------------------------
export const MY_NICHE = {
  id: 'sem-superficie',
  name: 'Sem Superfície',
  emoji: '🌊',
  subs: [
    { id: 'animais-perigosos', name: 'Animais perigosos', q: {
      pt: 'animais mais perigosos', en: 'most dangerous animals', es: 'animales más peligrosos',
      de: 'gefährlichste Tiere', fr: 'animaux les plus dangereux' } },
    { id: 'quanto-tempo-sobreviveria', name: 'Quanto tempo você sobreviveria', q: {
      pt: 'quanto tempo você sobreviveria', en: 'how long would you survive', es: 'cuánto tiempo sobrevivirías',
      de: 'wie lange würdest du überleben', fr: 'combien de temps survivrais-tu' } },
    { id: 'oceano-profundo', name: 'Oceano profundo / abismo', q: {
      pt: 'fundo do oceano criaturas', en: 'deep ocean creatures', es: 'criaturas del fondo del océano',
      de: 'Tiefsee Kreaturen', fr: 'créatures des abysses' } },
    { id: 'predadores-pre-historicos', name: 'Predadores pré-históricos', q: {
      pt: 'predadores pré-históricos', en: 'prehistoric predators', es: 'depredadores prehistóricos',
      de: 'Urzeit Raubtiere', fr: 'prédateurs préhistoriques' } },
    { id: 'e-se-animal', name: 'E se você encontrasse…', q: {
      pt: 'e se você encontrasse um tubarão', en: 'what if you met a shark', es: 'qué pasaría si te encontraras un tiburón',
      de: 'was wäre wenn du einem Hai begegnest', fr: 'et si vous croisiez un requin' } },
  ],
};

// ---------------------------------------------------------------------
//  TODOS OS OUTROS NICHOS: entram em rodízio (alguns por dia)
// ---------------------------------------------------------------------
export const NICHES = [
  { id: 'e-se', name: 'Curiosidades & "E se"', emoji: '🤔', subs: [
    { id: 'hipoteses', name: 'E se você…', q: {
      pt: 'e se você', en: 'what if you', es: 'qué pasaría si', de: 'was wäre wenn du', fr: 'et si vous' } },
    { id: 'superpoderes', name: 'Superpoderes / habilidades', q: {
      pt: 'e se você tivesse o poder de', en: 'what if you had the power to', es: 'y si tuvieras el poder de',
      de: 'was wäre wenn du die Kraft hättest', fr: 'et si tu avais le pouvoir de' } },
    { id: 'viagem-tempo', name: 'Viagem no tempo', q: {
      pt: 'e se você voltasse no tempo', en: 'what if you went back in time', es: 'y si volvieras al pasado',
      de: 'was wäre wenn du in die Vergangenheit reist', fr: 'et si tu remontais le temps' } },
  ]},
  { id: 'ciencia', name: 'Ciência & Espaço', emoji: '🔭', subs: [
    { id: 'espaco', name: 'Espaço e universo', q: {
      pt: 'universo explicado', en: 'universe explained', es: 'el universo explicado', de: 'das Universum erklärt', fr: "l'univers expliqué" } },
    { id: 'corpo-humano', name: 'Corpo humano', q: {
      pt: 'o que acontece com seu corpo', en: 'what happens to your body', es: 'qué le pasa a tu cuerpo',
      de: 'was passiert mit deinem Körper', fr: 'ce qui arrive à ton corps' } },
    { id: 'fisica', name: 'Física e fenômenos', q: {
      pt: 'física explicada', en: 'physics explained', es: 'física explicada', de: 'Physik erklärt', fr: 'la physique expliquée' } },
  ]},
  { id: 'natureza', name: 'Natureza & Animais', emoji: '🦁', subs: [
    { id: 'vida-selvagem', name: 'Vida selvagem', q: {
      pt: 'documentário vida selvagem', en: 'wildlife documentary', es: 'documental vida salvaje', de: 'Tierdokumentation', fr: 'documentaire animalier' } },
    { id: 'dinossauros', name: 'Dinossauros', q: {
      pt: 'dinossauros documentário', en: 'dinosaurs documentary', es: 'dinosaurios documental', de: 'Dinosaurier Doku', fr: 'dinosaures documentaire' } },
    { id: 'insetos', name: 'Insetos e bichos estranhos', q: {
      pt: 'insetos mais estranhos', en: 'weirdest insects', es: 'insectos más extraños', de: 'seltsamste Insekten', fr: 'insectes les plus étranges' } },
  ]},
  { id: 'historia', name: 'História', emoji: '🏛️', subs: [
    { id: 'antiga', name: 'História antiga', q: {
      pt: 'história antiga documentário', en: 'ancient history documentary', es: 'historia antigua documental',
      de: 'antike Geschichte Doku', fr: 'histoire antique documentaire' } },
    { id: 'guerras', name: 'Guerras e militar', q: {
      pt: 'segunda guerra mundial história', en: 'world war 2 history', es: 'segunda guerra mundial historia',
      de: 'Zweiter Weltkrieg Geschichte', fr: 'seconde guerre mondiale histoire' } },
    { id: 'vida-no-passado', name: 'Como era viver no passado', q: {
      pt: 'como era viver na idade média', en: 'what life was like in medieval times', es: 'cómo era vivir en la edad media',
      de: 'wie war das Leben im Mittelalter', fr: 'la vie au moyen âge' } },
    { id: 'misterios-historicos', name: 'Mistérios históricos', q: {
      pt: 'mistérios da história', en: 'history mysteries', es: 'misterios de la historia',
      de: 'Rätsel der Geschichte', fr: "mystères de l'histoire" } },
  ]},
  { id: 'misterio', name: 'Mistério & Terror', emoji: '🕯️', subs: [
    { id: 'true-crime', name: 'True crime', q: {
      pt: 'caso real crime', en: 'true crime case', es: 'caso real crimen', de: 'True Crime Fall', fr: 'affaire criminelle' } },
    { id: 'terror', name: 'Histórias de terror', q: {
      pt: 'histórias de terror', en: 'scary stories', es: 'historias de terror', de: 'Horrorgeschichten', fr: "histoires d'horreur" } },
    { id: 'nao-resolvidos', name: 'Casos não resolvidos', q: {
      pt: 'casos não resolvidos', en: 'unsolved mysteries', es: 'casos sin resolver', de: 'ungelöste Fälle', fr: 'affaires non résolues' } },
    { id: 'regras-sobrevivencia', name: 'Regras de terror / analog horror', q: {
      pt: 'regras para sobreviver terror', en: 'analog horror rules', es: 'reglas para sobrevivir terror',
      de: 'Regeln zum Überleben Horror', fr: 'règles pour survivre horreur' } },
  ]},
  { id: 'animacao', name: 'Animação & Histórias', emoji: '🎞️', subs: [
    { id: 'historias-animadas', name: 'Histórias animadas (drama)', q: {
      pt: 'história animada', en: 'animated story', es: 'historia animada', de: 'animierte Geschichte', fr: 'histoire animée' } },
    { id: 'sobrevivencia-dias', name: 'Sobrevivência dia 1 a 100', q: {
      pt: 'sobrevivendo 100 dias', en: 'surviving 100 days', es: 'sobreviviendo 100 días', de: '100 Tage überleben', fr: 'survivre 100 jours' } },
    { id: 'zumbi', name: 'Apocalipse zumbi', q: {
      pt: 'apocalipse zumbi história', en: 'zombie apocalypse story', es: 'apocalipsis zombi historia',
      de: 'Zombie Apokalypse Geschichte', fr: 'apocalypse zombie histoire' } },
  ]},
  { id: 'financas', name: 'Finanças & Negócios', emoji: '💰', subs: [
    { id: 'financas-pessoais', name: 'Finanças pessoais', q: {
      pt: 'como ficar rico', en: 'how to get rich', es: 'cómo hacerse rico', de: 'wie man reich wird', fr: 'comment devenir riche' } },
    { id: 'historia-empresas', name: 'História de empresas', q: {
      pt: 'a história da empresa', en: 'the rise and fall of', es: 'el ascenso y caída de', de: 'Aufstieg und Fall von', fr: "l'ascension et la chute de" } },
    { id: 'renda-online', name: 'Renda online', q: {
      pt: 'ganhar dinheiro na internet', en: 'make money online', es: 'ganar dinero por internet', de: 'online Geld verdienen', fr: 'gagner de l argent en ligne' } },
  ]},
  { id: 'tecnologia', name: 'Tecnologia & IA', emoji: '🤖', subs: [
    { id: 'ia', name: 'Inteligência artificial', q: {
      pt: 'inteligência artificial', en: 'artificial intelligence explained', es: 'inteligencia artificial', de: 'künstliche Intelligenz', fr: 'intelligence artificielle' } },
    { id: 'futuro', name: 'Futuro e tecnologia', q: {
      pt: 'como será o mundo em 2050', en: 'what the world will look like in 2050', es: 'cómo será el mundo en 2050',
      de: 'wie die Welt 2050 aussieht', fr: 'à quoi ressemblera le monde en 2050' } },
  ]},
  { id: 'geografia', name: 'Geografia & Países', emoji: '🗺️', subs: [
    { id: 'geopolitica', name: 'Mapas e geopolítica', q: {
      pt: 'geopolítica explicada', en: 'geopolitics explained', es: 'geopolítica explicada', de: 'Geopolitik erklärt', fr: 'géopolitique expliquée' } },
    { id: 'paises', name: 'Países explicados', q: {
      pt: 'por que este país', en: 'why this country', es: 'por qué este país', de: 'warum dieses Land', fr: 'pourquoi ce pays' } },
    { id: 'lugares-extremos', name: 'Lugares extremos', q: {
      pt: 'lugares mais perigosos do mundo', en: 'most dangerous places on earth', es: 'lugares más peligrosos del mundo',
      de: 'gefährlichste Orte der Welt', fr: 'endroits les plus dangereux du monde' } },
  ]},
  { id: 'cultura-pop', name: 'Games & Cultura pop', emoji: '🎮', subs: [
    { id: 'lore-games', name: 'Lore de games', q: {
      pt: 'história completa do jogo', en: 'full lore explained', es: 'historia completa del juego', de: 'Lore erklärt', fr: 'lore expliqué' } },
    { id: 'filmes', name: 'Filmes e séries explicados', q: {
      pt: 'filme explicado', en: 'movie explained', es: 'película explicada', de: 'Film erklärt', fr: 'film expliqué' } },
    { id: 'vilões', name: 'Vilões e personagens', q: {
      pt: 'suas chances de sobreviver', en: 'your chances of surviving', es: 'tus probabilidades de sobrevivir',
      de: 'deine Überlebenschancen', fr: 'tes chances de survie' } },
  ]},
  { id: 'mente', name: 'Psicologia & Autodesenvolvimento', emoji: '🧠', subs: [
    { id: 'psicologia', name: 'Psicologia', q: {
      pt: 'psicologia explicada', en: 'psychology explained', es: 'psicología explicada', de: 'Psychologie erklärt', fr: 'psychologie expliquée' } },
    { id: 'estoicismo', name: 'Estoicismo / filosofia', q: {
      pt: 'estoicismo', en: 'stoicism', es: 'estoicismo', de: 'Stoizismus', fr: 'stoïcisme' } },
    { id: 'saude', name: 'Saúde e doenças', q: {
      pt: 'doença mais rara do mundo', en: 'rarest disease in the world', es: 'enfermedad más rara del mundo',
      de: 'seltenste Krankheit der Welt', fr: 'maladie la plus rare du monde' } },
  ]},
  { id: 'fe-mitos', name: 'Fé & Mitologia', emoji: '📜', subs: [
    { id: 'biblia', name: 'Histórias bíblicas', q: {
      pt: 'história bíblica', en: 'bible story', es: 'historia bíblica', de: 'biblische Geschichte', fr: 'histoire biblique' } },
    { id: 'mitologia', name: 'Mitologia', q: {
      pt: 'mitologia grega', en: 'greek mythology', es: 'mitología griega', de: 'griechische Mythologie', fr: 'mythologie grecque' } },
  ]},
  { id: 'sobrevivencia', name: 'Sobrevivência & Desastres', emoji: '🧭', subs: [
    { id: 'desastres', name: 'Desastres reais', q: {
      pt: 'o pior desastre', en: 'worst disaster in history', es: 'el peor desastre', de: 'schlimmste Katastrophe', fr: 'la pire catastrophe' } },
    { id: 'sobreviventes', name: 'Histórias de sobreviventes', q: {
      pt: 'ele sobreviveu', en: 'how he survived', es: 'cómo sobrevivió', de: 'wie er überlebte', fr: 'comment il a survécu' } },
  ]},
];
