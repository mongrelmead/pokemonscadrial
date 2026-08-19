(function () {
  var global = globalThis;
  if (typeof window !== "undefined") {
    global = window;
  }

  const ACCENTS = /[áéíóúüñ]/g;
  const ACCENT_MAP = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n" };

  const DATA_URL =
    "https://raw.githubusercontent.com/mongrelmead/pokemonscadrial/refs/heads/main/data/pokemon-v1.json";
  const SPRITE_BASE = "https://play.pokemonshowdown.com/sprites/ani/";
  const SPRITE_SLUG = { 29: "nidoranf", 32: "nidoranm" };
  const TYPE_BASE = "https://images.wikidexcdn.net/mwuploads/wikidex/";
  const VS_BASE = "https://archives.bulbagarden.net/media/upload/";

  const HABITATS = [
    "pradera",
    "bosque",
    "aguadulce",
    "mar",
    "cueva",
    "montana",
    "campo",
    "urbano",
    "nieve",
    "desierto",
    "ruinas",
    "pantano",
    "volcan",
  ];

  const HABITAT_ALIAS = {
    pradera: "pradera",
    grassland: "pradera",
    bosque: "bosque",
    forest: "bosque",
    aguadulce: "aguadulce",
    "agua-dulce": "aguadulce",
    mar: "mar",
    sea: "mar",
    cueva: "cueva",
    cave: "cueva",
    montana: "montana",
    mountain: "montana",
    campo: "campo",
    urbano: "urbano",
    urban: "urbano",
    ciudad: "urbano",
    nieve: "nieve",
    hielo: "nieve",
    tundra: "nieve",
    desierto: "desierto",
    desert: "desierto",
    ruinas: "ruinas",
    ruina: "ruinas",
    pantano: "pantano",
    swamp: "pantano",
    volcan: "volcan",
    volcano: "volcan",
  };

  const HABITAT_LABEL = {
    pradera: "Pradera",
    bosque: "Bosque",
    aguadulce: "Agua dulce",
    mar: "Mar",
    cueva: "Cueva",
    montana: "Montaña",
    campo: "Campo",
    urbano: "Urbano",
    nieve: "Nieve",
    desierto: "Desierto",
    ruinas: "Ruinas",
    pantano: "Pantano",
    volcan: "Volcán",
  };

  const DIFFICULTY = {
    1: ["basica"],
    2: ["basica", "mid"],
    3: ["basica", "mid", "dos"],
    4: ["mid", "mid", "dos", "dos"],
    5: ["mid", "mid", "mid", "dos", "dos"],
    6: ["mid", "mid", "mid", "dos", "dos", "dos"],
    7: ["mid", "mid", "dos", "dos", "dos", "dos"],
    8: ["mid", "dos", "dos", "dos", "dos", "dos"],
    9: ["dos", "dos", "dos", "dos", "dos", "dos"],
  };

  const TYPE_SPRITE = {
    normal: { file: "9/99/Tipo_normal_EP.png", label: "Normal" },
    fire: { file: "c/c0/Tipo_fuego_EP.png", label: "Fuego" },
    fuego: { file: "c/c0/Tipo_fuego_EP.png", label: "Fuego" },
    water: { file: "5/59/Tipo_agua_EP.png", label: "Agua" },
    agua: { file: "5/59/Tipo_agua_EP.png", label: "Agua" },
    grass: { file: "a/a7/Tipo_planta_EP.png", label: "Planta" },
    planta: { file: "a/a7/Tipo_planta_EP.png", label: "Planta" },
    electric: { file: "3/38/Tipo_el%C3%A9ctrico_EP.png", label: "Eléctrico" },
    electrico: { file: "3/38/Tipo_el%C3%A9ctrico_EP.png", label: "Eléctrico" },
    ice: { file: "1/17/Tipo_hielo_EP.png", label: "Hielo" },
    hielo: { file: "1/17/Tipo_hielo_EP.png", label: "Hielo" },
    fighting: { file: "5/5f/Tipo_lucha_EP.png", label: "Lucha" },
    lucha: { file: "5/5f/Tipo_lucha_EP.png", label: "Lucha" },
    poison: { file: "1/11/Tipo_veneno_EP.png", label: "Veneno" },
    veneno: { file: "1/11/Tipo_veneno_EP.png", label: "Veneno" },
    ground: { file: "c/c9/Tipo_tierra_EP.png", label: "Tierra" },
    tierra: { file: "c/c9/Tipo_tierra_EP.png", label: "Tierra" },
    flying: { file: "9/9a/Tipo_volador_EP.png", label: "Volador" },
    volador: { file: "9/9a/Tipo_volador_EP.png", label: "Volador" },
    psychic: { file: "9/9b/Tipo_ps%C3%ADquico_EP.png", label: "Psíquico" },
    psiquico: { file: "9/9b/Tipo_ps%C3%ADquico_EP.png", label: "Psíquico" },
    bug: { file: "5/5d/Tipo_bicho_EP.png", label: "Bicho" },
    bicho: { file: "5/5d/Tipo_bicho_EP.png", label: "Bicho" },
    rock: { file: "8/88/Tipo_roca_EP.png", label: "Roca" },
    roca: { file: "8/88/Tipo_roca_EP.png", label: "Roca" },
    ghost: { file: "0/03/Tipo_fantasma_EP.png", label: "Fantasma" },
    fantasma: { file: "0/03/Tipo_fantasma_EP.png", label: "Fantasma" },
    dragon: { file: "b/b8/Tipo_drag%C3%B3n_EP.png", label: "Dragón" },
    dark: { file: "d/de/Tipo_siniestro_EP.png", label: "Siniestro" },
    siniestro: { file: "d/de/Tipo_siniestro_EP.png", label: "Siniestro" },
    steel: { file: "5/52/Tipo_acero_EP.png", label: "Acero" },
    acero: { file: "5/52/Tipo_acero_EP.png", label: "Acero" },
    fairy: { file: "9/97/Tipo_hada_EP.png", label: "Hada" },
    hada: { file: "9/97/Tipo_hada_EP.png", label: "Hada" },
  };

  const MONTHS = {
    enero: 0,
    ene: 0,
    febrero: 1,
    feb: 1,
    marzo: 2,
    mar: 2,
    abril: 3,
    abr: 3,
    mayo: 4,
    may: 4,
    junio: 5,
    jun: 5,
    julio: 6,
    jul: 6,
    agosto: 7,
    ago: 7,
    septiembre: 8,
    setiembre: 8,
    sep: 8,
    set: 8,
    octubre: 9,
    oct: 9,
    noviembre: 10,
    nov: 10,
    diciembre: 11,
    dic: 11,
  };

  function vs(hash, file) {
    return VS_BASE + hash + "/" + file;
  }

  const CLASSES = {
    ace_m: {
      label: "Entrenador guay",
      gender: "m",
      images: [vs("9/96", "VSAce_Trainer_M.png"), vs("1/1e", "VSAce_Trainer_M_ORAS.png")],
    },
    ace_f: {
      label: "Entrenadora guay",
      gender: "f",
      images: [vs("6/62", "VSAce_Trainer_F.png"), vs("8/80", "VSAce_Trainer_F_ORAS.png")],
    },
    ace_duo: {
      label: "Pareja de entrenadores",
      gender: "x",
      images: [vs("6/68", "VSAce_Duo.png"), vs("7/7c", "VSAce_Duo_ORAS.png")],
    },
    aroma: { label: "Señorita aroma", gender: "f", images: [vs("d/d3", "VSAroma_Lady.png")] },
    artist_m: { label: "Artista", gender: "m", images: [vs("a/aa", "VSArtist_M.png")] },
    artist_f: { label: "Artista", gender: "f", images: [vs("6/6d", "VSArtist_F.png")] },
    backpacker: { label: "Mochilero", gender: "m", images: [vs("5/52", "VSBackpacker.png")] },
    battle_girl: {
      label: "Luchadora",
      gender: "f",
      images: [vs("6/6b", "VSBattle_Girl.png"), vs("2/22", "VSBattle_Girl_ORAS.png")],
    },
    beauty: {
      label: "Modelo",
      gender: "f",
      images: [vs("2/21", "VSBeauty.png"), vs("e/e2", "VSBeauty_ORAS.png")],
    },
    bird_keeper: { label: "Ornitólogo", gender: "m", images: [vs("a/a0", "VSBird_Keeper.png")] },
    black_belt: { label: "Cinturón negro", gender: "m", images: [vs("6/68", "VSBlack_Belt.png")] },
    breeder_m: {
      label: "Criapokémon",
      gender: "m",
      images: [
        vs("d/de", "VSPok%C3%A9mon_Breeder_M.png"),
        vs("5/5e", "VSPok%C3%A9mon_Breeder_M_ORAS.png"),
      ],
    },
    breeder_f: {
      label: "Criapokémon",
      gender: "f",
      images: [
        vs("e/e8", "VSPok%C3%A9mon_Breeder_F.png"),
        vs("0/08", "VSPok%C3%A9mon_Breeder_F_ORAS.png"),
      ],
    },
    bug_catcher: { label: "Cazabichos", gender: "m", images: [vs("2/26", "VSBug_Catcher.png")] },
    bug_maniac: { label: "Bichomaniaco", gender: "m", images: [vs("1/1f", "VSBug_Maniac.png")] },
    butler: { label: "Mayordomo", gender: "m", images: [vs("d/dc", "VSButler.png")] },
    camper: { label: "Campista", gender: "m", images: [vs("6/61", "VSCamper.png")] },
    chef: { label: "Cocinero", gender: "m", images: [vs("0/07", "VSChef.png")] },
    collector: { label: "Coleccionista", gender: "m", images: [vs("d/d9", "VSCollector.png")] },
    delinquent: { label: "Macarra", gender: "f", images: [vs("f/f1", "VSDelinquent.png")] },
    dragon_tamer: { label: "Domadragones", gender: "m", images: [vs("9/94", "VSDragon_Tamer.png")] },
    expert_m: { label: "Experto", gender: "m", images: [vs("1/17", "VSExpert_M.png")] },
    expert_f: { label: "Experta", gender: "f", images: [vs("e/e4", "VSExpert_F.png")] },
    fairy_tale: { label: "Chica cuento", gender: "f", images: [vs("8/8e", "VSFairy_Tale_Girl.png")] },
    fisherman: {
      label: "Pescador",
      gender: "m",
      images: [vs("4/46", "VSFisherman.png"), vs("7/79", "VSFisherman_ORAS.png")],
    },
    free_diver: { label: "Apneísta", gender: "m", images: [vs("7/79", "VSFree_Diver.png")] },
    furisode: {
      label: "Señorita kimono",
      gender: "f",
      images: [
        vs("8/82", "VSFurisode_Girl_1.png"),
        vs("7/7b", "VSFurisode_Girl_2.png"),
        vs("d/d2", "VSFurisode_Girl_3.png"),
        vs("1/16", "VSFurisode_Girl_4.png"),
      ],
    },
    gardener: { label: "Jardinero", gender: "m", images: [vs("e/e2", "VSGardener.png")] },
    garcon: { label: "Camarero", gender: "m", images: [vs("a/aa", "VSGar%C3%A7on.png")] },
    gentleman: { label: "Caballero", gender: "m", images: [vs("b/bc", "VSGentleman.png")] },
    guitarist: { label: "Guitarrista", gender: "m", images: [vs("0/03", "VSGuitarist.png")] },
    hex: { label: "Médium", gender: "f", images: [vs("b/b2", "VSHex_Maniac.png")] },
    hiker: { label: "Montañero", gender: "m", images: [vs("7/79", "VSHiker.png")] },
    kindler: { label: "Fogonero", gender: "m", images: [vs("7/7a", "VSKindler.png")] },
    lady: {
      label: "Dama",
      gender: "f",
      images: [vs("7/7a", "VSLady.png"), vs("5/5f", "VSLady_ORAS.png")],
    },
    lass: {
      label: "Chica",
      gender: "f",
      images: [vs("f/f4", "VSLass_XY.png"), vs("9/99", "VSLass_ORAS.png")],
    },
    madame: { label: "Madame", gender: "f", images: [vs("7/7b", "VSMadame.png")] },
    maid: { label: "Doncella", gender: "f", images: [vs("5/50", "VSMaid.png")] },
    monsieur: { label: "Monsieur", gender: "m", images: [vs("2/20", "VSMonsieur.png")] },
    mysterious: { label: "Hermanas misteriosas", gender: "x", images: [vs("e/e0", "VSMysterious_Sisters.png")] },
    ninja: { label: "Ninja", gender: "m", images: [vs("8/84", "VSNinja_Boy.png")] },
    old_couple: { label: "Pareja mayor", gender: "x", images: [vs("9/9e", "VSOld_Couple.png")] },
    owner: { label: "Dueño", gender: "m", images: [vs("4/47", "VSOwner.png")] },
    parasol: { label: "Dama parasol", gender: "f", images: [vs("4/46", "VSParasol_Lady.png")] },
    picnicker: { label: "Dominguera", gender: "f", images: [vs("4/42", "VSPicnicker.png")] },
    poke_fan_m: {
      label: "Pokéfan",
      gender: "m",
      images: [vs("7/7c", "VSPok%C3%A9_Fan_M.png"), vs("3/39", "VSPok%C3%A9_Fan_M_ORAS.png")],
    },
    poke_fan_f: {
      label: "Pokéfan",
      gender: "f",
      images: [vs("a/ac", "VSPok%C3%A9_Fan_F.png"), vs("c/c3", "VSPok%C3%A9_Fan_F_ORAS.png")],
    },
    poke_maniac: { label: "Pokémaníaco", gender: "m", images: [vs("b/bf", "VSPok%C3%A9_Maniac.png")] },
    preschooler_m: { label: "Preescolar", gender: "m", images: [vs("f/f5", "VSPreschooler_M.png")] },
    preschooler_f: { label: "Preescolar", gender: "f", images: [vs("e/e3", "VSPreschooler_F.png")] },
    psychic: { label: "Médium", gender: "m", images: [vs("d/d4", "VSPsychic.png")] },
    punk_m: { label: "Punk", gender: "m", images: [vs("3/34", "VSPunk_Guy.png")] },
    punk_f: { label: "Punk", gender: "f", images: [vs("b/ba", "VSPunk_Girl.png")] },
    punk_duo: { label: "Pareja punk", gender: "x", images: [vs("5/52", "VSPunk_Couple.png")] },
    ranger_m: {
      label: "Pokémon ranger",
      gender: "m",
      images: [
        vs("6/6f", "VSPok%C3%A9mon_Ranger_M.png"),
        vs("8/88", "VSPok%C3%A9mon_Ranger_M_ORAS.png"),
      ],
    },
    ranger_f: {
      label: "Pokémon ranger",
      gender: "f",
      images: [
        vs("5/5a", "VSPok%C3%A9mon_Ranger_F.png"),
        vs("9/92", "VSPok%C3%A9mon_Ranger_F_ORAS.png"),
      ],
    },
    rich_boy: {
      label: "Señorito",
      gender: "m",
      images: [vs("9/98", "VSRich_Boy.png"), vs("3/35", "VSRich_Boy_ORAS.png")],
    },
    rising_m: { label: "Estrella emergente", gender: "m", images: [vs("e/e4", "VSRising_Star_M.png")] },
    rising_f: { label: "Estrella emergente", gender: "f", images: [vs("c/c6", "VSRising_Star_F.png")] },
    roller_m: { label: "Patín", gender: "m", images: [vs("3/3a", "VSRoller_Skater_M.png")] },
    roller_f: { label: "Patín", gender: "f", images: [vs("d/d5", "VSRoller_Skater_F.png")] },
    ruin_maniac: { label: "Ruinamaníaco", gender: "m", images: [vs("f/f7", "VSRuin_Maniac.png")] },
    sailor: { label: "Marinero", gender: "m", images: [vs("c/cb", "VSSailor.png")] },
    schoolboy: { label: "Escolar", gender: "m", images: [vs("a/a4", "VSSchoolboy.png")] },
    schoolgirl: { label: "Escolar", gender: "f", images: [vs("9/9b", "VSSchoolgirl.png")] },
    schoolkid_m: { label: "Escolar", gender: "m", images: [vs("2/27", "VSSchoolkid_M.png")] },
    schoolkid_f: { label: "Escolar", gender: "f", images: [vs("6/6a", "VSSchoolkid_F.png")] },
    scientist_m: { label: "Científico", gender: "m", images: [vs("2/27", "VSScientist_M.png")] },
    scientist_f: { label: "Científica", gender: "f", images: [vs("e/ee", "VSScientist_F.png")] },
    scuba: { label: "Buceador", gender: "m", images: [vs("1/11", "VSScuba_Diver.png")] },
    sis_bro: { label: "Hermano y hermana", gender: "x", images: [vs("2/22", "VSSis_%26_Bro.png")] },
    sky_m: { label: "Aeronauta", gender: "m", images: [vs("6/65", "VSSky_Trainer_M.png")] },
    sky_f: { label: "Aeronauta", gender: "f", images: [vs("1/1f", "VSSky_Trainer_F.png")] },
    street_thug: { label: "Granuja", gender: "m", images: [vs("a/a0", "VSStreet_Thug.png")] },
    swimmer_m: { label: "Nadador", gender: "m", images: [vs("b/b2", "VSSwimmer_M_VI.png")] },
    swimmer_f: {
      label: "Nadadora",
      gender: "f",
      images: [vs("3/3a", "VSSwimmer_F_XY.png"), vs("f/ff", "VSSwimmer_F_ORAS.png")],
    },
    tourist_m: { label: "Turista", gender: "m", images: [vs("b/b3", "VSTourist_M.png")] },
    tourist_f: {
      label: "Turista",
      gender: "f",
      images: [vs("e/e3", "VSTourist_F_A.png"), vs("2/29", "VSTourist_F_B.png")],
    },
    tri_biker: { label: "Triatleta", gender: "m", images: [vs("3/38", "VSTriathlete_Biker.png")] },
    tri_runner: { label: "Triatleta", gender: "f", images: [vs("b/b0", "VSTriathlete_Runner.png")] },
    tri_swim: { label: "Triatleta", gender: "m", images: [vs("2/20", "VSTriathlete_Swimmer.png")] },
    tuber_m: { label: "Playero", gender: "m", images: [vs("7/73", "VSTuber_M.png")] },
    tuber_f: { label: "Playera", gender: "f", images: [vs("d/de", "VSTuber_F.png")] },
    twins: { label: "Gemelas", gender: "x", images: [vs("e/e5", "VSTwins.png")] },
    veteran_m: { label: "Veterano", gender: "m", images: [vs("2/2f", "VSVeteran_M.png")] },
    veteran_f: { label: "Veterana", gender: "f", images: [vs("9/9d", "VSVeteran_F.png")] },
    waitress: { label: "Camarera", gender: "f", images: [vs("f/ff", "VSWaitress.png")] },
    worker: {
      label: "Obrero",
      gender: "m",
      images: [vs("6/6a", "VSWorker_A.png"), vs("2/20", "VSWorker_B.png")],
    },
    youngster: { label: "Joven", gender: "m", images: [vs("1/1a", "VSYoungster.png")] },
  };

  const COMMON_CLASSES = [
    "youngster",
    "lass",
    "ace_m",
    "ace_f",
    "breeder_m",
    "breeder_f",
    "ranger_m",
    "ranger_f",
  ];

  const HABITAT_CLASSES = {
    pradera: [
      "camper",
      "picnicker",
      "ranger_m",
      "ranger_f",
      "poke_fan_m",
      "poke_fan_f",
      "breeder_m",
      "breeder_f",
      "lass",
      "youngster",
      "rising_m",
      "rising_f",
      "bird_keeper",
    ],
    bosque: [
      "bug_catcher",
      "bug_maniac",
      "ranger_m",
      "ranger_f",
      "camper",
      "picnicker",
      "ninja",
      "fairy_tale",
    ],
    aguadulce: [
      "fisherman",
      "swimmer_m",
      "swimmer_f",
      "tuber_m",
      "tuber_f",
      "parasol",
      "tri_swim",
      "sis_bro",
    ],
    mar: [
      "sailor",
      "swimmer_m",
      "swimmer_f",
      "scuba",
      "free_diver",
      "fisherman",
      "tuber_m",
      "tuber_f",
      "tri_swim",
    ],
    cueva: [
      "hiker",
      "worker",
      "ninja",
      "scientist_m",
      "scientist_f",
      "poke_maniac",
      "expert_m",
      "expert_f",
      "black_belt",
    ],
    montana: [
      "backpacker",
      "hiker",
      "bird_keeper",
      "ranger_m",
      "ranger_f",
      "dragon_tamer",
      "camper",
      "picnicker",
      "sky_m",
      "sky_f",
    ],
    campo: [
      "breeder_m",
      "breeder_f",
      "camper",
      "picnicker",
      "aroma",
      "gardener",
      "poke_fan_m",
      "poke_fan_f",
      "lass",
      "youngster",
    ],
    urbano: [
      "chef",
      "garcon",
      "waitress",
      "roller_m",
      "roller_f",
      "schoolboy",
      "schoolgirl",
      "schoolkid_m",
      "schoolkid_f",
      "scientist_m",
      "scientist_f",
      "guitarist",
      "street_thug",
      "delinquent",
      "punk_m",
      "punk_f",
      "punk_duo",
      "rich_boy",
      "lady",
      "ace_m",
      "ace_f",
      "veteran_m",
      "veteran_f",
      "beauty",
      "madame",
      "monsieur",
      "butler",
      "maid",
      "owner",
      "artist_m",
      "artist_f",
      "preschooler_m",
      "preschooler_f",
      "furisode",
    ],
    nieve: [
      "backpacker",
      "expert_m",
      "expert_f",
      "veteran_m",
      "veteran_f",
      "ace_m",
      "ace_f",
      "tri_runner",
    ],
    desierto: [
      "ruin_maniac",
      "backpacker",
      "ranger_m",
      "ranger_f",
      "tri_runner",
      "expert_m",
      "expert_f",
      "collector",
    ],
    ruinas: [
      "ruin_maniac",
      "hex",
      "psychic",
      "mysterious",
      "scientist_m",
      "scientist_f",
      "poke_maniac",
      "collector",
      "expert_m",
      "expert_f",
    ],
    pantano: [
      "hex",
      "bug_catcher",
      "ranger_m",
      "ranger_f",
      "fisherman",
      "ninja",
      "scientist_m",
      "scientist_f",
    ],
    volcan: [
      "kindler",
      "worker",
      "black_belt",
      "battle_girl",
      "expert_m",
      "expert_f",
      "ace_m",
      "ace_f",
    ],
  };

  const NAMES = {
    m: [
      "Mateo",
      "Andrés",
      "Hugo",
      "Leo",
      "Nicolás",
      "Iván",
      "Diego",
      "Pablo",
      "Sergio",
      "Raúl",
      "Tomás",
      "Julián",
      "Óscar",
      "Marcos",
      "Adrián",
      "Bruno",
      "César",
      "Enrique",
      "Fabián",
      "Gabriel",
    ],
    f: [
      "Lucía",
      "Elena",
      "Marina",
      "Clara",
      "Sofía",
      "Valeria",
      "Iris",
      "Nora",
      "Aitana",
      "Jimena",
      "Paula",
      "Inés",
      "Carla",
      "Alba",
      "Nerea",
      "Olivia",
      "Vera",
      "Lola",
      "Marta",
      "Sara",
    ],
    x: [
      "Ana y Luis",
      "Eva y Nico",
      "Lara y Hugo",
      "Mía y Leo",
      "Noa y Dani",
      "Irene y Pablo",
      "Clara y Marcos",
      "Sofía y Iván",
    ],
  };

  var POKEMON = [];
  var CURRENT_DATA = null;
  var VERSION_CACHE = {};

  function normalize(value) {
    return String(value)
      .toLowerCase()
      .replace(ACCENTS, function (ch) {
        return ACCENT_MAP[ch];
      })
      .trim();
  }

  function splitParts(raw) {
    const out = [];
    const parts = String(raw).split(",");
    for (let i = 0; i < parts.length; i++) {
      const token = normalize(parts[i]);
      if (token) {
        out.push(token);
      }
    }
    return out;
  }

  function parseNpc(text) {
    const parts = splitParts(text);
    if (parts.length !== 2) {
      return "Formato inválido de npc.";
    }
    const habitat = HABITAT_ALIAS[parts[0]];
    if (!habitat) {
      return "Habitat desconocido: " + parts[0];
    }
    if (!/^[1-9]$/.test(parts[1])) {
      return "Dificultad inválida.";
    }
    return {
      habitat: habitat,
      difficulty: parseInt(parts[1], 10),
    };
  }

  function difficultyRecipe(level) {
    const recipe = DIFFICULTY[level];
    if (!recipe) {
      return [];
    }
    return recipe.slice();
  }

  function applyPokemonData(data) {
    CURRENT_DATA = data;
    if (data && data.pokemon) {
      POKEMON = data.pokemon;
      return;
    }
    if (Object.prototype.toString.call(data) === "[object Array]") {
      POKEMON = data;
      CURRENT_DATA = { pokemon: data };
    }
  }

  function pokemonListFromData(data) {
    if (data && data.pokemon) {
      return data.pokemon;
    }
    if (Object.prototype.toString.call(data) === "[object Array]") {
      return data;
    }
    return [];
  }

  function versionsFromCurrent() {
    if (
      CURRENT_DATA &&
      Object.prototype.toString.call(CURRENT_DATA.versions) === "[object Array]"
    ) {
      return CURRENT_DATA.versions;
    }
    return [];
  }

  function parseForumDate(value) {
    if (value == null) {
      return null;
    }
    var text = String(value).trim();
    if (!text) {
      return null;
    }
    var iso = text.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
    );
    if (iso) {
      return new Date(
        Number(iso[1]),
        Number(iso[2]) - 1,
        Number(iso[3]),
        iso[4] ? Number(iso[4]) : 0,
        iso[5] ? Number(iso[5]) : 0,
        iso[6] ? Number(iso[6]) : 0
      );
    }
    var es = text.match(
      /^(?:[a-záéíóúüñ]+)\s+(\d{1,2})\s+([a-záéíóúüñ]+)\s+(\d{4})\s*-\s*(\d{1,2}):(\d{2})(?::(\d{2}))?$/i
    );
    if (!es) {
      return null;
    }
    var month = MONTHS[es[2].toLowerCase()];
    if (month == null) {
      return null;
    }
    return new Date(
      Number(es[3]),
      month,
      Number(es[1]),
      Number(es[4]),
      Number(es[5]),
      es[6] ? Number(es[6]) : 0
    );
  }

  function pickVersion(versions, postDate) {
    if (!versions || !versions.length) {
      return null;
    }
    var parsed = [];
    var i;
    for (i = 0; i < versions.length; i++) {
      var from = parseForumDate(versions[i] && versions[i].from);
      if (!from) {
        continue;
      }
      parsed.push({ version: versions[i], from: from.getTime() });
    }
    if (!parsed.length) {
      return null;
    }
    parsed.sort(function (a, b) {
      return a.from - b.from;
    });
    if (!postDate) {
      return null;
    }
    var chosen = null;
    var t = postDate.getTime();
    for (i = 0; i < parsed.length; i++) {
      if (parsed[i].from <= t) {
        chosen = parsed[i].version;
      }
    }
    if (!chosen) {
      chosen = parsed[0].version;
    }
    if (!chosen.url) {
      return null;
    }
    return chosen;
  }

  function fetchJson(url, onDone, onError) {
    function fail() {
      if (typeof onError === "function") {
        onError();
      }
    }
    function ok(data) {
      if (typeof onDone === "function") {
        onDone(data);
      }
    }
    if (typeof fetch === "function") {
      fetch(url)
        .then(function (res) {
          if (!res.ok) {
            throw new Error("HTTP " + res.status);
          }
          return res.json();
        })
        .then(ok)
        .catch(fail);
      return;
    }
    if (typeof global.$ === "function") {
      global.$.getJSON(url).done(ok).fail(fail);
      return;
    }
    fail();
  }

  function loadPokemonData(onDone, onError) {
    fetchJson(
      DATA_URL,
      function (data) {
        applyPokemonData(data);
        if (typeof onDone === "function") {
          onDone();
        }
      },
      onError
    );
  }

  function loadVersionData(url, onDone, onError) {
    if (Object.prototype.hasOwnProperty.call(VERSION_CACHE, url)) {
      if (VERSION_CACHE[url] === null) {
        if (typeof onError === "function") {
          onError();
        }
        return;
      }
      if (typeof onDone === "function") {
        onDone(VERSION_CACHE[url]);
      }
      return;
    }
    fetchJson(
      url,
      function (data) {
        VERSION_CACHE[url] = data;
        if (typeof onDone === "function") {
          onDone(data);
        }
      },
      function () {
        VERSION_CACHE[url] = null;
        if (typeof onError === "function") {
          onError();
        }
      }
    );
  }

  function poolFor(habitat, list) {
    const source = list || POKEMON;
    const pool = [];
    for (let i = 0; i < source.length; i++) {
      if (source[i].habitat === habitat) {
        pool.push(source[i]);
      }
    }
    return pool;
  }

  function stagesForSlot(slot) {
    if (slot === "mid") {
      return ["uno", "unica"];
    }
    return [slot];
  }

  function ofStages(pool, stages) {
    const out = [];
    for (let i = 0; i < pool.length; i++) {
      if (stages.indexOf(pool[i].stage) !== -1) {
        out.push(pool[i]);
      }
    }
    return out;
  }

  function unusedOf(list, used) {
    const out = [];
    for (let i = 0; i < list.length; i++) {
      if (!used[list[i].id]) {
        out.push(list[i]);
      }
    }
    return out;
  }

  function pickOne(list, rng) {
    if (!list.length) {
      return null;
    }
    return list[Math.floor(rng() * list.length)];
  }

  function typesFrom(mons) {
    const out = [];
    var i;
    var j;
    for (i = 0; i < mons.length; i++) {
      const types = mons[i].types || [];
      for (j = 0; j < types.length; j++) {
        const key = normalize(types[j]);
        if (out.indexOf(key) === -1) {
          out.push(key);
        }
      }
    }
    return out;
  }

  function hasType(mon, typeKey) {
    const types = mon.types || [];
    var i;
    for (i = 0; i < types.length; i++) {
      if (normalize(types[i]) === typeKey) {
        return true;
      }
    }
    return false;
  }

  function copyMon(mon) {
    return {
      id: mon.id,
      name: mon.name,
      habitat: mon.habitat,
      stage: mon.stage,
      sprite: mon.sprite,
      types: mon.types ? mon.types.slice() : [],
    };
  }

  function pickMonForSlot(slot, habitat, list, used, team, rng) {
    const stages = stagesForSlot(slot);
    const local = unusedOf(ofStages(poolFor(habitat, list), stages), used);
    if (local.length) {
      return pickOne(local, rng);
    }

    var typePool = typesFrom(team);
    if (!typePool.length) {
      typePool = typesFrom(poolFor(habitat, list));
    }

    const outsiders = [];
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].habitat !== habitat) {
        outsiders.push(list[i]);
      }
    }

    if (typePool.length) {
      const typeKey = pickOne(typePool, rng);
      const typed = [];
      for (i = 0; i < outsiders.length; i++) {
        if (
          stages.indexOf(outsiders[i].stage) !== -1 &&
          hasType(outsiders[i], typeKey) &&
          !used[outsiders[i].id]
        ) {
          typed.push(outsiders[i]);
        }
      }
      if (typed.length) {
        return pickOne(typed, rng);
      }
    }

    const anyStage = unusedOf(ofStages(outsiders, stages), used);
    if (anyStage.length) {
      return pickOne(anyStage, rng);
    }

    if (slot === "dos") {
      return pickMonForSlot("mid", habitat, list, used, team, rng);
    }
    if (slot === "mid") {
      return pickMonForSlot("basica", habitat, list, used, team, rng);
    }
    return null;
  }

  function pickTeam(habitat, difficulty, rng, list) {
    const recipe = difficultyRecipe(difficulty);
    const team = [];
    const used = {};
    var i;
    for (i = 0; i < recipe.length; i++) {
      const mon = pickMonForSlot(recipe[i], habitat, list, used, team, rng);
      if (!mon) {
        continue;
      }
      used[mon.id] = true;
      team.push(copyMon(mon));
    }
    return team;
  }

  function classesForHabitat(habitat) {
    const seen = {};
    const out = [];
    const bags = [HABITAT_CLASSES[habitat] || [], COMMON_CLASSES];
    var i;
    var j;
    for (i = 0; i < bags.length; i++) {
      for (j = 0; j < bags[i].length; j++) {
        const id = bags[i][j];
        if (!CLASSES[id] || seen[id]) {
          continue;
        }
        seen[id] = true;
        out.push(id);
      }
    }
    return out;
  }

  function pickTrainer(habitat, rng) {
    const ids = classesForHabitat(habitat);
    const id = pickOne(ids, rng) || "youngster";
    const cls = CLASSES[id] || CLASSES.youngster;
    const image = pickOne(cls.images, rng) || cls.images[0];
    const names = NAMES[cls.gender] || NAMES.m;
    return {
      id: id,
      label: cls.label,
      gender: cls.gender,
      image: image,
      name: pickOne(names, rng),
    };
  }

  function spriteSlug(mon) {
    if (mon.sprite) {
      return mon.sprite;
    }
    if (SPRITE_SLUG[mon.id]) {
      return SPRITE_SLUG[mon.id];
    }
    return normalize(mon.name).replace(/[^a-z0-9]+/g, "");
  }

  function typeIcons(types) {
    if (!types || !types.length) {
      return "";
    }
    var html = "";
    var i;
    for (i = 0; i < types.length; i++) {
      var info = TYPE_SPRITE[normalize(types[i])];
      if (!info) {
        continue;
      }
      html +=
        '<img src="' +
        TYPE_BASE +
        info.file +
        '" alt="' +
        info.label +
        '" style="height:12px;width:auto;max-width:72px;vertical-align:middle">';
    }
    if (!html) {
      return "";
    }
    return (
      '<span style="display:flex;gap:3px;justify-content:center;align-items:center;flex-wrap:wrap">' +
      html +
      "</span>"
    );
  }

  function monCell(mon) {
    return (
      '<div class="npc-mon" style="background:var(--bg4);border-radius:8px;padding:10px 8px;display:flex;flex-direction:column;align-items:center;gap:6px">' +
      '<div style="width:100%;height:88px;display:flex;align-items:center;justify-content:center">' +
      '<img src="' +
      SPRITE_BASE +
      spriteSlug(mon) +
      '.gif" alt="' +
      mon.name +
      '" style="max-height:80px;max-width:80px">' +
      "</div>" +
      '<div style="color:var(--tx2);font-family:var(--poppins);font-weight:700;font-size:.9rem;text-align:center">' +
      mon.name +
      "</div>" +
      typeIcons(mon.types) +
      "</div>"
    );
  }

  function formatNpcCard(trainer, team, meta) {
    const habitatLabel = HABITAT_LABEL[meta.habitat] || meta.habitat;
    const cells = [];
    var i;
    for (i = 0; i < team.length; i++) {
      cells.push(monCell(team[i]));
    }
    return (
      '<div class="npc-card" style="background:var(--bg3);border-radius:10px;padding:18px;font-family:var(--poppins);width:100%;max-width:652px;box-sizing:border-box">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
      '<div style="background:linear-gradient(to right,#3e9987,#834b79);color:var(--tx2);font-weight:700;text-transform:uppercase;font-size:.8rem;letter-spacing:.04em;padding:5px 12px;border-radius:4px">' +
      trainer.label +
      "</div>" +
      '<div style="color:var(--tx1);font-size:.8rem;text-transform:uppercase">' +
      habitatLabel +
      " · dificultad " +
      meta.difficulty +
      "</div>" +
      "</div>" +
      '<div style="color:var(--tx2);font-family:var(--josefin);font-weight:700;text-transform:uppercase;font-size:1.8rem;margin:10px 0 14px">' +
      trainer.name +
      "</div>" +
      '<div style="background:var(--bg4);border-radius:8px;overflow:hidden;margin-bottom:14px;display:flex;justify-content:center">' +
      '<img src="' +
      trainer.image +
      '" alt="' +
      trainer.label +
      '" referrerpolicy="no-referrer" style="width:100%;height:auto;display:block">' +
      "</div>" +
      '<div class="npc-team" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">' +
      cells.join("") +
      "</div>" +
      "</div>"
    );
  }

  function processNpc(text, rng, list) {
    var pokemonList = list || POKEMON;
    const parsed = parseNpc(text);
    if (typeof parsed === "string") {
      return parsed;
    }
    if (!pokemonList.length) {
      return "Error: no se pudo cargar pokemon.json.";
    }
    const trainer = pickTrainer(parsed.habitat, rng);
    const team = pickTeam(parsed.habitat, parsed.difficulty, rng, pokemonList);
    if (!team.length) {
      return "No hay Pokémon para armar ese equipo.";
    }
    return formatNpcCard(trainer, team, parsed);
  }

  function topicIdFromUrl() {
    var href = "";
    if (global.location && global.location.href) {
      href = global.location.href;
    }
    var urlMatch = href.match(/\.com\/(t\d+-)/);
    if (urlMatch) {
      return urlMatch[1];
    }
    return "";
  }

  function resolvePostId(customPostId, fallbackPostId) {
    if (customPostId) {
      return customPostId;
    }
    if (fallbackPostId) {
      return fallbackPostId;
    }
    return "";
  }

  function buildSeed(topicId, postId, tagId, index) {
    return String(topicId || "") + String(postId || "") + String(tagId || "") + "-" + index;
  }

  function postIdFromEl($this) {
    var customId = "";
    var $custom = $this.closest(".custom-post");
    if ($custom.length) {
      customId = $custom.attr("id") || "";
    }
    var fallbackId = "";
    var closestPostRow = $this.closest("div.post").filter(function () {
      return [...this.classList].some(function (cls) {
        return /^row\d+$/.test(cls);
      });
    });
    if (closestPostRow.length) {
      fallbackId = closestPostRow.attr("id") || "";
    }
    return resolvePostId(customId, fallbackId);
  }

  function postDateFromEl($this) {
    var $root = $this.closest(".custom-post");
    if (!$root.length) {
      $root = $this.closest("div.post");
    }
    var attr = $root.find(".date").first().attr("data-date");
    if (!attr) {
      attr = $root.find("[data-date]").first().attr("data-date");
    }
    return parseForumDate(attr);
  }

  function listForVersion(version) {
    if (!version || !version.url) {
      return POKEMON;
    }
    if (
      !Object.prototype.hasOwnProperty.call(VERSION_CACHE, version.url) ||
      VERSION_CACHE[version.url] === null
    ) {
      return null;
    }
    return pokemonListFromData(VERSION_CACHE[version.url]);
  }

  function renderNpcBlock(rawText, tagId, seed, list) {
    if (typeof Math.seedrandom !== "function") {
      return '<div class="customroll-result">Error: seedrandom no está cargado.</div>';
    }
    var rng = new Math.seedrandom(seed);
    var html =
      '<div class="customroll-result">' + processNpc(rawText, rng, list) + "</div>";
    if (tagId) {
      html =
        '<div class="customroll-id">ID de la tirada:&nbsp;<span style="color:var(--tx5)">' +
        tagId +
        "</span></div>" +
        html;
    }
    return html;
  }

  function renderJob(job) {
    var list = listForVersion(job.version);
    if (!list) {
      job.$el.replaceWith(
        '<div class="customroll-result">Error: no se pudo cargar la versión de fauna.</div>'
      );
      return;
    }
    job.$el.replaceWith(renderNpcBlock(job.rawText, job.tagId, job.seed, list));
  }

  function bindNpcs($) {
    var topicId = topicIdFromUrl();
    var jobs = [];
    var urlSet = {};
    var indexInPost = {};

    $("npc").each(function () {
      var $this = $(this);
      var rawText = $this.text().trim();
      var parentId = postIdFromEl($this);
      var tagId = $this.attr("id");
      if (!tagId) {
        tagId = "";
      }
      var countKey = parentId || "__none";
      if (!Object.prototype.hasOwnProperty.call(indexInPost, countKey)) {
        indexInPost[countKey] = 0;
      }
      var index = indexInPost[countKey];
      indexInPost[countKey] += 1;
      var version = pickVersion(versionsFromCurrent(), postDateFromEl($this));
      if (version && version.url) {
        urlSet[version.url] = true;
      }
      jobs.push({
        $el: $this,
        rawText: rawText,
        tagId: tagId,
        seed: buildSeed(topicId, parentId, tagId, index),
        version: version,
      });
    });

    function renderAll() {
      var i;
      for (i = 0; i < jobs.length; i++) {
        renderJob(jobs[i]);
      }
    }

    var urls = Object.keys(urlSet);
    if (!urls.length) {
      renderAll();
      return;
    }
    var pending = urls.length;
    function tick() {
      pending -= 1;
      if (pending <= 0) {
        renderAll();
      }
    }
    var u;
    for (u = 0; u < urls.length; u++) {
      loadVersionData(urls[u], tick, tick);
    }
  }

  if (typeof global.$ === "function") {
    global.$(function () {
      loadPokemonData(
        function () {
          bindNpcs(global.$);
        },
        function () {
          global.$("npc").replaceWith(
            '<div class="customroll-result">Error: no se pudo cargar pokemon.json.</div>'
          );
        }
      );
    });
  }

  if (typeof module === "object" && module.exports) {
    module.exports = {
      parseNpc: parseNpc,
      difficultyRecipe: difficultyRecipe,
      pickTeam: pickTeam,
      pickTrainer: pickTrainer,
      classesForHabitat: classesForHabitat,
      formatNpcCard: formatNpcCard,
      processNpc: processNpc,
      parseForumDate: parseForumDate,
      pickVersion: pickVersion,
      applyPokemonData: applyPokemonData,
      CLASSES: CLASSES,
      HABITATS: HABITATS,
    };
  }
})();
