(function () {
  var global = globalThis;
  if (typeof window !== "undefined") {
    global = window;
  }

  const ACCENTS = /[áéíóúüñ]/g;
  const ACCENT_MAP = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n" };

  const GENEROUS = 0.6;
  const EASE = 0.2;
  const ABOVE = 0.5;
  const LEGENDARY_EFF = { 1: 0.05, 2: 0.08, 3: 0.2 };
  const SAFARI_CHANCE = 0.5;
  const TURN_MIN = 1;
  const TURN_MAX = 10;

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
    legendario: "legendario",
    legendaria: "legendario",
  };

  const STAGE_LABEL = {
    basica: "básica",
    uno: "uno",
    unica: "única",
    dos: "dos",
    legendario: "legendario",
  };

  const STAGE_RANK = {
    basica: 1,
    uno: 2,
    unica: 2,
    dos: 3,
    legendario: 4,
  };

  const STAGE_MAX_HP = {
    basica: 50,
    uno: 100,
    unica: 100,
    dos: 200,
    legendario: 1000,
  };

  const BALL_ALIAS = {
    pokeball: "pokeball",
    pokebola: "pokeball",
    poke: "pokeball",
    greatball: "greatball",
    superball: "greatball",
    superbola: "greatball",
    super: "greatball",
    great: "greatball",
    ultraball: "ultraball",
    ultrabola: "ultraball",
    ultra: "ultraball",
    fastball: "fastball",
    rapibola: "fastball",
    rapid: "fastball",
    fast: "fastball",
    rapi: "fastball",
    timerball: "timerball",
    turnobola: "timerball",
    timer: "timerball",
    masterball: "masterball",
    masterbola: "masterball",
    master: "masterball",
    repeatball: "repeatball",
    acopiobola: "repeatball",
    acopio: "repeatball",
    repeat: "repeatball",
    safariball: "safariball",
    safaribola: "safariball",
    safari: "safariball",
    luxuryball: "luxuryball",
    lujobola: "luxuryball",
    lujo: "luxuryball",
    luxury: "luxuryball",
    cherishball: "cherishball",
    gloriabola: "cherishball",
    gloria: "cherishball",
    cherish: "cherishball",
  };

  const BALLS = {
    pokeball: { label: "Pokébola", target: 1, mult: 1, kind: "hp" },
    greatball: { label: "Superbola", target: 2, mult: 1, kind: "hp" },
    ultraball: { label: "Ultrabola", target: 3, mult: 1, kind: "hp" },
    fastball: { label: "Rapibola", target: 2, mult: 1, kind: "fast" },
    timerball: { label: "Turnobola", target: 2, mult: 1, kind: "timer" },
    masterball: { label: "Masterbola", target: 3, mult: 1, kind: "master" },
    repeatball: { label: "Acopiobola", target: 3, mult: 1.25, kind: "hp" },
    safariball: { label: "Safaribola", target: 3, mult: 1, kind: "safari" },
    luxuryball: { label: "Lujobola", target: 3, mult: 1.5, kind: "hp" },
    cherishball: { label: "Gloriabola", target: 3, mult: 2, kind: "hp" },
  };

  const CAPTURE_IMG = {
    caught: "https://i.ibb.co/nqQSNzD9/dados-captura-exito.png",
    escaped: "https://i.ibb.co/B2GkpmPn/dados-captura-fallo.png",
  };

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

  function clamp(value, min, max) {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }

  function parseTurnToken(token) {
    const pieces = token.split(":");
    if (pieces.length !== 2 || pieces[0] !== "turno") {
      return null;
    }
    const raw = pieces[1];
    if (!/^-?\d+$/.test(raw)) {
      return null;
    }
    return parseInt(raw, 10);
  }

  function parseCapture(text) {
    const parts = splitParts(text);
    if (parts.length < 3 || parts.length > 4) {
      return "Formato inválido de captura.";
    }

    const ballKey = BALL_ALIAS[parts[0]];
    if (!ballKey) {
      return "Ball desconocida: " + parts[0];
    }

    const stage = STAGE_ALIAS[parts[1]];
    if (!stage) {
      return "Etapa desconocida: " + parts[1];
    }

    if (!/^\d+$/.test(parts[2])) {
      return "PS inválidos.";
    }
    const hp = parseInt(parts[2], 10);
    const maxHp = STAGE_MAX_HP[stage];
    if (hp > maxHp) {
      return "PS por encima del máximo de esa etapa.";
    }

    const ball = BALLS[ballKey];
    const needsTurn = ball.kind === "fast" || ball.kind === "timer";

    if (parts.length === 4) {
      if (!needsTurn) {
        return "Esta ball no admite el parámetro turno.";
      }
      const turn = parseTurnToken(parts[3]);
      if (turn === null) {
        return "Turno inválido.";
      }
      return {
        ball: ballKey,
        stage: stage,
        hp: hp,
        turn: clamp(turn, TURN_MIN, TURN_MAX),
      };
    }

    if (needsTurn) {
      return "Esta ball requiere el parámetro turno:n.";
    }

    return {
      ball: ballKey,
      stage: stage,
      hp: hp,
      turn: null,
    };
  }

  function familyRate(target, rank) {
    if (rank === 4) {
      return GENEROUS * LEGENDARY_EFF[target];
    }
    if (rank <= target) {
      return GENEROUS * (1 + EASE * (target - rank));
    }
    return GENEROUS * Math.pow(ABOVE, rank - target);
  }

  function rate0(ballKey, stage) {
    const rank = STAGE_RANK[stage];
    if (ballKey === "repeatball" && stage === "legendario") {
      return familyRate(BALLS.pokeball.target, rank);
    }
    const ball = BALLS[ballKey];
    return familyRate(ball.target, rank) * ball.mult;
  }

  function hpFactor(hp, maxHp) {
    return (3 * maxHp - 2 * hp) / (3 * maxHp);
  }

  function turnFactor(kind, turn) {
    const n = clamp(turn, TURN_MIN, TURN_MAX);
    if (kind === "fast") {
      return (11 - n) / 10;
    }
    return n / 10;
  }

  function captureChance(parsed) {
    const ball = BALLS[parsed.ball];
    if (ball.kind === "master") {
      return 1;
    }
    if (ball.kind === "safari") {
      return SAFARI_CHANCE;
    }

    const base = rate0(parsed.ball, parsed.stage);
    if (ball.kind === "fast" || ball.kind === "timer") {
      return clamp(base * turnFactor(ball.kind, parsed.turn), 0, 1);
    }

    return clamp(base * hpFactor(parsed.hp, STAGE_MAX_HP[parsed.stage]), 0, 1);
  }

  function shakeFromFail(chance, roll) {
    if (chance >= 1) {
      return "caught";
    }
    const failDepth = (roll - chance) / (1 - chance);
    if (failDepth < 0.25) {
      return "shake3";
    }
    if (failDepth < 0.5) {
      return "shake2";
    }
    if (failDepth < 0.75) {
      return "shake1";
    }
    return "shake0";
  }

  function resolveCapture(parsed, rng) {
    const chance = captureChance(parsed);
    const roll = rng();
    const caught = roll < chance;
    var shake = "caught";
    if (!caught) {
      shake = shakeFromFail(chance, roll);
    }
    return {
      parsed: parsed,
      chance: chance,
      roll: roll,
      caught: caught,
      shake: shake,
    };
  }

  function boldText(text) {
    return "<b>" + text + "</b>";
  }

  function formatResult(result) {
    const p = result.parsed;
    const ball = BALLS[p.ball];
    var imgUrl = CAPTURE_IMG.escaped;
    var imgAlt = "escapó";
    if (result.caught) {
      imgUrl = CAPTURE_IMG.caught;
      imgAlt = "capturado";
    }

    return (
      "Usas una " +
      boldText(ball.label) +
      " en un pokémon de etapa " +
      boldText(STAGE_LABEL[p.stage]) +
      " y...<br><img src=\"" +
      imgUrl +
      "\" alt=\"" +
      imgAlt +
      "\">"
    );
  }

  function processCapture(text, rng) {
    const parsed = parseCapture(text);
    if (typeof parsed === "string") {
      return parsed;
    }
    return formatResult(resolveCapture(parsed, rng));
  }

  function topicIdFromUrl() {
    var urlMatch = global.location.href.match(/\.com\/(t\d+-)/);
    if (urlMatch) {
      return urlMatch[1];
    }
    return "";
  }

  function renderCaptureBlock(rawText, tagId, seed) {
    if (typeof Math.seedrandom !== "function") {
      return '<div class="customroll-result">Error: seedrandom no está cargado.</div>';
    }

    var rng = new Math.seedrandom(seed);
    var html =
      '<div class="customroll-result">' + processCapture(rawText, rng) + "</div>";
    if (tagId) {
      html =
        '<div class="customroll-id">ID de la tirada:&nbsp;<span style="color:var(--tx5)">' +
        tagId +
        "</span></div>" +
        html;
    }
    return html;
  }

  function bindCaptures($) {
    var topicId = topicIdFromUrl();

    $("captura").each(function (index) {
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

      $this.replaceWith(
        renderCaptureBlock(rawText, tagId, topicId + parentId + tagId + "-" + index)
      );
    });
  }

  if (typeof global.$ === "function") {
    global.$(function () {
      bindCaptures(global.$);
    });
  }

  if (typeof module === "object" && module.exports) {
    module.exports = {
      parseCapture: parseCapture,
      rate0: rate0,
      captureChance: captureChance,
      resolveCapture: resolveCapture,
      formatResult: formatResult,
      processCapture: processCapture,
      BALLS: BALLS,
    };
  }
})();
