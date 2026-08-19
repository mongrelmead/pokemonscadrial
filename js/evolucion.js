(function () {
  var global = globalThis;
  if (typeof window !== "undefined") {
    global = window;
  }

  const ACCENTS = /[áéíóúüñ]/g;
  const ACCENT_MAP = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n" };

  const PIVOT_CHANCE = 0.7;
  const COORDINATOR_BONUS = 0.1;

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
  };

  const CAN_EVOLVE = {
    basica: true,
    uno: true,
  };

  const STAGE_CURVE = {
    basica: { pivotWins: 3, sureWins: 6 },
    uno: { pivotWins: 6, sureWins: 12 },
  };

  const EVO_IMG = {
    success: "https://i.ibb.co/SDWzmhkX/dados-evolucion.png",
    failed: "https://i.ibb.co/vSZJg6z/dados-evolucionnada.png",
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

  function professionEvolutionBonus(rank) {
    if (normalizeRank(rank).indexOf("coordinador") !== -1) {
      return COORDINATOR_BONUS;
    }
    return 0;
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

  function parseEvolution(text) {
    const parts = splitParts(text);
    if (parts.length !== 2) {
      return "Formato inválido de evolución.";
    }

    const stage = STAGE_ALIAS[parts[0]];
    if (!stage) {
      return "Etapa desconocida: " + parts[0];
    }
    if (!CAN_EVOLVE[stage]) {
      return "Esta etapa no puede evolucionar.";
    }

    if (!/^\d+$/.test(parts[1])) {
      return "Victorias inválidas.";
    }

    return {
      stage: stage,
      wins: parseInt(parts[1], 10),
    };
  }

  function evolutionChance(stage, wins, rank) {
    const curve = STAGE_CURVE[stage];
    var chance = 0;
    if (curve && wins > 0) {
      if (wins >= curve.sureWins) {
        chance = 1;
      } else if (wins <= curve.pivotWins) {
        chance = PIVOT_CHANCE * (wins / curve.pivotWins);
      } else {
        chance =
          PIVOT_CHANCE +
          (1 - PIVOT_CHANCE) *
            ((wins - curve.pivotWins) / (curve.sureWins - curve.pivotWins));
      }
    }
    chance += professionEvolutionBonus(rank);
    if (chance <= 0) {
      return 0;
    }
    if (chance >= 1) {
      return 1;
    }
    return Math.round(chance * 1000) / 1000;
  }

  function resolveEvolution(parsed, rng, rank) {
    const chance = evolutionChance(parsed.stage, parsed.wins, rank);
    const roll = rng();
    return {
      parsed: parsed,
      chance: chance,
      roll: roll,
      evolved: roll < chance,
    };
  }

  function boldText(text) {
    return "<b>" + text + "</b>";
  }

  function winWord(wins) {
    if (wins === 1) {
      return "victoria";
    }
    return "victorias";
  }

  function formatResult(result) {
    var imgUrl = EVO_IMG.failed;
    var imgAlt = "nada";
    if (result.evolved) {
      imgUrl = EVO_IMG.success;
      imgAlt = "evolución";
    }

    return (
      "Un pokémon de etapa " +
      boldText(STAGE_LABEL[result.parsed.stage]) +
      " con " +
      boldText(String(result.parsed.wins)) +
      " " +
      winWord(result.parsed.wins) +
      " intenta evolucionar y...<br><img src=\"" +
      imgUrl +
      "\" alt=\"" +
      imgAlt +
      "\">"
    );
  }

  function processEvolution(text, rng, rank) {
    const parsed = parseEvolution(text);
    if (typeof parsed === "string") {
      return parsed;
    }
    return formatResult(resolveEvolution(parsed, rng, rank));
  }

  function topicIdFromUrl() {
    var href = "";
    if (global.location) {
      if (global.location.href) {
        href = global.location.href;
      }
    }
    var urlMatch = href.match(/\.com\/(t\d+-)/);
    if (urlMatch) {
      return urlMatch[1];
    }
    return "";
  }

  function renderEvolutionBlock(rawText, tagId, seed, rank) {
    if (typeof Math.seedrandom !== "function") {
      return '<div class="customroll-result">Error: seedrandom no está cargado.</div>';
    }

    var rng = new Math.seedrandom(seed);
    var html =
      '<div class="customroll-result">' +
      processEvolution(rawText, rng, rank) +
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

  function bindEvolutions($) {
    var topicId = topicIdFromUrl();

    $("evolución, evolucion").each(function (index) {
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
        renderEvolutionBlock(
          rawText,
          tagId,
          topicId + parentId + tagId + "-" + index,
          posterRankFromEl($this)
        )
      );
    });
  }

  if (typeof global.$ === "function") {
    global.$(function () {
      bindEvolutions(global.$);
    });
  }

  if (typeof module === "object" && module.exports) {
    module.exports = {
      parseEvolution: parseEvolution,
      evolutionChance: evolutionChance,
      resolveEvolution: resolveEvolution,
      formatResult: formatResult,
      processEvolution: processEvolution,
      normalizeRank: normalizeRank,
      professionEvolutionBonus: professionEvolutionBonus,
      STAGE_CURVE: STAGE_CURVE,
      PIVOT_CHANCE: PIVOT_CHANCE,
      COORDINATOR_BONUS: COORDINATOR_BONUS,
    };
  }
})();
