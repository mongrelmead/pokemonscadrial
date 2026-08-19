(function () {
  var global = globalThis;
  if (typeof window !== "undefined") {
    global = window;
  }

  const ACCENTS = /[áéíóúüñ]/g;
  const ACCENT_MAP = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n" };

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

  const STAGE_WEIGHT = {
    basica: 50,
    unica: 22,
    uno: 20,
    dos: 8,
  };

  const STAGE_ORDER = ["basica", "unica", "uno", "dos"];

  const SPRITE_BASE = "https://play.pokemonshowdown.com/sprites/ani/";
  const SPRITE_SHINY_BASE =
    "https://play.pokemonshowdown.com/sprites/ani-shiny/";
  const SHINY_CHANCE = 0.01;
  const COORDINATOR_SHINY_CHANCE = 0.11;
  const KIND_WEIGHT = { pokemon: 85, mega: 5, item: 5, encounter: 5 };
  const MASTERBALL_CHANCE = 0.01;
  const CHERISHBALL_CHANCE = 0.05;
  const MERCHANT_COUNT = 6;
  const MERCHANT_DISCOUNTS = [10, 20, 30, 40, 50, 60];
  const MERCHANT_MASTER_CHANCE = 0.01;
  const MERCHANT_MASTER_PRICE = 99999;
  const MERCHANT_MEGA_CHANCE = 0.05;
  const MERCHANT_MEGA_PRICE = 20000;
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
  const MERCHANT_NAMES = {
    m: [
      "Mateo",
      "Andrés",
      "Hugo",
      "Leo",
      "Nicolás",
      "Diego",
      "Pablo",
      "Sergio",
      "Tomás",
      "Bruno",
    ],
    f: [
      "Lucía",
      "Elena",
      "Marina",
      "Clara",
      "Sofía",
      "Valeria",
      "Nora",
      "Paula",
      "Inés",
      "Marta",
    ],
  };
  const MERCHANT_PORTRAITS = {
    m: [
      "https://archives.bulbagarden.net/media/upload/d/d9/VSCollector.png",
      "https://archives.bulbagarden.net/media/upload/5/52/VSBackpacker.png",
      "https://archives.bulbagarden.net/media/upload/2/20/VSMonsieur.png",
      "https://archives.bulbagarden.net/media/upload/4/47/VSOwner.png",
    ],
    f: [
      "https://archives.bulbagarden.net/media/upload/7/7b/VSMadame.png",
      "https://archives.bulbagarden.net/media/upload/5/5f/VSLady_ORAS.png",
    ],
  };
  const STAFF_RANK_TOKENS = [
    "admin",
    "administrador",
    "staff",
    "moderador",
    "fundador",
  ];
  const ENCOUNTER_SUBTYPES = {
    mercader: true,
    mision: true,
    pokemon: true,
    intercambio: true,
  };
  const DATA_URL =
    "https://raw.githubusercontent.com/mongrelmead/pokemonscadrial/refs/heads/main/data/pokemon-v1.json";
  const ITEMS_URL =
    "https://raw.githubusercontent.com/mongrelmead/pokemonscadrial/refs/heads/main/data/items.json";
  const SPRITE_SLUG = {
    29: "nidoranf",
    32: "nidoranm",
  };
  const TYPE_BASE = "https://images.wikidexcdn.net/mwuploads/wikidex/";
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

  var POKEMON = [];
  var ITEMS = [];
  var CURRENT_DATA = null;
  var VERSION_CACHE = {};

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
      var isoHour = 0;
      var isoMinute = 0;
      var isoSecond = 0;
      if (iso[4]) {
        isoHour = Number(iso[4]);
      }
      if (iso[5]) {
        isoMinute = Number(iso[5]);
      }
      if (iso[6]) {
        isoSecond = Number(iso[6]);
      }
      return new Date(
        Number(iso[1]),
        Number(iso[2]) - 1,
        Number(iso[3]),
        isoHour,
        isoMinute,
        isoSecond
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
    var esSecond = 0;
    if (es[6]) {
      esSecond = Number(es[6]);
    }
    return new Date(
      Number(es[3]),
      month,
      Number(es[1]),
      Number(es[4]),
      Number(es[5]),
      esSecond
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

  function normalize(value) {
    return String(value)
      .toLowerCase()
      .replace(ACCENTS, function (ch) {
        return ACCENT_MAP[ch];
      })
      .trim();
  }

  function normalizeRank(value) {
    var raw = "";
    if (value != null) {
      raw = value;
    }
    var text = String(raw);
    text = text
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&")
      .replace(/&nbsp;/gi, " ");
    text = text.replace(/<[^>]*>/g, " ");
    return normalize(text).replace(/\s+/g, " ");
  }

  function parseTest(raw) {
    if (raw == null) {
      return null;
    }
    const parts = splitParts(raw);
    if (!parts.length) {
      return null;
    }
    if (parts[0] === "objeto" && parts.length === 1) {
      return { kind: "item", subtype: null };
    }
    if (parts[0] === "megapiedra" && parts.length === 1) {
      return { kind: "mega", subtype: null };
    }
    if (parts[0] === "encuentro") {
      if (parts.length === 1) {
        return { kind: "encounter", subtype: null, extras: null };
      }
      if (!ENCOUNTER_SUBTYPES[parts[1]]) {
        return null;
      }
      var extras = null;
      if (parts[1] === "mercader") {
        extras = { master: false, mega: false };
        var i;
        for (i = 2; i < parts.length; i++) {
          if (parts[i] === "masterball") {
            extras.master = true;
          } else if (parts[i] === "megapiedra") {
            extras.mega = true;
          } else {
            return null;
          }
        }
      } else if (parts.length > 2) {
        return null;
      }
      return { kind: "encounter", subtype: parts[1], extras: extras };
    }
    return null;
  }

  function isStaffRank(rank) {
    var clean = normalizeRank(rank);
    var i;
    for (i = 0; i < STAFF_RANK_TOKENS.length; i++) {
      if (clean.indexOf(STAFF_RANK_TOKENS[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  function pickOutcomeKind(rng, forced) {
    if (
      forced === "pokemon" ||
      forced === "mega" ||
      forced === "item" ||
      forced === "encounter"
    ) {
      return forced;
    }
    var roll = rng() * 100;
    if (roll < KIND_WEIGHT.pokemon) {
      return "pokemon";
    }
    if (roll < KIND_WEIGHT.pokemon + KIND_WEIGHT.mega) {
      return "mega";
    }
    if (
      roll <
      KIND_WEIGHT.pokemon + KIND_WEIGHT.mega + KIND_WEIGHT.item
    ) {
      return "item";
    }
    return "encounter";
  }

  function stonesForHabitat(habitat, pokemonList, items) {
    var byId = {};
    var source = pokemonList || [];
    var i;
    for (i = 0; i < source.length; i++) {
      byId[source[i].id] = source[i];
    }
    var out = [];
    var list = items || [];
    for (i = 0; i < list.length; i++) {
      var item = list[i];
      if (!item || item.mega_species == null) {
        continue;
      }
      if (item.salvaje === false) {
        continue;
      }
      var mon = byId[item.mega_species];
      if (!mon || mon.habitat !== habitat) {
        continue;
      }
      if (mon.stage === "legendario") {
        continue;
      }
      out.push(item);
    }
    return out;
  }

  function isSpecialItem(item) {
    return (
      normalize(item.effect_value) === "especial" ||
      normalize(item.effect_label) === "especial"
    );
  }

  function fieldItemPool(items) {
    var out = [];
    var list = items || [];
    var i;
    for (i = 0; i < list.length; i++) {
      var item = list[i];
      if (!item || item.mega_species != null) {
        continue;
      }
      if (item.salvaje === false) {
        continue;
      }
      if (item.id === "safariball") {
        continue;
      }
      if (isSpecialItem(item)) {
        continue;
      }
      if (typeof item.price !== "number") {
        continue;
      }
      out.push(item);
    }
    return out;
  }

  function findItem(items, id) {
    var list = items || [];
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].id === id && list[i].salvaje !== false) {
        return list[i];
      }
    }
    return null;
  }

  function pickWeighted(list, rng, weightOf) {
    var total = 0;
    var i;
    for (i = 0; i < list.length; i++) {
      total += weightOf(list[i]);
    }
    if (!total) {
      return null;
    }
    var roll = rng() * total;
    for (i = 0; i < list.length; i++) {
      roll -= weightOf(list[i]);
      if (roll < 0) {
        return list[i];
      }
    }
    return list[list.length - 1];
  }

  function pickFieldItem(items, rng) {
    var rare = rng();
    if (rare < MASTERBALL_CHANCE) {
      var master = findItem(items, "masterball");
      if (master) {
        return master;
      }
    }
    if (rare < MASTERBALL_CHANCE + CHERISHBALL_CHANCE) {
      var cherish = findItem(items, "cherishball");
      if (cherish) {
        return cherish;
      }
    }
    var pool = fieldItemPool(items);
    if (!pool.length) {
      return null;
    }
    return pickWeighted(pool, rng, function (item) {
      return 1 / item.price;
    });
  }

  function withTestMark(html, forced) {
    if (!forced) {
      return html;
    }
    return '<span style="color:red">(TEST)</span> ' + html;
  }

  function formatItemResult(item) {
    var img = "";
    if (item.img) {
      img =
        '<br><img src="' +
        item.img +
        '" alt="' +
        item.name +
        '" style="height:48px;width:auto;vertical-align:middle">';
    }
    return "¡Has encontrado: <b>" + item.name + "</b>!" + img;
  }

  function merchantStorePool(items) {
    var out = [];
    var list = items || [];
    var i;
    for (i = 0; i < list.length; i++) {
      var item = list[i];
      if (!item || item.store !== true) {
        continue;
      }
      if (typeof item.price !== "number") {
        continue;
      }
      if (item.mega_species != null) {
        continue;
      }
      if (isSpecialItem(item)) {
        continue;
      }
      out.push(item);
    }
    return out;
  }

  function shuffleList(list, rng) {
    var copy = list.slice();
    var i;
    for (i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function pickUniqueItems(pool, count, rng) {
    var left = pool.slice();
    var out = [];
    var i;
    for (i = 0; i < count; i++) {
      if (!left.length) {
        break;
      }
      var idx = Math.floor(rng() * left.length);
      out.push(left[idx]);
      left.splice(idx, 1);
    }
    return out;
  }

  function discountedRow(item, discount) {
    return {
      item: item,
      discount: discount,
      original: item.price,
      price: Math.floor((item.price * (100 - discount)) / 100),
    };
  }

  function specialRow(item, price) {
    return {
      item: item,
      discount: null,
      original: null,
      price: price,
    };
  }

  function pickFreeStockIndex(stock, taken, rng) {
    var free = [];
    var i;
    for (i = 0; i < stock.length; i++) {
      if (i !== taken) {
        free.push(i);
      }
    }
    if (!free.length) {
      return 0;
    }
    return free[Math.floor(rng() * free.length)];
  }

  function pickMerchantStock(items, habitat, pokemonList, rng, extras) {
    var pool = merchantStorePool(items);
    var chosen = pickUniqueItems(pool, MERCHANT_COUNT, rng);
    var discounts = shuffleList(MERCHANT_DISCOUNTS, rng);
    var stock = [];
    var i;
    for (i = 0; i < chosen.length; i++) {
      var discount = 10;
      if (i < discounts.length) {
        discount = discounts[i];
      }
      stock.push(discountedRow(chosen[i], discount));
    }
    var forceMaster = false;
    var forceMega = false;
    if (extras) {
      if (extras.master) {
        forceMaster = true;
      }
      if (extras.mega) {
        forceMega = true;
      }
    }
    var taken = -1;
    if (forceMaster || rng() < MERCHANT_MASTER_CHANCE) {
      var master = findItem(items, "masterball");
      if (master && stock.length) {
        taken = pickFreeStockIndex(stock, taken, rng);
        stock[taken] = specialRow(master, MERCHANT_MASTER_PRICE);
      }
    }
    if (forceMega || rng() < MERCHANT_MEGA_CHANCE) {
      var stones = stonesForHabitat(habitat, pokemonList, items);
      if (stones.length && stock.length) {
        var megaIndex = pickFreeStockIndex(stock, taken, rng);
        stock[megaIndex] = specialRow(pickOne(stones, rng), MERCHANT_MEGA_PRICE);
      }
    }
    return stock;
  }

  function pickMerchantFace(rng) {
    var gender = "m";
    if (rng() >= 0.5) {
      gender = "f";
    }
    var names = MERCHANT_NAMES[gender];
    var portraits = MERCHANT_PORTRAITS[gender];
    return {
      name: pickOne(names, rng),
      image: pickOne(portraits, rng),
    };
  }

  function merchantItemCell(row) {
    var img = "";
    if (row.item.img) {
      img =
        '<div style="width:100%;height:72px;display:flex;align-items:center;justify-content:center">' +
        '<img src="' +
        row.item.img +
        '" alt="' +
        row.item.name +
        '" style="max-height:64px;max-width:64px">' +
        "</div>";
    }
    var priceHtml = "<div>₽" + row.price + "</div>";
    if (row.original != null) {
      priceHtml =
        "<div><s>₽" +
        row.original +
        "</s></div>" +
        '<div style="color:var(--tx2);font-weight:700">₽' +
        row.price +
        "</div>";
    }
    return (
      '<div class="npc-mon" style="background:var(--bg4);border-radius:8px;padding:10px 8px;display:flex;flex-direction:column;align-items:center;gap:6px">' +
      img +
      '<div style="color:var(--tx2);font-family:var(--poppins);font-weight:700;font-size:.9rem;text-align:center">' +
      row.item.name +
      "</div>" +
      '<div style="text-align:center;font-size:.85rem">' +
      priceHtml +
      "</div>" +
      "</div>"
    );
  }

  function formatMerchantResult(stock, habitat, rng) {
    var face = pickMerchantFace(rng);
    var habitatLabel = habitat;
    if (HABITAT_LABEL[habitat]) {
      habitatLabel = HABITAT_LABEL[habitat];
    }
    var cells = [];
    var i;
    for (i = 0; i < stock.length; i++) {
      cells.push(merchantItemCell(stock[i]));
    }
    return (
      '<div class="npc-card" style="background:var(--bg3);border-radius:10px;padding:18px;font-family:var(--poppins);width:100%;max-width:652px;box-sizing:border-box">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
      '<div style="background:linear-gradient(to right,#3e9987,#834b79);color:var(--tx2);font-weight:700;text-transform:uppercase;font-size:.8rem;letter-spacing:.04em;padding:5px 12px;border-radius:4px">' +
      "Mercader" +
      "</div>" +
      '<div style="color:var(--tx1);font-size:.8rem;text-transform:uppercase">' +
      habitatLabel +
      "</div>" +
      "</div>" +
      '<div style="color:var(--tx2);font-family:var(--josefin);font-weight:700;text-transform:uppercase;font-size:1.8rem;margin:10px 0 14px">' +
      face.name +
      "</div>" +
      '<div style="background:var(--bg4);border-radius:8px;overflow:hidden;margin-bottom:14px;display:flex;justify-content:center">' +
      '<img src="' +
      face.image +
      '" alt="Mercader" referrerpolicy="no-referrer" style="width:100%;height:auto;display:block">' +
      "</div>" +
      '<div class="npc-team" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">' +
      cells.join("") +
      "</div>" +
      "</div>"
    );
  }

  function pickEncounterSubtype(rng, forced) {
    if (forced) {
      return forced;
    }
    return pickOne(["mercader", "mision", "pokemon", "intercambio"], rng);
  }

  function applyItemsData(data) {
    if (data && Object.prototype.toString.call(data.items) === "[object Array]") {
      ITEMS = data.items;
      return;
    }
    if (Object.prototype.toString.call(data) === "[object Array]") {
      ITEMS = data;
    }
  }

  function loadItemsData(onDone) {
    fetchJson(
      ITEMS_URL,
      function (data) {
        applyItemsData(data);
        if (typeof onDone === "function") {
          onDone();
        }
      },
      function () {
        ITEMS = [];
        if (typeof onDone === "function") {
          onDone();
        }
      }
    );
  }

  function shinyChanceForRank(rank) {
    if (normalizeRank(rank).indexOf("coordinador") !== -1) {
      return COORDINATOR_SHINY_CHANCE;
    }
    return SHINY_CHANCE;
  }

  function posterRankFromEl($this) {
    var $root = $this.closest(".custom-post");
    if (!$root.length) {
      $root = $this.closest("div.post");
    }
    return $root.attr("data-poster-rank") || "";
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

  function parseSalvaje(text) {
    const parts = splitParts(text);
    if (parts.length !== 2) {
      return "Formato inválido de salvaje.";
    }

    const habitat = HABITAT_ALIAS[parts[0]];
    if (!habitat) {
      return "Habitat desconocido: " + parts[0];
    }

    if (!/^[12]$/.test(parts[1])) {
      return "Cantidad inválida.";
    }

    return {
      habitat: habitat,
      count: parseInt(parts[1], 10),
    };
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

  function stagesIn(pool) {
    const present = {};
    for (let i = 0; i < pool.length; i++) {
      present[pool[i].stage] = true;
    }
    return present;
  }

  function pickStage(present, rng) {
    var total = 0;
    var i;
    var stage;
    const usable = [];
    for (i = 0; i < STAGE_ORDER.length; i++) {
      stage = STAGE_ORDER[i];
      if (present[stage]) {
        usable.push(stage);
        total += STAGE_WEIGHT[stage];
      }
    }
    if (!usable.length) {
      return "";
    }
    var roll = rng() * total;
    for (i = 0; i < usable.length; i++) {
      stage = usable[i];
      roll -= STAGE_WEIGHT[stage];
      if (roll < 0) {
        return stage;
      }
    }
    return usable[usable.length - 1];
  }

  function ofStage(pool, stage) {
    const out = [];
    for (let i = 0; i < pool.length; i++) {
      if (pool[i].stage === stage) {
        out.push(pool[i]);
      }
    }
    return out;
  }

  function pickOne(list, rng) {
    return list[Math.floor(rng() * list.length)];
  }

  function pickEncounters(habitat, count, rng, list, shinyChance) {
    const pool = poolFor(habitat, list);
    const present = stagesIn(pool);
    const picked = [];
    const used = {};
    var attempts = 0;

    while (picked.length < count && attempts < 20) {
      attempts += 1;
      const stage = pickStage(present, rng);
      var candidates = ofStage(pool, stage);
      if (picked.length) {
        const unused = [];
        for (let i = 0; i < candidates.length; i++) {
          if (!used[candidates[i].id]) {
            unused.push(candidates[i]);
          }
        }
        if (unused.length) {
          candidates = unused;
        }
      }
      if (!candidates.length) {
        continue;
      }
      const mon = pickOne(candidates, rng);
      picked.push({
        id: mon.id,
        name: mon.name,
        habitat: mon.habitat,
        stage: mon.stage,
        sprite: mon.sprite,
        types: mon.types,
        shiny: rng() < shinyChanceOrDefault(shinyChance),
      });
      used[mon.id] = true;
    }

    return picked;
  }

  function shinyChanceOrDefault(shinyChance) {
    if (shinyChance == null) {
      return SHINY_CHANCE;
    }
    return shinyChance;
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

  function nameText(mon) {
    var shinyText = "";
    if (mon.shiny) {
      shinyText = " shiny";
    }
    return "<b>" + mon.name + "</b>" + shinyText;
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
      '<span class="salvaje-types" style="display:flex;gap:3px;justify-content:center;align-items:center">' +
      html +
      "</span>"
    );
  }

  function spriteImg(mon) {
    var shinyText = "";
    var spriteBase = SPRITE_BASE;
    if (mon.shiny) {
      shinyText = " shiny";
      spriteBase = SPRITE_SHINY_BASE;
    }
    var types = typeIcons(mon.types);
    return (
      '<span class="salvaje-mon" style="display:inline-block;text-align:center;vertical-align:top;margin:0 6px">' +
      '<img src="' +
      spriteBase +
      spriteSlug(mon) +
      '.gif" alt="' +
      mon.name +
      shinyText +
      '">' +
      typesBreak(types) +
      "</span>"
    );
  }

  function typesBreak(types) {
    if (!types) {
      return "";
    }
    return "<br>" + types;
  }

  function formatResult(mons) {
    if (!mons.length) {
      return "No hay Pokémon en ese habitat.";
    }
    if (mons.length === 1) {
      return (
        "¡Te has topado con un " +
        nameText(mons[0]) +
        "!<br>" +
        spriteImg(mons[0])
      );
    }

    const names = [];
    const sprites = [];
    for (let i = 0; i < mons.length; i++) {
      names.push("un " + nameText(mons[i]));
      sprites.push(spriteImg(mons[i]));
    }
    return (
      "¡Te has topado con " + names.join(" y ") + "!<br>" + sprites.join("")
    );
  }

  function processSalvaje(text, rng, list, rank, opts) {
    var pokemonList = list || POKEMON;
    if (!pokemonList.length) {
      return "Error: no se pudo cargar pokemon.json.";
    }
    const parsed = parseSalvaje(text);
    if (typeof parsed === "string") {
      return parsed;
    }

    var items = ITEMS;
    if (opts && opts.items) {
      items = opts.items;
    }
    var forced = null;
    if (opts && opts.test) {
      forced = parseTest(opts.test);
    }
    if (items && items.length) {
      var kind = pickOutcomeKind(rng, forced && forced.kind);
      if (kind === "mega") {
        var stones = stonesForHabitat(parsed.habitat, pokemonList, items);
        if (stones.length) {
          return withTestMark(formatItemResult(pickOne(stones, rng)), forced);
        }
      } else if (kind === "item") {
        var found = pickFieldItem(items, rng);
        if (found) {
          return withTestMark(formatItemResult(found), forced);
        }
      } else if (kind === "encounter") {
        var subtype = null;
        if (forced) {
          subtype = pickEncounterSubtype(rng, forced.subtype);
        } else {
          subtype = pickEncounterSubtype(rng, null);
        }
        if (subtype === "mercader") {
          var extras = null;
          if (forced) {
            extras = forced.extras;
          }
          var stock = pickMerchantStock(
            items,
            parsed.habitat,
            pokemonList,
            rng,
            extras
          );
          if (stock.length) {
            return withTestMark(
              formatMerchantResult(stock, parsed.habitat, rng),
              forced
            );
          }
        }
      }
    }

    return withTestMark(
      formatResult(
        pickEncounters(
          parsed.habitat,
          parsed.count,
          rng,
          pokemonList,
          shinyChanceForRank(rank)
        )
      ),
      forced
    );
  }

  function topicIdFromUrl() {
    var urlMatch = null;
    if (global.location && global.location.href) {
      urlMatch = global.location.href.match(/\.com\/(t\d+-)/);
    }
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
    return (
      String(topicId || "") +
      String(postId || "") +
      String(tagId || "") +
      "-" +
      index
    );
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

  function renderSalvajeBlock(rawText, tagId, seed, list, rank, opts) {
    if (typeof Math.seedrandom !== "function") {
      return '<div class="customroll-result">Error: seedrandom no está cargado.</div>';
    }

    var rng = new Math.seedrandom(seed);
    var html =
      '<div class="customroll-result">' +
      processSalvaje(rawText, rng, list, rank, opts) +
      "</div>";
    if (tagId) {
      html =
        '<div class="customroll-id">ID de la tirada:&nbsp;<span style="color:var(--tx5)">' +
        tagId +
        "</span></div>" +
        html;
    }
    return html;
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

  function renderJob(job) {
    var list = listForVersion(job.version);
    if (!list) {
      job.$el.replaceWith(
        '<div class="customroll-result">Error: no se pudo cargar la versión de fauna.</div>'
      );
      return;
    }
    job.$el.replaceWith(
      renderSalvajeBlock(job.rawText, job.tagId, job.seed, list, job.rank, {
        test: job.test,
        items: ITEMS,
      })
    );
  }

  function bindSalvajes($) {
    var topicId = topicIdFromUrl();
    var jobs = [];
    var urlSet = {};

    var indexInPost = {};

    $("salvaje").each(function () {
      var $this = $(this);
      var rawText = $this.text().trim();
      var parentId = postIdFromEl($this);
      var tagId = $this.attr("id");
      if (!tagId) {
        tagId = "";
      }
      var testAttr = $this.attr("test");
      if (!testAttr) {
        testAttr = "";
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
        test: testAttr,
        seed: buildSeed(topicId, parentId, tagId, index),
        version: version,
        rank: posterRankFromEl($this),
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
          loadItemsData(function () {
            bindSalvajes(global.$);
          });
        },
        function () {
          global.$("salvaje").replaceWith(
            '<div class="customroll-result">Error: no se pudo cargar pokemon.json.</div>'
          );
        }
      );
    });
  }

  if (typeof module === "object" && module.exports) {
    module.exports = {
      parseSalvaje: parseSalvaje,
      parseTest: parseTest,
      parseForumDate: parseForumDate,
      normalizeRank: normalizeRank,
      isStaffRank: isStaffRank,
      pickOutcomeKind: pickOutcomeKind,
      stonesForHabitat: stonesForHabitat,
      fieldItemPool: fieldItemPool,
      pickFieldItem: pickFieldItem,
      merchantStorePool: merchantStorePool,
      pickMerchantStock: pickMerchantStock,
      formatMerchantResult: formatMerchantResult,
      formatItemResult: formatItemResult,
      shinyChanceForRank: shinyChanceForRank,
      pickVersion: pickVersion,
      resolvePostId: resolvePostId,
      buildSeed: buildSeed,
      pickEncounters: pickEncounters,
      formatResult: formatResult,
      processSalvaje: processSalvaje,
      loadPokemonData: loadPokemonData,
      applyPokemonData: applyPokemonData,
      get POKEMON() {
        return POKEMON;
      },
      HABITATS: HABITATS,
      STAGE_WEIGHT: STAGE_WEIGHT,
    };
  }
})();
