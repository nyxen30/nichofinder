// =====================================================================
//  NICHOS E SUBNICHOS DO NICHE FINDER
//  Cada subnicho tem uma busca por idioma (pt, en, es, de, fr).
//  Para mudar o que o robô procura, é só editar as frases abaixo.
//
//  PALAVRAS-CHAVE (kw): servem para CONFERIR o tema do canal.
//  Um canal só entra num nicho se os títulos dos vídeos longos dele
//  baterem com as palavras do nicho (regra em scripts/classify.mjs).
//  Como escrever:
//    'tubarão'   -> palavra inteira (acento e maiúscula não importam)
//    'tubar*'    -> qualquer palavra que COMEÇA assim (tubarão, tubarões)
//    'e se'      -> frases também valem
//  O kw do nicho vale para o nicho todo. O kw de um subnicho só decide
//  em qual subnicho (chip do site) o canal aparece.
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
  // Palavras do nicho todo (animais perigosos, oceano, abismo, predadores, sobrevivência)
  kw: {
    pt: ['animal', 'animais', 'bicho*', 'fera', 'feras', 'predador*', 'tubar*', 'megalodon*', 'orca', 'orcas',
      'baleia*', 'lula gigante', 'polvo*', 'água-viva', 'águas-vivas', 'cobra*', 'serpente*', 'sucuri*', 'jiboia*',
      'crocodilo*', 'jacaré*', 'piranha*', 'leão', 'leões', 'tigre*', 'urso*', 'lobo', 'lobos', 'hipopótamo*',
      'aranha*', 'escorpi*', 'venen*', 'peçonhent*', 'oceano*', 'mar', 'mares', 'fundo do mar', 'abismo*', 'abissa*',
      'profundeza*', 'fossa das marianas', 'submarino*', 'mergulh*', 'criatura*', 'pré-históric*', 'dinossauro*',
      't-rex', 'mosassauro*', 'extint*', 'sobreviveria', 'você sobreviveria', 'quanto tempo você',
      'inseto*', 'roedor*', 'búfalo*', 'javali*', 'elefante*', 'gorila*', 'rinoceronte*', 'onça*', 'pantera*',
      'leopardo*', 'hiena*', 'abelha*', 'vespa*', 'formiga*', 'morcego*', 'komodo', 'extinç*', 'tiranossauro*',
      'pré-história'],
    en: ['animal*', 'beast*', 'predator*', 'shark*', 'megalodon*', 'whale*', 'orca*', 'killer whale*', 'squid*',
      'octopus*', 'jellyfish', 'snake*', 'python*', 'anaconda*', 'cobra*', 'viper*', 'crocodile*', 'croc', 'crocs',
      'alligator*', 'piranha*', 'hippo*', 'lion', 'lions', 'tiger*', 'bear', 'bears', 'grizzly*', 'wolf', 'wolves',
      'spider*', 'scorpion*', 'venom*', 'ocean*', 'sea', 'seas', 'deep sea', 'abyss*', 'trench', 'mariana*',
      'underwater', 'submarine*', 'creature*', 'prehistoric', 'dinosaur*', 't-rex', 'jurassic', 'mosasaur*',
      'titanoboa', 'extinct', 'would you survive', 'could you survive', 'how long would you',
      'insect*', 'rodent*', 'buffalo*', 'boar', 'boars', 'elephant*', 'gorilla*', 'rhino*', 'jaguar*', 'panther*',
      'leopard*', 'hyena*', 'bee', 'bees', 'hornet*', 'wasp*', 'ant', 'ants', 'komodo', 'extinction*',
      'tyrannosaurus*', 'prehistory'],
    es: ['animal', 'animales', 'bestia*', 'depredador*', 'tiburón', 'tiburones', 'megalodón', 'megalodon*',
      'ballena*', 'orca', 'orcas', 'calamar*', 'pulpo*', 'medusa*', 'serpiente*', 'culebra*', 'cobra*', 'anaconda*',
      'pitón', 'cocodrilo*', 'caimán', 'caimanes', 'piraña*', 'hipopótamo*', 'león', 'leones', 'tigre*', 'oso', 'osos',
      'lobo', 'lobos', 'araña*', 'escorpión', 'escorpiones', 'venen*', 'océano*', 'mar', 'mares', 'abismo*',
      'abisal*', 'profundidad*', 'fosa de las marianas', 'submarin*', 'criatura*', 'prehistóric*', 'dinosaurio*',
      'extint*', 'sobrevivirías', 'cuánto tiempo sobrevivirías',
      'insecto*', 'roedor*', 'búfalo*', 'jabalí*', 'elefante*', 'gorila*', 'rinoceronte*', 'jaguar*', 'pantera*',
      'leopardo*', 'hiena*', 'abeja*', 'avispa*', 'hormiga*', 'murciélago*', 'komodo', 'extinci*', 'tiranosaurio*',
      'prehistoria'],
    de: ['tier', 'tiere', 'tieren', 'raubtier*', 'bestie*', 'hai', 'haie', 'haien', 'haifisch*', 'weißhai*',
      'tigerhai*', 'hammerhai*', 'bullenhai*', 'walhai*', 'megalodon*', 'wal', 'wale', 'walen', 'orca*', 'schwertwal*',
      'krake*', 'tintenfisch*', 'qualle*', 'schlange*', 'anakonda*', 'python*', 'kobra*', 'krokodil*', 'alligator*',
      'piranha*', 'nilpferd*', 'löwe', 'löwen', 'tiger*', 'grizzly*', 'eisbär*', 'braunbär*', 'wolf', 'wölfe',
      'spinne*', 'skorpion*', 'giftig*', 'giftschlange*', 'ozean*', 'meer', 'meere', 'meeres*', 'tiefsee*', 'abgrund*',
      'marianengraben', 'u-boot*', 'kreatur*', 'urzeit*', 'prähistorisch*', 'dinosaurier*', 'ausgestorben*',
      'wie lange würdest du', 'würdest du überleben', 'überlebst du',
      'insekt*', 'nagetier*', 'büffel*', 'wildschwein*', 'elefant*', 'gorilla*', 'nashorn*', 'jaguar*', 'panther*',
      'leopard*', 'hyäne*', 'biene*', 'hornisse*', 'wespe*', 'ameise*', 'fledermaus*', 'komodo*', 'aussterben',
      'tyrannosaurus*', 'urgeschichte'],
    fr: ['animal', 'animaux', 'bête', 'bêtes', 'prédateur*', 'requin*', 'mégalodon', 'megalodon*', 'baleine*',
      'orque*', 'calamar*', 'pieuvre*', 'poulpe*', 'méduse*', 'serpent*', 'cobra*', 'anaconda*', 'python*',
      'crocodile*', 'alligator*', 'piranha*', 'hippopotame*', 'lion', 'lions', 'tigre*', 'ours', 'loup', 'loups',
      'araignée*', 'scorpion*', 'venin*', 'venimeu*', 'océan*', 'mer', 'mers', 'abysse*', 'abyssa*', 'profondeur*',
      'fosse des mariannes', 'sous-marin*', 'créature*', 'préhistorique*', 'dinosaure*', 'éteint*', 'disparu*',
      'survivrais', 'survivriez', 'combien de temps',
      'insecte*', 'rongeur*', 'buffle*', 'sanglier*', 'éléphant*', 'gorille*', 'rhinocéros', 'jaguar*', 'panthère*',
      'léopard*', 'hyène*', 'abeille*', 'frelon*', 'guêpe*', 'fourmi*', 'chauve-souris', 'komodo', 'extinction*',
      'tyrannosaure*', 'tyrannosaurus*', 'préhistoire'],
  },
  subs: [
    { id: 'animais-perigosos', name: 'Animais perigosos', q: {
      pt: 'animais mais perigosos', en: 'most dangerous animals', es: 'animales más peligrosos',
      de: 'gefährlichste Tiere', fr: 'animaux les plus dangereux' },
      kw: {
        pt: ['animais', 'animal', 'perigos*', 'mortal', 'mortais', 'letal', 'letais', 'predador*', 'venen*', 'cobra*',
          'crocodilo*', 'leão', 'leões', 'tigre*', 'urso*', 'hipopótamo*', 'aranha*', 'escorpi*'],
        en: ['animal*', 'dangerous', 'deadl*', 'lethal', 'predator*', 'venom*', 'snake*', 'crocodile*', 'lion', 'lions',
          'tiger*', 'bear', 'bears', 'hippo*', 'spider*', 'scorpion*'],
        es: ['animales', 'animal', 'peligros*', 'mortal*', 'letal*', 'depredador*', 'venen*', 'serpiente*',
          'cocodrilo*', 'león', 'leones', 'tigre*', 'oso', 'osos', 'hipopótamo*', 'araña*', 'escorpi*'],
        de: ['tier', 'tiere', 'tieren', 'gefährlich*', 'tödlich*', 'raubtier*', 'giftig*', 'schlange*', 'krokodil*',
          'löwe', 'löwen', 'tiger*', 'nilpferd*', 'spinne*', 'skorpion*'],
        fr: ['animaux', 'animal', 'dangereu*', 'mortel*', 'prédateur*', 'venimeu*', 'serpent*', 'crocodile*', 'lion',
          'lions', 'tigre*', 'ours', 'hippopotame*', 'araignée*', 'scorpion*'],
      } },
    { id: 'quanto-tempo-sobreviveria', name: 'Quanto tempo você sobreviveria', q: {
      pt: 'quanto tempo você sobreviveria', en: 'how long would you survive', es: 'cuánto tiempo sobrevivirías',
      de: 'wie lange würdest du überleben', fr: 'combien de temps survivrais-tu' },
      kw: {
        pt: ['sobreviv*', 'quanto tempo'], en: ['surviv*', 'how long'], es: ['sobreviv*', 'cuánto tiempo'],
        de: ['überleb*', 'wie lange'], fr: ['surviv*', 'combien de temps'],
      } },
    { id: 'oceano-profundo', name: 'Oceano profundo / abismo', q: {
      pt: 'fundo do oceano criaturas', en: 'deep ocean creatures', es: 'criaturas del fondo del océano',
      de: 'Tiefsee Kreaturen', fr: 'créatures des abysses' },
      kw: {
        pt: ['oceano*', 'mar', 'mares', 'fundo do mar', 'abismo*', 'abissa*', 'profund*', 'fossa*', 'marianas',
          'submarino*', 'mergulh*', 'tubar*', 'baleia*', 'lula*', 'polvo*', 'água-viva', 'criatura*'],
        en: ['ocean*', 'sea', 'seas', 'deep', 'abyss*', 'trench', 'mariana*', 'underwater', 'submarine*', 'dive',
          'diving', 'shark*', 'whale*', 'squid*', 'octopus*', 'jellyfish', 'creature*'],
        es: ['océano*', 'mar', 'mares', 'abismo*', 'abisal*', 'profund*', 'fosa*', 'marianas', 'submarin*', 'buce*',
          'tiburón', 'tiburones', 'ballena*', 'calamar*', 'pulpo*', 'medusa*', 'criatura*'],
        de: ['ozean*', 'meer', 'meere', 'meeres*', 'tiefsee*', 'abgrund*', 'marianengraben', 'u-boot*', 'tauch*',
          'hai', 'haie', 'wal', 'wale', 'krake*', 'qualle*', 'kreatur*'],
        fr: ['océan*', 'mer', 'mers', 'abysse*', 'abyssa*', 'profond*', 'fosse*', 'mariannes', 'sous-marin*',
          'plongée*', 'requin*', 'baleine*', 'calamar*', 'pieuvre*', 'méduse*', 'créature*'],
      } },
    { id: 'predadores-pre-historicos', name: 'Predadores pré-históricos', q: {
      pt: 'predadores pré-históricos', en: 'prehistoric predators', es: 'depredadores prehistóricos',
      de: 'Urzeit Raubtiere', fr: 'prédateurs préhistoriques' },
      kw: {
        pt: ['pré-históric*', 'pré-história', 'dinossauro*', 't-rex', 'tiranossauro*', 'megalodon*', 'mosassauro*',
          'extint*', 'extinç*', 'jurássic*'],
        en: ['prehistoric', 'prehistory', 'dinosaur*', 't-rex', 'tyrannosaurus*', 'megalodon*', 'mosasaur*', 'titanoboa',
          'extinct', 'extinction*', 'jurassic'],
        es: ['prehistóric*', 'prehistoria', 'dinosaurio*', 't-rex', 'tiranosaurio*', 'megalodón', 'megalodon*',
          'mosasaurio*', 'extint*', 'extinci*', 'jurásic*'],
        de: ['urzeit*', 'urgeschichte', 'prähistorisch*', 'dinosaurier*', 't-rex', 'tyrannosaurus*', 'megalodon*',
          'mosasaurus', 'ausgestorben*', 'aussterben'],
        fr: ['préhistorique*', 'préhistoire', 'dinosaure*', 't-rex', 'tyrannosaure*', 'tyrannosaurus*', 'mégalodon',
          'megalodon*', 'mosasaure*', 'éteint*', 'extinction*', 'jurassique'],
      } },
    { id: 'e-se-animal', name: 'E se você encontrasse…', q: {
      pt: 'e se você encontrasse um tubarão', en: 'what if you met a shark', es: 'qué pasaría si te encontraras un tiburón',
      de: 'was wäre wenn du einem Hai begegnest', fr: 'et si vous croisiez un requin' },
      kw: {
        pt: ['e se', 'encontrasse', 'encontrar um'], en: ['what if', 'met a', 'encounter*'],
        es: ['qué pasaría', 'y si', 'encontraras'], de: ['was wäre wenn', 'begegn*'],
        fr: ['et si', 'croisiez', 'rencontriez'],
      } },
    { id: 'tubaroes', name: 'Tubarões', q: {
      pt: 'tubarões mais perigosos', en: 'most dangerous sharks', es: 'tiburones más peligrosos',
      de: 'gefährlichste Haie', fr: 'requins les plus dangereux' },
      kw: {
        pt: ['tubar*', 'megalodon*'], en: ['shark*', 'megalodon*'], es: ['tiburón', 'tiburones', 'megalodón', 'megalodon*'],
        de: ['hai', 'haie', 'haien', 'haifisch*', 'weißhai*', 'tigerhai*', 'hammerhai*', 'bullenhai*', 'walhai*', 'megalodon*'],
        fr: ['requin*', 'mégalodon', 'megalodon*'],
      } },
    { id: 'cobras-repteis', name: 'Cobras e répteis', q: {
      pt: 'cobras mais venenosas', en: 'most venomous snakes', es: 'serpientes más venenosas',
      de: 'giftigste Schlangen', fr: 'serpents les plus venimeux' },
      kw: {
        pt: ['cobra*', 'serpente*', 'sucuri*', 'jiboia*', 'víbora*', 'réptil', 'répteis', 'lagarto*', 'komodo'],
        en: ['snake*', 'serpent*', 'python*', 'anaconda*', 'cobra*', 'viper*', 'mamba*', 'reptile*', 'lizard*', 'komodo'],
        es: ['serpiente*', 'culebra*', 'víbora*', 'anaconda*', 'pitón', 'cobra*', 'reptil', 'reptiles', 'lagarto*', 'komodo'],
        de: ['schlange*', 'giftschlange*', 'python*', 'anakonda*', 'kobra*', 'viper*', 'reptil*', 'echse*', 'komodo*'],
        fr: ['serpent*', 'python*', 'anaconda*', 'cobra*', 'vipère*', 'mamba*', 'reptile*', 'lézard*', 'komodo'],
      } },
    { id: 'crocodilos', name: 'Crocodilos e jacarés', q: {
      pt: 'ataque de crocodilo', en: 'crocodile attack', es: 'ataque de cocodrilo',
      de: 'Krokodil Angriff', fr: 'attaque de crocodile' },
      kw: {
        pt: ['crocodilo*', 'jacaré*', 'aligátor*'], en: ['crocodile*', 'croc', 'crocs', 'alligator*', 'caiman*'],
        es: ['cocodrilo*', 'caimán', 'caimanes', 'aligátor*', 'yacaré*'], de: ['krokodil*', 'alligator*', 'kaiman*'],
        fr: ['crocodile*', 'alligator*', 'caïman*'],
      } },
    { id: 'orcas-baleias', name: 'Orcas e baleias', q: {
      pt: 'orcas e baleias', en: 'orcas and whales', es: 'orcas y ballenas',
      de: 'Orcas und Wale', fr: 'orques et baleines' },
      kw: {
        pt: ['orca', 'orcas', 'baleia*', 'cachalote*'], en: ['orca*', 'killer whale*', 'whale*', 'sperm whale*'],
        es: ['orca', 'orcas', 'ballena*', 'cachalote*'], de: ['orca*', 'schwertwal*', 'wal', 'wale', 'walen', 'pottwal*', 'blauwal*'],
        fr: ['orque*', 'épaulard*', 'baleine*', 'cachalot*'],
      } },
    { id: 'insetos-aranhas', name: 'Insetos e aranhas perigosos', q: {
      pt: 'insetos e aranhas mais perigosos', en: 'most dangerous insects and spiders', es: 'insectos y arañas más peligrosos',
      de: 'gefährlichste Insekten und Spinnen', fr: 'insectes et araignées les plus dangereux' },
      kw: {
        pt: ['inseto*', 'aranha*', 'escorpi*', 'abelha*', 'vespa*', 'formiga*', 'mosquito*', 'centopeia*'],
        en: ['insect*', 'spider*', 'scorpion*', 'bee', 'bees', 'hornet*', 'wasp*', 'ant', 'ants', 'mosquito*', 'centipede*'],
        es: ['insecto*', 'araña*', 'escorpión', 'escorpiones', 'abeja*', 'avispa*', 'hormiga*', 'mosquito*', 'ciempiés'],
        de: ['insekt*', 'spinne*', 'skorpion*', 'biene*', 'hornisse*', 'wespe*', 'ameise*', 'mücke*', 'tausendfüßer*'],
        fr: ['insecte*', 'araignée*', 'scorpion*', 'abeille*', 'frelon*', 'guêpe*', 'fourmi*', 'moustique*', 'mille-pattes'],
      } },
    { id: 'criaturas-abismo', name: 'Criaturas do abismo', q: {
      pt: 'monstros do fundo do mar', en: 'deep sea monsters', es: 'monstruos de las profundidades',
      de: 'Monster der Tiefsee', fr: 'monstres des abysses' },
      kw: {
        pt: ['abismo*', 'abissa*', 'profundeza*', 'fundo do mar', 'fossa*', 'criatura*', 'lula gigante', 'monstro* marinho*'],
        en: ['abyss*', 'deep sea', 'trench', 'creature*', 'giant squid', 'sea monster*', 'anglerfish'],
        es: ['abismo*', 'abisal*', 'profundidades', 'fosa*', 'criatura*', 'calamar gigante', 'monstruo* marino*'],
        de: ['tiefsee*', 'abgrund*', 'graben', 'kreatur*', 'riesenkalmar*', 'seemonster*', 'anglerfisch*'],
        fr: ['abysse*', 'abyssa*', 'profondeurs', 'fosse*', 'créature*', 'calmar géant', 'monstre* marin*', 'baudroie*'],
      } },
  ],
};

// ---------------------------------------------------------------------
//  TODOS OS OUTROS NICHOS: entram em rodízio (alguns por dia)
//  Aqui a conferência é "leve": só palavras do nicho (kw), sem subnicho.
// ---------------------------------------------------------------------
export const NICHES = [
  { id: 'e-se', name: 'Curiosidades & "E se"', emoji: '🤔',
    kw: {
      pt: ['e se', 'se você', 'superpoder*', 'poder de', 'viagem no tempo', 'voltasse no tempo', 'curiosidade*', 'comparação', 'tamanho'],
      en: ['what if', 'if you', 'superpower*', 'power to', 'time travel*', 'back in time', 'size comparison', 'comparison'],
      es: ['y si', 'qué pasaría', 'si tú', 'superpoder*', 'poder de', 'viaje en el tiempo', 'al pasado', 'curiosidad*', 'comparación', 'tamaño'],
      de: ['was wäre wenn', 'was passiert wenn', 'wenn du', 'superkraft*', 'superkräfte', 'zeitreise*', 'vergangenheit', 'größenvergleich', 'vergleich'],
      fr: ['et si', 'si tu', 'si vous', 'super-pouvoir*', 'superpouvoir*', 'pouvoir de', 'voyage dans le temps', 'remontais le temps', 'comparaison'],
    },
    subs: [
    { id: 'hipoteses', name: 'E se você…', q: {
      pt: 'e se você', en: 'what if you', es: 'qué pasaría si', de: 'was wäre wenn du', fr: 'et si vous' } },
    { id: 'superpoderes', name: 'Superpoderes / habilidades', q: {
      pt: 'e se você tivesse o poder de', en: 'what if you had the power to', es: 'y si tuvieras el poder de',
      de: 'was wäre wenn du die Kraft hättest', fr: 'et si tu avais le pouvoir de' } },
    { id: 'viagem-tempo', name: 'Viagem no tempo', q: {
      pt: 'e se você voltasse no tempo', en: 'what if you went back in time', es: 'y si volvieras al pasado',
      de: 'was wäre wenn du in die Vergangenheit reist', fr: 'et si tu remontais le temps' } },
    { id: 'e-se-terra', name: 'E se a Terra…', q: {
      pt: 'e se a terra parasse de girar', en: 'what if the earth stopped spinning', es: 'qué pasaría si la tierra dejara de girar',
      de: 'was wäre wenn die Erde aufhört sich zu drehen', fr: 'et si la terre arrêtait de tourner' } },
    { id: 'comparacoes', name: 'Comparações de tamanho', q: {
      pt: 'comparação de tamanho', en: 'size comparison', es: 'comparación de tamaño', de: 'Größenvergleich', fr: 'comparaison de taille' } },
  ]},
  { id: 'ciencia', name: 'Ciência & Espaço', emoji: '🔭',
    kw: {
      pt: ['universo*', 'espaço', 'planeta*', 'galáxia*', 'estrela*', 'buraco negro', 'sol', 'lua', 'marte', 'terra',
        'corpo', 'cérebro*', 'física*', 'quântic*', 'ciência*', 'científic*', 'átomo*', 'luz', 'gravidade', 'asteroide*'],
      en: ['universe*', 'space', 'planet*', 'galax*', 'star', 'stars', 'black hole*', 'sun', 'moon', 'mars', 'earth',
        'body', 'brain*', 'physics', 'quantum', 'science*', 'scientist*', 'scientific', 'atom*', 'light', 'gravity', 'asteroid*', 'nasa'],
      es: ['universo*', 'espacio', 'planeta*', 'galaxia*', 'estrella*', 'agujero negro', 'sol', 'luna', 'marte', 'tierra',
        'cuerpo', 'cerebro*', 'física*', 'cuántic*', 'ciencia*', 'científic*', 'átomo*', 'luz', 'gravedad', 'asteroide*'],
      de: ['universum*', 'weltall', 'weltraum*', 'planet*', 'galaxie*', 'stern*', 'schwarzes loch', 'sonne', 'mond',
        'mars', 'erde', 'körper*', 'gehirn*', 'physik*', 'quanten*', 'wissenschaft*', 'atom*', 'licht', 'schwerkraft', 'asteroid*'],
      fr: ['univers', 'espace', 'planète*', 'galaxie*', 'étoile*', 'trou noir', 'soleil', 'lune', 'mars', 'terre',
        'corps', 'cerveau*', 'physique*', 'quantique*', 'science*', 'scientifique*', 'atome*', 'lumière', 'gravité', 'astéroïde*'],
    },
    subs: [
    { id: 'espaco', name: 'Espaço e universo', q: {
      pt: 'universo explicado', en: 'universe explained', es: 'el universo explicado', de: 'das Universum erklärt', fr: "l'univers expliqué" } },
    { id: 'corpo-humano', name: 'Corpo humano', q: {
      pt: 'o que acontece com seu corpo', en: 'what happens to your body', es: 'qué le pasa a tu cuerpo',
      de: 'was passiert mit deinem Körper', fr: 'ce qui arrive à ton corps' } },
    { id: 'fisica', name: 'Física e fenômenos', q: {
      pt: 'física explicada', en: 'physics explained', es: 'física explicada', de: 'Physik erklärt', fr: 'la physique expliquée' } },
    { id: 'planeta-terra', name: 'Planeta Terra', q: {
      pt: 'como a terra se formou', en: 'how earth formed', es: 'cómo se formó la tierra',
      de: 'wie die Erde entstand', fr: "comment la terre s'est formée" } },
    { id: 'misterios-ciencia', name: 'Mistérios da ciência', q: {
      pt: 'mistérios da ciência', en: 'unexplained science mysteries', es: 'misterios de la ciencia',
      de: 'ungelöste Rätsel der Wissenschaft', fr: 'mystères de la science' } },
  ]},
  { id: 'natureza', name: 'Natureza & Animais', emoji: '🦁',
    kw: {
      pt: ['natureza', 'vida selvagem', 'selvage*', 'animal', 'animais', 'bicho*', 'floresta*', 'selva*', 'dinossauro*',
        'inseto*', 'pássaro*', 'ave', 'aves', 'leão', 'leões', 'tigre*', 'tubar*', 'cobra*', 'urso*', 'lobo*', 'raro', 'raros', 'rara', 'raras'],
      en: ['nature', 'wildlife', 'wild', 'animal*', 'forest*', 'jungle*', 'dinosaur*', 'insect*', 'bug', 'bugs', 'bird*',
        'lion', 'lions', 'tiger*', 'shark*', 'snake*', 'bear', 'bears', 'wolf', 'wolves', 'rare', 'rarest'],
      es: ['naturaleza', 'vida salvaje', 'salvaje*', 'animal', 'animales', 'bosque*', 'selva*', 'dinosaurio*',
        'insecto*', 'bicho*', 'pájaro*', 'ave', 'aves', 'león', 'leones', 'tigre*', 'tiburón', 'tiburones', 'serpiente*', 'oso', 'osos', 'lobo*'],
      de: ['natur', 'wildnis', 'wild*', 'tier', 'tiere', 'tieren', 'tierdoku*', 'wald*', 'dschungel*', 'dinosaurier*',
        'insekt*', 'vogel', 'vögel', 'löwe', 'löwen', 'tiger*', 'hai', 'haie', 'schlange*', 'wolf', 'wölfe'],
      fr: ['nature', 'sauvage*', 'animal', 'animaux', 'animalier*', 'forêt*', 'jungle*', 'dinosaure*', 'insecte*',
        'oiseau*', 'lion', 'lions', 'tigre*', 'requin*', 'serpent*', 'ours', 'loup', 'loups'],
    },
    subs: [
    { id: 'vida-selvagem', name: 'Vida selvagem', q: {
      pt: 'documentário vida selvagem', en: 'wildlife documentary', es: 'documental vida salvaje', de: 'Tierdokumentation', fr: 'documentaire animalier' } },
    { id: 'dinossauros', name: 'Dinossauros', q: {
      pt: 'dinossauros documentário', en: 'dinosaurs documentary', es: 'dinosaurios documental', de: 'Dinosaurier Doku', fr: 'dinosaures documentaire' } },
    { id: 'insetos', name: 'Insetos e bichos estranhos', q: {
      pt: 'insetos mais estranhos', en: 'weirdest insects', es: 'insectos más extraños', de: 'seltsamste Insekten', fr: 'insectes les plus étranges' } },
    { id: 'aves', name: 'Aves', q: {
      pt: 'aves mais incríveis', en: 'most amazing birds', es: 'aves más increíbles', de: 'erstaunlichste Vögel', fr: 'oiseaux les plus incroyables' } },
    { id: 'animais-raros', name: 'Animais raros', q: {
      pt: 'animais mais raros do mundo', en: 'rarest animals in the world', es: 'animales más raros del mundo',
      de: 'seltenste Tiere der Welt', fr: 'animaux les plus rares du monde' } },
  ]},
  { id: 'historia', name: 'História', emoji: '🏛️',
    kw: {
      pt: ['história*', 'históric*', 'antig*', 'medieval*', 'idade média', 'guerra*', 'império*', 'roma*', 'egito',
        'faraó*', 'rei', 'reis', 'rainha*', 'nazista*', 'hitler', 'napoleão', 'viking*', 'civilizaç*', 'batalha*', 'soldado*', 'século*'],
      en: ['history', 'historical', 'ancient', 'medieval', 'middle ages', 'war', 'wars', 'ww2', 'wwii', 'empire*', 'rome',
        'roman*', 'egypt*', 'pharaoh*', 'king*', 'queen*', 'nazi*', 'hitler', 'napoleon*', 'viking*', 'civilization*', 'battle*', 'soldier*', 'century'],
      es: ['historia*', 'históric*', 'antigu*', 'medieval*', 'edad media', 'guerra*', 'imperio*', 'roma*', 'egipto',
        'faraón*', 'rey', 'reyes', 'reina*', 'nazi*', 'hitler', 'napoleón', 'vikingo*', 'civilizaci*', 'batalla*', 'soldado*', 'siglo*'],
      de: ['geschichte*', 'historisch*', 'antik*', 'mittelalter*', 'krieg*', 'weltkrieg*', 'reich*', 'imperium*',
        'römisch*', 'rom', 'ägypt*', 'pharao*', 'könig*', 'nazi*', 'hitler', 'napoleon*', 'wikinger*', 'zivilisation*', 'schlacht*', 'soldat*', 'jahrhundert*'],
      fr: ['histoire*', 'historique*', 'antique*', 'antiquité', 'médiéva*', 'moyen âge', 'guerre*', 'empire*', 'rome',
        'romain*', 'égypte*', 'pharaon*', 'roi', 'rois', 'reine*', 'nazi*', 'hitler', 'napoléon', 'viking*', 'civilisation*', 'bataille*', 'soldat*', 'siècle*'],
    },
    subs: [
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
    { id: 'civilizacoes-perdidas', name: 'Civilizações perdidas', q: {
      pt: 'civilizações perdidas', en: 'lost civilizations', es: 'civilizaciones perdidas',
      de: 'verlorene Zivilisationen', fr: 'civilisations perdues' } },
  ]},
  { id: 'misterio', name: 'Mistério & Terror', emoji: '🕯️',
    kw: {
      pt: ['paranormal', 'paranormais', 'crime*', 'assassin*', 'serial', 'caso', 'casos', 'desaparec*', 'mistério*', 'misterios*', 'terror',
        'horror', 'assustador*', 'medo', 'fantasma*', 'assombrad*', 'macabr*', 'regras', 'não resolvido*', 'polícia'],
      en: ['paranormal', 'crime*', 'criminal*', 'murder*', 'killer*', 'serial', 'case', 'cases', 'disappear*', 'missing', 'myster*',
        'horror', 'scary', 'creepy', 'terrifying', 'ghost*', 'haunted', 'rules', 'analog', 'unsolved', 'police'],
      es: ['paranormal', 'paranormales', 'crimen*', 'crímenes', 'asesin*', 'serial', 'caso', 'casos', 'desaparec*', 'misterio*', 'misterios*',
        'terror', 'horror', 'miedo', 'escalofriante*', 'fantasma*', 'embrujad*', 'reglas', 'sin resolver', 'policía'],
      de: ['paranormal*', 'verbrechen*', 'mord*', 'mörder*', 'serienmörder*', 'fall', 'fälle', 'verschwund*', 'vermisst*', 'mysteriös*',
        'rätsel*', 'horror*', 'gruselig*', 'grusel*', 'geist', 'geister*', 'spuk*', 'regeln', 'ungelöst*', 'polizei'],
      fr: ['paranormal*', 'crime*', 'criminel*', 'meurtre*', 'tueur*', 'affaire*', 'disparu*', 'disparition*', 'mystère*', 'mystérieu*',
        'horreur', 'effrayant*', 'flippant*', 'fantôme*', 'hanté*', 'règles', 'non résolu*', 'police'],
    },
    subs: [
    { id: 'true-crime', name: 'True crime', q: {
      pt: 'caso real crime', en: 'true crime case', es: 'caso real crimen', de: 'True Crime Fall', fr: 'affaire criminelle' } },
    { id: 'terror', name: 'Histórias de terror', q: {
      pt: 'histórias de terror', en: 'scary stories', es: 'historias de terror', de: 'Horrorgeschichten', fr: "histoires d'horreur" } },
    { id: 'nao-resolvidos', name: 'Casos não resolvidos', q: {
      pt: 'casos não resolvidos', en: 'unsolved mysteries', es: 'casos sin resolver', de: 'ungelöste Fälle', fr: 'affaires non résolues' } },
    { id: 'regras-sobrevivencia', name: 'Regras de terror / analog horror', q: {
      pt: 'regras para sobreviver terror', en: 'analog horror rules', es: 'reglas para sobrevivir terror',
      de: 'Regeln zum Überleben Horror', fr: 'règles pour survivre horreur' } },
    { id: 'paranormal', name: 'Paranormal', q: {
      pt: 'casos paranormais', en: 'paranormal cases', es: 'casos paranormales', de: 'paranormale Fälle', fr: 'cas paranormaux' } },
  ]},
  { id: 'animacao', name: 'Animação & Histórias', emoji: '🎞️',
    kw: {
      pt: ['animad*', 'animação', 'desenho*', 'história', 'histórias', 'minha vida', 'dia 1', '100 dias', 'sobreviv*', 'zumbi*', 'apocalipse*', 'stickman'],
      en: ['animated', 'animation*', 'cartoon*', 'story', 'stories', 'my life', 'day 1', '100 days', 'surviv*', 'zombie*', 'apocalyp*', 'stickman'],
      es: ['animad*', 'animación', 'dibujo*', 'historia', 'historias', 'mi vida', 'día 1', '100 días', 'sobreviv*', 'zombi*', 'apocalipsis', 'stickman'],
      de: ['animiert*', 'animation*', 'zeichentrick*', 'geschichte*', 'mein leben', 'tag 1', '100 tage', 'überleb*', 'zombie*', 'apokalyp*', 'strichmännchen', 'stickman'],
      fr: ['animé*', 'animation*', 'dessin animé', 'histoire*', 'ma vie', 'jour 1', '100 jours', 'surviv*', 'zombie*', 'apocalyps*', 'bonhomme*', 'stickman'],
    },
    subs: [
    { id: 'historias-animadas', name: 'Histórias animadas (drama)', q: {
      pt: 'história animada', en: 'animated story', es: 'historia animada', de: 'animierte Geschichte', fr: 'histoire animée' } },
    { id: 'sobrevivencia-dias', name: 'Sobrevivência dia 1 a 100', q: {
      pt: 'sobrevivendo 100 dias', en: 'surviving 100 days', es: 'sobreviviendo 100 días', de: '100 Tage überleben', fr: 'survivre 100 jours' } },
    { id: 'zumbi', name: 'Apocalipse zumbi', q: {
      pt: 'apocalipse zumbi história', en: 'zombie apocalypse story', es: 'apocalipsis zombi historia',
      de: 'Zombie Apokalypse Geschichte', fr: 'apocalypse zombie histoire' } },
    { id: 'minha-historia', name: 'Minha história (animada)', q: {
      pt: 'minha história animada', en: 'my story animated', es: 'mi historia animada',
      de: 'meine Geschichte animiert', fr: 'mon histoire animée' } },
    { id: 'stickman', name: 'Stickman', q: {
      pt: 'animação stickman', en: 'stickman animation', es: 'animación stickman',
      de: 'Strichmännchen Animation', fr: 'animation bonhomme bâton' } },
  ]},
  { id: 'financas', name: 'Finanças & Negócios', emoji: '💰',
    kw: {
      pt: ['dinheiro', 'rico*', 'milionári*', 'bilionári*', 'investi*', 'ações', 'bolsa', 'renda', 'negócio*', 'empresa*',
        'marca*', 'falência', 'economia*', 'ganhar', 'dólar*', 'reais', 'cripto*', 'bitcoin*', 'ascensão', 'queda', 'milhões', 'bilhões'],
      en: ['money', 'rich', 'richest', 'millionaire*', 'billionaire*', 'invest*', 'stock*', 'income', 'business*',
        'company', 'companies', 'brand*', 'bankrupt*', 'econom*', 'earn*', 'dollar*', 'crypto*', 'bitcoin*', 'rise', 'fall', 'million*', 'billion*'],
      es: ['dinero', 'rico*', 'millonari*', 'invert*', 'inversi*', 'acciones', 'bolsa', 'ingreso*', 'negocio*', 'empresa*',
        'marca*', 'quiebra', 'econom*', 'ganar', 'dólar*', 'cripto*', 'bitcoin*', 'ascenso', 'caída', 'millones'],
      de: ['geld', 'reich', 'reichste*', 'millionär*', 'milliardär*', 'invest*', 'aktie*', 'börse', 'einkommen',
        'unternehmen*', 'firma', 'marke*', 'pleite*', 'insolvenz*', 'wirtschaft*', 'verdienen', 'dollar*', 'krypto*', 'bitcoin*', 'aufstieg*', 'millionen', 'milliarden'],
      fr: ['argent', 'riche*', 'millionnaire*', 'milliardaire*', 'investi*', 'bourse', 'revenu*', 'entreprise*', 'marque*',
        'faillite', 'économi*', 'gagner', 'dollar*', 'crypto*', 'bitcoin*', 'ascension', 'chute', 'millions', 'milliards'],
    },
    subs: [
    { id: 'financas-pessoais', name: 'Finanças pessoais', q: {
      pt: 'como ficar rico', en: 'how to get rich', es: 'cómo hacerse rico', de: 'wie man reich wird', fr: 'comment devenir riche' } },
    { id: 'historia-empresas', name: 'História de empresas', q: {
      pt: 'a história da empresa', en: 'the rise and fall of', es: 'el ascenso y caída de', de: 'Aufstieg und Fall von', fr: "l'ascension et la chute de" } },
    { id: 'renda-online', name: 'Renda online', q: {
      pt: 'ganhar dinheiro na internet', en: 'make money online', es: 'ganar dinero por internet', de: 'online Geld verdienen', fr: 'gagner de l argent en ligne' } },
    { id: 'economia', name: 'Economia explicada', q: {
      pt: 'economia explicada', en: 'economy explained', es: 'economía explicada', de: 'Wirtschaft erklärt', fr: 'économie expliquée' } },
    { id: 'bilionarios', name: 'Bilionários', q: {
      pt: 'como ele ficou bilionário', en: 'how he became a billionaire', es: 'cómo se hizo multimillonario',
      de: 'wie er Milliardär wurde', fr: 'comment il est devenu milliardaire' } },
  ]},
  { id: 'tecnologia', name: 'Tecnologia & IA', emoji: '🤖',
    kw: {
      pt: ['ia', 'inteligência artificial', 'chatgpt', 'robô*', 'tecnologia*', 'futuro', 'computador*', 'internet', 'celular*', 'digital*', 'hacker*', 'invenç*', 'inventor*'],
      en: ['ai', 'artificial intelligence', 'chatgpt', 'gpt*', 'openai', 'robot*', 'tech', 'technolog*', 'future', 'computer*', 'internet', 'smartphone*', 'iphone*', 'digital', 'hacker*', 'cyber*', 'invention*', 'inventor*'],
      es: ['ia', 'inteligencia artificial', 'chatgpt', 'robot*', 'tecnología*', 'futuro', 'computador*', 'ordenador*', 'internet', 'celular*', 'digital*', 'hacker*', 'invento*'],
      de: ['ki', 'künstliche intelligenz', 'chatgpt', 'roboter*', 'technik*', 'technologie*', 'zukunft', 'computer*', 'internet', 'handy*', 'smartphone*', 'digital*', 'hacker*', 'erfindung*', 'erfinder*'],
      fr: ['ia', 'intelligence artificielle', 'chatgpt', 'robot*', 'technologie*', 'futur', 'avenir', 'ordinateur*', 'internet', 'smartphone*', 'numérique*', 'hacker*', 'invention*', 'inventeur*'],
    },
    subs: [
    { id: 'ia', name: 'Inteligência artificial', q: {
      pt: 'inteligência artificial', en: 'artificial intelligence explained', es: 'inteligencia artificial', de: 'künstliche Intelligenz', fr: 'intelligence artificielle' } },
    { id: 'futuro', name: 'Futuro e tecnologia', q: {
      pt: 'como será o mundo em 2050', en: 'what the world will look like in 2050', es: 'cómo será el mundo en 2050',
      de: 'wie die Welt 2050 aussieht', fr: 'à quoi ressemblera le monde en 2050' } },
    { id: 'invencoes', name: 'Invenções incríveis', q: {
      pt: 'invenções incríveis', en: 'incredible inventions', es: 'inventos increíbles',
      de: 'unglaubliche Erfindungen', fr: 'inventions incroyables' } },
    { id: 'hackers', name: 'Hackers e internet', q: {
      pt: 'hackers mais perigosos', en: 'most dangerous hackers', es: 'hackers más peligrosos',
      de: 'gefährlichste Hacker', fr: 'hackers les plus dangereux' } },
    { id: 'robos', name: 'Robôs', q: {
      pt: 'robôs mais avançados', en: 'most advanced robots', es: 'robots más avanzados',
      de: 'fortschrittlichste Roboter', fr: 'robots les plus avancés' } },
  ]},
  { id: 'geografia', name: 'Geografia & Países', emoji: '🗺️',
    kw: {
      pt: ['país', 'países', 'mapa*', 'geografi*', 'geopolític*', 'fronteira*', 'cidade*', 'ilha*', 'montanha*', 'deserto*', 'lugar*', 'mundo', 'continente*', 'nação', 'nações'],
      en: ['country', 'countries', 'map', 'maps', 'geograph*', 'geopolitic*', 'border*', 'city', 'cities', 'island*', 'mountain*', 'desert*', 'place*', 'world', 'continent*', 'nation*'],
      es: ['país', 'países', 'mapa*', 'geografía*', 'geopolític*', 'frontera*', 'ciudad*', 'isla*', 'montaña*', 'desierto*', 'lugar*', 'mundo', 'continente*', 'nación', 'naciones'],
      de: ['land', 'länder', 'karte*', 'geografie', 'geographie', 'geopolitik*', 'grenze*', 'stadt', 'städte', 'insel*', 'berg', 'berge', 'wüste*', 'ort', 'orte', 'welt', 'kontinent*'],
      fr: ['pays', 'carte*', 'géographi*', 'géopolitique*', 'frontière*', 'ville*', 'île', 'îles', 'montagne*', 'désert*', 'endroit*', 'lieu*', 'monde', 'continent*', 'nation*'],
    },
    subs: [
    { id: 'geopolitica', name: 'Mapas e geopolítica', q: {
      pt: 'geopolítica explicada', en: 'geopolitics explained', es: 'geopolítica explicada', de: 'Geopolitik erklärt', fr: 'géopolitique expliquée' } },
    { id: 'paises', name: 'Países explicados', q: {
      pt: 'por que este país', en: 'why this country', es: 'por qué este país', de: 'warum dieses Land', fr: 'pourquoi ce pays' } },
    { id: 'lugares-extremos', name: 'Lugares extremos', q: {
      pt: 'lugares mais perigosos do mundo', en: 'most dangerous places on earth', es: 'lugares más peligrosos del mundo',
      de: 'gefährlichste Orte der Welt', fr: 'endroits les plus dangereux du monde' } },
    { id: 'cidades', name: 'Cidades estranhas', q: {
      pt: 'cidades mais estranhas do mundo', en: 'strangest cities in the world', es: 'ciudades más extrañas del mundo',
      de: 'seltsamste Städte der Welt', fr: 'villes les plus étranges du monde' } },
    { id: 'fronteiras', name: 'Fronteiras', q: {
      pt: 'fronteiras mais estranhas', en: 'weirdest borders', es: 'fronteras más extrañas',
      de: 'seltsamste Grenzen', fr: 'frontières les plus étranges' } },
  ]},
  { id: 'cultura-pop', name: 'Games & Cultura pop', emoji: '🎮',
    kw: {
      pt: ['jogo*', 'game*', 'minecraft', 'fortnite', 'roblox', 'gta', 'pokémon*', 'lore', 'filme*', 'série*', 'anime*',
        'marvel', 'disney', 'vilão', 'vilões', 'personage*', 'explicad*', 'chances de sobreviver', 'batman', 'godzilla', 'teoria*'],
      en: ['game*', 'gaming', 'minecraft', 'fortnite', 'roblox', 'gta', 'pokemon*', 'lore', 'movie*', 'film*', 'series',
        'anime*', 'marvel', 'disney', 'villain*', 'character*', 'explained', 'chances of surviving', 'batman', 'godzilla', 'theory', 'theories'],
      es: ['juego*', 'videojuego*', 'minecraft', 'fortnite', 'roblox', 'gta', 'pokémon*', 'lore', 'película*', 'serie*',
        'anime*', 'marvel', 'disney', 'villano*', 'personaje*', 'explicad*', 'probabilidades de sobrevivir', 'batman', 'godzilla'],
      de: ['spiel*', 'game*', 'minecraft', 'fortnite', 'roblox', 'gta', 'pokémon*', 'lore', 'film*', 'serie*', 'anime*',
        'marvel', 'disney', 'bösewicht*', 'charakter*', 'erklärt', 'überlebenschance*', 'batman', 'godzilla'],
      fr: ['jeu', 'jeux', 'jeu vidéo', 'minecraft', 'fortnite', 'roblox', 'gta', 'pokémon*', 'lore', 'film*', 'série*',
        'anime*', 'marvel', 'disney', 'méchant*', 'personnage*', 'expliqué*', 'chances de survie', 'batman', 'godzilla'],
    },
    subs: [
    { id: 'lore-games', name: 'Lore de games', q: {
      pt: 'história completa do jogo', en: 'full lore explained', es: 'historia completa del juego', de: 'Lore erklärt', fr: 'lore expliqué' } },
    { id: 'filmes', name: 'Filmes e séries explicados', q: {
      pt: 'filme explicado', en: 'movie explained', es: 'película explicada', de: 'Film erklärt', fr: 'film expliqué' } },
    { id: 'vilões', name: 'Vilões e personagens', q: {
      pt: 'suas chances de sobreviver', en: 'your chances of surviving', es: 'tus probabilidades de sobrevivir',
      de: 'deine Überlebenschancen', fr: 'tes chances de survie' } },
    { id: 'anime', name: 'Anime', q: {
      pt: 'anime explicado', en: 'anime explained', es: 'anime explicado', de: 'Anime erklärt', fr: 'anime expliqué' } },
    { id: 'teorias', name: 'Teorias de filmes e jogos', q: {
      pt: 'teoria de filme', en: 'movie theory', es: 'teoría de película', de: 'Filmtheorie', fr: 'théorie film' } },
  ]},
  { id: 'mente', name: 'Psicologia & Autodesenvolvimento', emoji: '🧠',
    kw: {
      pt: ['psicolog*', 'mente', 'comportamento*', 'estoic*', 'filosofi*', 'filósofo*', 'sêneca', 'marco aurélio', 'saúde',
        'doença*', 'hábito*', 'disciplina', 'motivaç*', 'ansiedade', 'depress*', 'narcis*', 'manipul*', 'autoestima', 'sono', 'sonho*', 'dorme', 'linguagem corporal'],
      en: ['psycholog*', 'mind', 'behavior*', 'stoic*', 'philosoph*', 'seneca', 'marcus aurelius', 'health', 'disease*',
        'habit*', 'discipline', 'motivation*', 'anxiety', 'depress*', 'narcis*', 'manipulat*', 'self', 'confidence', 'sleep', 'dream*', 'body language'],
      es: ['psicolog*', 'mente', 'comportamiento*', 'estoic*', 'filosofía*', 'filósofo*', 'séneca', 'marco aurelio', 'salud',
        'enfermedad*', 'hábito*', 'disciplina', 'motivaci*', 'ansiedad', 'depresi*', 'narcis*', 'manipul*', 'autoestima', 'sueño*', 'lenguaje corporal', 'duermes'],
      de: ['psycholog*', 'psyche', 'verhalten*', 'stoizismus', 'stoiker*', 'philosoph*', 'seneca', 'mark aurel', 'gesundheit*',
        'krankheit*', 'gewohnheit*', 'disziplin', 'motivation*', 'angst', 'depression*', 'narziss*', 'manipul*', 'selbstvertrauen', 'schlaf*', 'schläfst', 'traum*', 'träume*', 'körpersprache'],
      fr: ['psycholog*', 'esprit', 'comportement*', 'stoïc*', 'stoïcisme', 'philosoph*', 'sénèque', 'marc aurèle', 'santé',
        'maladie*', 'habitude*', 'discipline', 'motivation*', 'anxiété', 'dépression*', 'narciss*', 'manipul*', 'confiance', 'sommeil', 'rêve*', 'dors', 'langage corporel'],
    },
    subs: [
    { id: 'psicologia', name: 'Psicologia', q: {
      pt: 'psicologia explicada', en: 'psychology explained', es: 'psicología explicada', de: 'Psychologie erklärt', fr: 'psychologie expliquée' } },
    { id: 'estoicismo', name: 'Estoicismo / filosofia', q: {
      pt: 'estoicismo', en: 'stoicism', es: 'estoicismo', de: 'Stoizismus', fr: 'stoïcisme' } },
    { id: 'saude', name: 'Saúde e doenças', q: {
      pt: 'doença mais rara do mundo', en: 'rarest disease in the world', es: 'enfermedad más rara del mundo',
      de: 'seltenste Krankheit der Welt', fr: 'maladie la plus rare du monde' } },
    { id: 'linguagem-corporal', name: 'Linguagem corporal', q: {
      pt: 'sinais de linguagem corporal', en: 'body language signs', es: 'señales de lenguaje corporal',
      de: 'Körpersprache Zeichen', fr: 'signes du langage corporel' } },
    { id: 'sono-sonhos', name: 'Sono e sonhos', q: {
      pt: 'o que acontece quando você dorme', en: 'what happens when you sleep', es: 'qué pasa cuando duermes',
      de: 'was passiert wenn du schläfst', fr: 'ce qui se passe quand tu dors' } },
  ]},
  { id: 'fe-mitos', name: 'Fé & Mitologia', emoji: '📜',
    kw: {
      pt: ['bíblia*', 'bíblic*', 'jesus', 'cristo', 'deus', 'deuses', 'profeta*', 'anjo*', 'demônio*', 'diabo', 'mitolog*',
        'mito', 'mitos', 'zeus', 'thor', 'odin', 'olimpo', 'grega', 'gregos', 'nórdic*', 'apocalipse', 'gênesis', 'moisés', 'noé', 'fé',
        'egípci*', 'anúbis', 'osíris', 'lenda*', 'lendári*', 'dragão', 'dragões'],
      en: ['bible*', 'biblical', 'jesus', 'christ', 'god', 'gods', 'prophet*', 'angel*', 'demon*', 'devil', 'mytholog*',
        'myth', 'myths', 'zeus', 'thor', 'odin', 'olympus', 'greek', 'norse', 'revelation', 'genesis', 'moses', 'noah', 'faith',
        'egyptian', 'anubis', 'osiris', 'legend*', 'dragon*'],
      es: ['biblia*', 'bíblic*', 'jesús', 'cristo', 'dios', 'dioses', 'profeta*', 'ángel*', 'demonio*', 'diablo', 'mitolog*',
        'mito', 'mitos', 'zeus', 'thor', 'odín', 'olimpo', 'griega', 'griegos', 'nórdic*', 'apocalipsis', 'génesis', 'moisés', 'noé', 'fe',
        'egipci*', 'anubis', 'osiris', 'leyenda*', 'legendari*', 'dragón', 'dragones'],
      de: ['bibel*', 'biblisch*', 'jesus', 'christus', 'gott', 'götter', 'prophet*', 'engel*', 'dämon*', 'teufel', 'mythologie*',
        'mythos', 'mythen', 'zeus', 'thor', 'odin', 'olymp', 'griechisch*', 'nordisch*', 'offenbarung', 'genesis', 'mose', 'noah', 'glaube*',
        'ägyptisch*', 'anubis', 'osiris', 'legende*', 'legendär*', 'drache*'],
      fr: ['bible*', 'biblique*', 'jésus', 'christ', 'dieu', 'dieux', 'prophète*', 'ange', 'anges', 'démon*', 'diable', 'mythologie*',
        'mythe', 'mythes', 'zeus', 'thor', 'odin', 'olympe', 'grecque*', 'grecs', 'nordique*', 'apocalypse', 'genèse', 'moïse', 'noé', 'foi',
        'égyptien*', 'anubis', 'osiris', 'légende*', 'légendaire*', 'dragon*'],
    },
    subs: [
    { id: 'biblia', name: 'Histórias bíblicas', q: {
      pt: 'história bíblica', en: 'bible story', es: 'historia bíblica', de: 'biblische Geschichte', fr: 'histoire biblique' } },
    { id: 'mitologia', name: 'Mitologia', q: {
      pt: 'mitologia grega', en: 'greek mythology', es: 'mitología griega', de: 'griechische Mythologie', fr: 'mythologie grecque' } },
    { id: 'nordica', name: 'Mitologia nórdica', q: {
      pt: 'mitologia nórdica', en: 'norse mythology', es: 'mitología nórdica', de: 'nordische Mythologie', fr: 'mythologie nordique' } },
    { id: 'egipcia', name: 'Mitologia egípcia', q: {
      pt: 'mitologia egípcia', en: 'egyptian mythology', es: 'mitología egipcia', de: 'ägyptische Mythologie', fr: 'mythologie égyptienne' } },
    { id: 'criaturas-lendarias', name: 'Criaturas lendárias', q: {
      pt: 'criaturas lendárias', en: 'legendary creatures', es: 'criaturas legendarias', de: 'legendäre Kreaturen', fr: 'créatures légendaires' } },
  ]},
  { id: 'sobrevivencia', name: 'Sobrevivência & Desastres', emoji: '🧭',
    kw: {
      pt: ['desastre*', 'catástrofe*', 'tragédia*', 'acidente*', 'sobreviveu', 'sobrevivente*', 'naufrágio*', 'titanic',
        'terremoto*', 'tsunami*', 'furacão', 'vulcão', 'avalanche*', 'incêndio*', 'explos*', 'chernobyl', 'preso*', 'resgate*',
        'avião', 'aviões', 'aére*', 'voo', 'perdido*', 'perdida*'],
      en: ['disaster*', 'catastroph*', 'tragedy', 'tragic', 'accident*', 'survived', 'survivor*', 'shipwreck*', 'titanic',
        'earthquake*', 'tsunami*', 'hurricane*', 'volcano*', 'avalanche*', 'fire', 'explosion*', 'chernobyl', 'trapped', 'stranded', 'rescue*',
        'plane*', 'crash*', 'flight*', 'wilderness', 'lost'],
      es: ['desastre*', 'catástrofe*', 'tragedia*', 'accidente*', 'sobrevivió', 'sobreviviente*', 'superviviente*', 'naufragio*',
        'titanic', 'terremoto*', 'tsunami*', 'huracán', 'volcán', 'avalancha*', 'incendio*', 'explosi*', 'chernóbil', 'chernobyl', 'atrapad*', 'rescate*',
        'avión', 'aviones', 'aére*', 'vuelo*', 'perdido*', 'perdida*'],
      de: ['katastrophe*', 'tragödie*', 'unfall*', 'unglück*', 'überlebte', 'überlebende*', 'schiffbruch*', 'titanic',
        'erdbeben*', 'tsunami*', 'hurrikan*', 'vulkan*', 'lawine*', 'feuer*', 'brand', 'explosion*', 'tschernobyl', 'gefangen*', 'rettung*',
        'flugzeug*', 'absturz*', 'flug', 'wildnis', 'verloren*', 'verschollen*'],
      fr: ['catastrophe*', 'désastre*', 'tragédie*', 'accident*', 'survécu', 'survivant*', 'naufrage*', 'titanic', 'séisme*',
        'tremblement de terre', 'tsunami*', 'ouragan*', 'volcan*', 'avalanche*', 'incendie*', 'explosion*', 'tchernobyl', 'piégé*', 'sauvetage*',
        'avion*', 'aérien*', 'crash*', 'vol', 'perdu*'],
    },
    subs: [
    { id: 'desastres', name: 'Desastres reais', q: {
      pt: 'o pior desastre', en: 'worst disaster in history', es: 'el peor desastre', de: 'schlimmste Katastrophe', fr: 'la pire catastrophe' } },
    { id: 'sobreviventes', name: 'Histórias de sobreviventes', q: {
      pt: 'ele sobreviveu', en: 'how he survived', es: 'cómo sobrevivió', de: 'wie er überlebte', fr: 'comment il a survécu' } },
    { id: 'naufragios', name: 'Naufrágios', q: {
      pt: 'naufrágio história real', en: 'shipwreck true story', es: 'naufragio historia real',
      de: 'Schiffbruch wahre Geschichte', fr: 'naufrage histoire vraie' } },
    { id: 'acidentes-aereos', name: 'Acidentes aéreos', q: {
      pt: 'acidente aéreo explicado', en: 'plane crash explained', es: 'accidente aéreo explicado',
      de: 'Flugzeugabsturz erklärt', fr: 'crash aérien expliqué' } },
    { id: 'perdidos-natureza', name: 'Perdidos na natureza', q: {
      pt: 'perdido na selva sobreviveu', en: 'lost in the wilderness survival story', es: 'perdido en la selva sobrevivió',
      de: 'in der Wildnis verloren überlebt', fr: 'perdu dans la nature survie' } },
  ]},
];
