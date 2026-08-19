(function () {
  var global = globalThis;
  if (typeof window !== "undefined") {
    global = window;
  }
  const ACCENTS = /[áéíóúüñ]/g;
  const ACCENT_MAP = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n" };

  const STAGE_ALIAS = {
    basica: "basica",
    basico: "basica",
    baby: "basica",
    uno: "uno",
    etapa1: "uno",
    1: "uno",
    unica: "unica",
    unico: "unica",
    dos: "dos",
    etapa2: "dos",
    2: "dos",
    especial: "especial",
    legendario: "legendario",
    legendaria: "legendario",
  };

  const STAGE_LABEL = {
    basica: "básica",
    uno: "uno",
    unica: "única",
    dos: "dos",
    especial: "especial",
    legendario: "legendario",
  };

  const TYPE_ALIAS = {
    normal: "normal",
    fuego: "fuego",
    fire: "fuego",
    agua: "agua",
    water: "agua",
    planta: "planta",
    hierba: "planta",
    grass: "planta",
    electrico: "electrico",
    electric: "electrico",
    hielo: "hielo",
    ice: "hielo",
    lucha: "lucha",
    fighting: "lucha",
    veneno: "veneno",
    poison: "veneno",
    tierra: "tierra",
    ground: "tierra",
    volador: "volador",
    flying: "volador",
    psiquico: "psiquico",
    psychic: "psiquico",
    bicho: "bicho",
    bug: "bicho",
    roca: "roca",
    rock: "roca",
    fantasma: "fantasma",
    ghost: "fantasma",
    dragon: "dragon",
    siniestro: "siniestro",
    oscuro: "siniestro",
    dark: "siniestro",
    acero: "acero",
    steel: "acero",
    hada: "hada",
    fairy: "hada",
  };

  const TYPE_LABEL = {
    normal: "normal",
    fuego: "fuego",
    agua: "agua",
    planta: "planta",
    electrico: "eléctrico",
    hielo: "hielo",
    lucha: "lucha",
    veneno: "veneno",
    tierra: "tierra",
    volador: "volador",
    psiquico: "psíquico",
    bicho: "bicho",
    roca: "roca",
    fantasma: "fantasma",
    dragon: "dragón",
    siniestro: "siniestro",
    acero: "acero",
    hada: "hada",
  };

  const TYPE_COLOR = {
    normal: "#A8A77A",
    fuego: "#EE8130",
    agua: "#6390F0",
    planta: "#7AC74C",
    electrico: "#F7D02C",
    hielo: "#96D9D6",
    lucha: "#C22E28",
    veneno: "#A33EA1",
    tierra: "#663300",
    volador: "#A98FF3",
    psiquico: "#F95587",
    bicho: "#A6B91A",
    roca: "#B6A136",
    fantasma: "#735797",
    dragon: "#6F35FC",
    siniestro: "#705746",
    acero: "#B7B7CE",
    hada: "#D685AD",
  };

  const HIT_STEPS = [10, 20, 30, 40, 50, 60, 70, 100, 150, 200, 250];
  const STAGE_RANK = {
    basica: 1,
    uno: 2,
    unica: 2,
    dos: 3,
    especial: 3.6,
    legendario: 6,
  };
  const MEGA_RANK = {
    uno: 2.5,
    unica: 2.5,
    dos: 3.3,
    especial: 4,
    legendario: 6.5,
  };
  const STAGE_CAP = {
    basica: 50,
    uno: 100,
    unica: 100,
    dos: 150,
    especial: 200,
    legendario: 250,
  };
  const HIT_DECAY = 0.42;
  const CRIT_CHANCE = 0.3;
  const MISS_MIN = 0.06;
  const MISS_MAX = 0.55;

  const CHART = {
    normal: { roca: 0.5, acero: 0.5, fantasma: 0 },
    fuego: {
      planta: 2,
      hielo: 2,
      bicho: 2,
      acero: 2,
      fuego: 0.5,
      agua: 0.5,
      roca: 0.5,
      dragon: 0.5,
    },
    agua: {
      fuego: 2,
      tierra: 2,
      roca: 2,
      agua: 0.5,
      planta: 0.5,
      dragon: 0.5,
    },
    planta: {
      agua: 2,
      tierra: 2,
      roca: 2,
      fuego: 0.5,
      planta: 0.5,
      veneno: 0.5,
      volador: 0.5,
      bicho: 0.5,
      dragon: 0.5,
      acero: 0.5,
    },
    electrico: {
      agua: 2,
      volador: 2,
      electrico: 0.5,
      planta: 0.5,
      dragon: 0.5,
      tierra: 0,
    },
    hielo: {
      planta: 2,
      tierra: 2,
      volador: 2,
      dragon: 2,
      fuego: 0.5,
      agua: 0.5,
      hielo: 0.5,
      acero: 0.5,
    },
    lucha: {
      normal: 2,
      hielo: 2,
      roca: 2,
      siniestro: 2,
      acero: 2,
      veneno: 0.5,
      volador: 0.5,
      psiquico: 0.5,
      bicho: 0.5,
      hada: 0.5,
      fantasma: 0,
    },
    veneno: {
      planta: 2,
      hada: 2,
      veneno: 0.5,
      tierra: 0.5,
      roca: 0.5,
      fantasma: 0.5,
      acero: 0,
    },
    tierra: {
      fuego: 2,
      electrico: 2,
      veneno: 2,
      roca: 2,
      acero: 2,
      planta: 0.5,
      bicho: 0.5,
      volador: 0,
    },
    volador: {
      planta: 2,
      lucha: 2,
      bicho: 2,
      electrico: 0.5,
      roca: 0.5,
      acero: 0.5,
    },
    psiquico: {
      lucha: 2,
      veneno: 2,
      psiquico: 0.5,
      acero: 0.5,
      siniestro: 0,
    },
    bicho: {
      planta: 2,
      psiquico: 2,
      siniestro: 2,
      fuego: 0.5,
      lucha: 0.5,
      veneno: 0.5,
      volador: 0.5,
      fantasma: 0.5,
      acero: 0.5,
      hada: 0.5,
    },
    roca: {
      fuego: 2,
      hielo: 2,
      volador: 2,
      bicho: 2,
      lucha: 0.5,
      tierra: 0.5,
      acero: 0.5,
    },
    fantasma: { psiquico: 2, fantasma: 2, siniestro: 0.5, normal: 0 },
    dragon: { dragon: 2, acero: 0.5, hada: 0 },
    siniestro: {
      psiquico: 2,
      fantasma: 2,
      lucha: 0.5,
      siniestro: 0.5,
      hada: 0.5,
    },
    acero: {
      hielo: 2,
      roca: 2,
      hada: 2,
      fuego: 0.5,
      agua: 0.5,
      electrico: 0.5,
      acero: 0.5,
    },
    hada: {
      lucha: 2,
      dragon: 2,
      siniestro: 2,
      fuego: 0.5,
      veneno: 0.5,
      acero: 0.5,
    },
  };

  const DAMAGE_IMG = {
    0: "https://i.ibb.co/0pzTgJtc/dados-00.png",
    10: "https://i.ibb.co/Y7Ysk5Yg/dados-10.png",
    20: "https://i.ibb.co/1YS2nWpm/dados-20.png",
    30: "https://i.ibb.co/xqX1HLnh/dados-30.png",
    40: "https://i.ibb.co/0j8rYQnW/dados-40.png",
    50: "https://i.ibb.co/4ZfTpZgK/dados-50.png",
    60: "https://i.ibb.co/nq1mCbKr/dados-60.png",
    70: "https://i.ibb.co/Fk8DbNNw/dados-70.png",
    100: "https://i.ibb.co/LXtkHby3/dados-100.png",
    150: "https://i.ibb.co/3YL2bSgx/dados-150.png",
    200: "https://i.ibb.co/HLs8YYvR/dados-200.png",
    250: "https://i.ibb.co/VdrS3cP/dados-250.png",
  };

  function normalize(value) {
    return String(value)
      .toLowerCase()
      .replace(ACCENTS, function (ch) {
        return ACCENT_MAP[ch];
      })
      .trim();
  }

  function normalizeRank(value) {
    var text = String(value == null ? "" : value);
    text = text
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&")
      .replace(/&nbsp;/gi, " ");
    text = text.replace(/<[^>]*>/g, " ");
    return normalize(text).replace(/\s+/g, " ");
  }

  function stageRank(stage, mega) {
    if (mega && MEGA_RANK[stage] != null) {
      return MEGA_RANK[stage];
    }
    return STAGE_RANK[stage];
  }

  function stageCap(stage) {
    return STAGE_CAP[stage];
  }

  function stageLabel(stage, mega) {
    var label = STAGE_LABEL[stage];
    if (!label) {
      return "";
    }
    if (mega) {
      return label + " mega";
    }
    return label;
  }

  function parseStageToken(token) {
    const pieces = String(token).split("-");
    var mega = false;
    var key = token;
    if (pieces.length === 2 && pieces[1] === "mega") {
      mega = true;
      key = pieces[0];
    } else if (pieces.length !== 1) {
      return "Etapa desconocida: " + token;
    }

    const stage = STAGE_ALIAS[key];
    if (!stage) {
      return "Etapa desconocida: " + token;
    }
    if (mega && MEGA_RANK[stage] == null) {
      return "Esta etapa no puede megaevolucionar.";
    }
    return {
      stage: stage,
      mega: mega,
    };
  }

  function professionDamageChance(rank) {
    var clean = normalizeRank(rank);
    if (clean.indexOf("alto mando") !== -1) {
      return 0.3;
    }
    if (clean.indexOf("entrenador") !== -1) {
      return 0.15;
    }
    return 0;
  }

  function nextHitStep(damage) {
    if (damage <= 0) {
      return 10;
    }
    var i;
    for (i = 0; i < HIT_STEPS.length; i++) {
      if (HIT_STEPS[i] > damage) {
        return HIT_STEPS[i];
      }
    }
    return HIT_STEPS[HIT_STEPS.length - 1];
  }

  function applyProfessionBump(damage, rng, rank) {
    var chance = professionDamageChance(rank);
    if (!chance || rng() >= chance) {
      return damage;
    }
    return nextHitStep(damage);
  }

  function posterRankFromEl($this) {
    var $root = $this.closest(".custom-post");
    if (!$root.length) {
      $root = $this.closest("div.post");
    }
    return $root.attr("data-poster-rank") || "";
  }

  function splitSide(raw) {
    const out = [];
    const parts = raw.split(",");
    for (let i = 0; i < parts.length; i++) {
      const token = normalize(parts[i]);
      if (token) {
        out.push(token);
      }
    }
    return out;
  }

  function parseAttack(text) {
    const chunks = String(text).split("|");
    if (chunks.length < 2) {
      return "Formato inválido de ataque.";
    }

    const left = splitSide(chunks[0]);
    const right = splitSide(chunks[1]);

    if (left.length < 2 || right.length < 2) {
      return "Formato inválido de ataque.";
    }
    if (left.length > 2) {
      return "El atacante solo puede declarar un tipo.";
    }
    if (right.length > 3) {
      return "El defensor puede tener como máximo dos tipos.";
    }

    const atk = parseStageToken(left[0]);
    if (typeof atk === "string") {
      return atk;
    }
    const def = parseStageToken(right[0]);
    if (typeof def === "string") {
      return def;
    }

    const atkType = TYPE_ALIAS[left[1]];
    if (!atkType) {
      return "Tipo desconocido: " + left[1];
    }

    const defTypes = [];
    for (let i = 1; i < right.length; i++) {
      const defType = TYPE_ALIAS[right[i]];
      if (!defType) {
        return "Tipo desconocido: " + right[i];
      }
      defTypes.push(defType);
    }

    return {
      atkStage: atk.stage,
      atkMega: atk.mega,
      defStage: def.stage,
      defMega: def.mega,
      atkType: atkType,
      defTypes: defTypes,
    };
  }

  function typeMultiplier(atkType, defTypes) {
    const row = CHART[atkType];
    let mult = 1;
    for (let i = 0; i < defTypes.length; i++) {
      const defType = defTypes[i];
      var factor = 1;
      if (row && defType in row) {
        factor = row[defType];
      }
      mult *= factor;
      if (!mult) {
        return 0;
      }
    }
    return mult;
  }

  function clamp(value, min, max) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }

  function typePosShift(mult) {
    if (mult <= 0.25) {
      return -0.22;
    }
    if (mult <= 0.5) {
      return -0.12;
    }
    if (mult <= 1) {
      return 0;
    }
    if (mult <= 2) {
      return 0.18;
    }
    return 0.32;
  }

  function missChance(atkRank, defRank, mult) {
    var miss = 0.22 - 0.045 * atkRank + 0.045 * defRank;
    if (mult <= 0.25) {
      miss += 0.12;
    } else {
      if (mult <= 0.5) {
        miss += 0.06;
      } else {
        if (mult > 2) {
          miss -= 0.14;
        } else {
          if (mult > 1) {
            miss -= 0.08;
          }
        }
      }
    }
    return clamp(miss, MISS_MIN, MISS_MAX);
  }

  function hitsForStage(stage) {
    var cap = STAGE_CAP[stage];
    var hits = [];
    var i;
    for (i = 0; i < HIT_STEPS.length; i++) {
      if (HIT_STEPS[i] <= cap) {
        hits.push(HIT_STEPS[i]);
      }
    }
    return hits;
  }

  function aimIndex(atkRank, defRank, mult, hitCount) {
    var pos = 0.28 + atkRank * 0.07;
    pos += (atkRank - defRank) * 0.18;
    pos += typePosShift(mult);
    pos = clamp(pos, 0.02, 0.98);
    return pos * (hitCount - 1);
  }

  function pickWeightedIndex(hits, aim, rng) {
    var weights = [];
    var total = 0;
    var i;
    for (i = 0; i < hits.length; i++) {
      var diff = i - aim;
      if (diff < 0) {
        diff = -diff;
      }
      var weight = Math.pow(HIT_DECAY, diff);
      weights.push(weight);
      total += weight;
    }

    var roll = rng() * total;
    var acc = 0;
    for (i = 0; i < weights.length; i++) {
      acc += weights[i];
      if (roll < acc) {
        return i;
      }
    }
    return hits.length - 1;
  }

  function resolveAttack(parsed, rng, rank) {
    var mult = typeMultiplier(parsed.atkType, parsed.defTypes);
    if (!mult) {
      return {
        parsed: parsed,
        mult: 0,
        immune: true,
        miss: false,
        crit: false,
        damage: 0,
      };
    }

    var atkRank = stageRank(parsed.atkStage, parsed.atkMega);
    var defRank = stageRank(parsed.defStage, parsed.defMega);
    var hits = hitsForStage(parsed.atkStage);
    var miss = rng() < missChance(atkRank, defRank, mult);
    if (miss) {
      return {
        parsed: parsed,
        mult: mult,
        immune: false,
        miss: true,
        crit: false,
        damage: applyProfessionBump(0, rng, rank),
      };
    }

    var idx = pickWeightedIndex(
      hits,
      aimIndex(atkRank, defRank, mult, hits.length),
      rng
    );
    var raw = hits[idx];
    var crit = rng() < CRIT_CHANCE;
    var damage = raw;
    if (crit) {
      if (idx < hits.length - 1) {
        damage = hits[idx + 1];
      }
    }

    return {
      parsed: parsed,
      mult: mult,
      immune: false,
      miss: false,
      crit: crit,
      raw: raw,
      damage: applyProfessionBump(damage, rng, rank),
    };
  }

  function boldText(text) {
    return "<b>" + text + "</b>";
  }

  function typeText(typeKey) {
    return (
      '<b style="color:' +
      TYPE_COLOR[typeKey] +
      '">' +
      TYPE_LABEL[typeKey] +
      "</b>"
    );
  }

  function formatResult(result) {
    const p = result.parsed;
    const defParts = [];
    for (let i = 0; i < p.defTypes.length; i++) {
      defParts.push(typeText(p.defTypes[i]));
    }

    var defTypesText = defParts[0];
    if (defParts.length > 1) {
      defTypesText = defParts.join(" y ");
    }

    var imgUrl = DAMAGE_IMG[result.damage];
    if (!imgUrl) {
      imgUrl = DAMAGE_IMG[0];
    }

    return (
      "etapa " +
      boldText(stageLabel(p.atkStage, p.atkMega)) +
      " (" +
      typeText(p.atkType) +
      ") vs etapa " +
      boldText(stageLabel(p.defStage, p.defMega)) +
      " (" +
      defTypesText +
      "):<br><img src=\"" +
      imgUrl +
      "\" alt=\"" +
      result.damage +
      "\">"
    );
  }

  function processAttack(text, rng, rank) {
    const parsed = parseAttack(text);
    if (typeof parsed === "string") {
      return parsed;
    }
    const resolved = resolveAttack(parsed, rng, rank);
    return formatResult(resolved);
  }

  function topicIdFromUrl() {
    var urlMatch = global.location.href.match(/\.com\/(t\d+-)/);
    if (urlMatch) {
      return urlMatch[1];
    }
    return "";
  }

  function renderAttackBlock(rawText, tagId, seed, rank) {
    if (typeof Math.seedrandom !== "function") {
      return '<div class="customroll-result">Error: seedrandom no está cargado.</div>';
    }

    var rng = new Math.seedrandom(seed);
    var html =
      '<div class="customroll-result">' +
      processAttack(rawText, rng, rank) +
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

  function bindAttacks($) {
    var topicId = topicIdFromUrl();

    $("ataque").each(function (index) {
      var $this = $(this);
      var rawText = $this.text().trim();

      var closestPostRow = $this.closest("div.post").filter(function () {
        return [...this.classList].some(function (cls) {
          return /^row\d+$/.test(cls);
        });
      });

      var parentId = closestPostRow.attr("id");
      if (!parentId) {
        parentId = "";
      }

      var tagId = $this.attr("id");
      if (!tagId) {
        tagId = "";
      }

      var rank = "";
      if (tagId !== "salvaje") {
        rank = posterRankFromEl($this);
      }

      $this.replaceWith(
        renderAttackBlock(
          rawText,
          tagId,
          topicId + parentId + tagId + "-" + index,
          rank
        )
      );
    });
  }

  if (typeof global.$ === "function") {
    global.$(function () {
      bindAttacks(global.$);
    });
  }

  if (typeof module === "object" && module.exports) {
    module.exports = {
      parseAttack: parseAttack,
      typeMultiplier: typeMultiplier,
      resolveAttack: resolveAttack,
      formatResult: formatResult,
      processAttack: processAttack,
      normalizeRank: normalizeRank,
      professionDamageChance: professionDamageChance,
      nextHitStep: nextHitStep,
      applyProfessionBump: applyProfessionBump,
      stageRank: stageRank,
      stageCap: stageCap,
      HIT_STEPS: HIT_STEPS,
      STAGE_RANK: STAGE_RANK,
      STAGE_CAP: STAGE_CAP,
      MEGA_RANK: MEGA_RANK,
    };
  }
})();