$(document).ready(function () {
  // Constantes para límites
  const MAX_DICE = 10;
  const MAX_SIDES = 30;

  // Objeto con todos los patrones de dados
  const dicePatterns = {
    basic: /^([0-9]+)d([0-9]+)(?:\+([0-9]+))?$/i,
    negative: /^([0-9]+)d([0-9]+)-(?:([0-9]+))$/i,
    success: /^([0-9]+)d([0-9]+)>([0-9]+)$/i,
    exploding: /^([0-9]+)d([0-9]+)\!$/i,
    keepHighest: /^([0-9]+)d([0-9]+)kh(\d+)$/i,
    dropLowest: /^([0-9]+)d([0-9]+)dl(\d+)$/i,
    advantageDisadvantage: /^([0-9]+)d([0-9]+)([vd])$/i,
  };

  // Funciones auxiliares
  function isLimitExceeded(dice, sides) {
    return dice > MAX_DICE || sides > MAX_SIDES;
  }

  function rollDice(sides, rng) {
    return Math.floor(rng() * sides) + 1;
  }

  function generateRolls(numDice, numSides, rng) {
    return Array.from({ length: numDice }, () => rollDice(numSides, rng));
  }

  // Handlers para diferentes tipos de tiradas
  const diceHandlers = {
    basic: function (match, rng) {
      const [_, dice, sides, bonusRaw] = match;

      if (isLimitExceeded(parseInt(dice), parseInt(sides)))
        return "Limite de dados fuera del límite permitido.";

      const numDice = parseInt(dice);
      const numSides = parseInt(sides);
      const bonus = parseInt(bonusRaw || 0);

      const rolls = generateRolls(numDice, numSides, rng);
      const diceSum = rolls.reduce((a, b) => a + b, 0);
      const total = diceSum + bonus;

      let displayRolls = [...rolls];
      let formula = displayRolls.join(" + ");

      if (bonus > 0) {
        formula += ` + ${bonus}`;
      }

      return `Resultado:&nbsp;${formula}&nbsp;=&nbsp;${total}`;
    },

    negative: function (match, rng) {
      const [_, dice, sides, penaltyRaw] = match;

      if (isLimitExceeded(parseInt(dice), parseInt(sides)))
        return "Limite de dados fuera del límite permitido.";

      const numDice = parseInt(dice);
      const numSides = parseInt(sides);
      const penalty = parseInt(penaltyRaw || 0);

      const rolls = generateRolls(numDice, numSides, rng);
      const sum = rolls.reduce((a, b) => a + b, 0);
      const final = Math.max(0, sum - penalty);

      return `Resultado:&nbsp;${rolls.join(
        " + "
      )}&nbsp;-&nbsp;${penalty}&nbsp;=&nbsp;${final}`;
    },

    success: function (match, rng) {
      const [_, dice, sides, threshold] = match;

      if (isLimitExceeded(parseInt(dice), parseInt(sides)))
        return "Limite de dados fuera del límite permitido.";

      const numDice = parseInt(dice);
      const numSides = parseInt(sides);
      const limit = parseInt(threshold);

      const rolls = generateRolls(numDice, numSides, rng);
      const successes = rolls.filter((r) => r > limit).length;

      return `Tirada&nbsp;de&nbsp;Éxito:&nbsp;${rolls.join(
        ", "
      )}&nbsp;→&nbsp;${successes}&nbsp;éxitos&nbsp;(> ${limit})`;
    },

    exploding: function (match, rng) {
      const [_, dice, sides] = match;

      if (isLimitExceeded(parseInt(dice), parseInt(sides)))
        return "Limite de dados fuera del límite permitido.";

      const numDice = parseInt(dice);
      const numSides = parseInt(sides);

      let rolls = [];

      // Realizar tiradas explosivas para cada dado
      for (let i = 0; i < numDice; i++) {
        let currentRolls = [];
        let roll;
        do {
          roll = rollDice(numSides, rng);
          currentRolls.push(roll);
        } while (roll === numSides);

        rolls = [...rolls, ...currentRolls];
      }

      const sum = rolls.reduce((a, b) => a + b, 0);
      return `Dados Explosivos:&nbsp;${rolls.join(" + ")}&nbsp;=&nbsp;${sum}`;
    },

    keepHighest: function (match, rng) {
      const [_, dice, sides, count] = match;

      if (isLimitExceeded(parseInt(dice), parseInt(sides)))
        return "Limite de dados fuera del límite permitido.";

      const numDice = parseInt(dice);
      const numSides = parseInt(sides);
      const keep = parseInt(count);

      const rolls = generateRolls(numDice, numSides, rng);
      const sorted = [...rolls].sort((a, b) => b - a); // Ordenar de mayor a menor
      const kept = sorted.slice(0, keep);
      const sum = kept.reduce((a, b) => a + b, 0);

      const keptString =
        kept.length === 0 ? "(0)" : `(${kept.join(" + ")}&nbsp;=&nbsp;${sum})`;

      return `Mantener altos:&nbsp;${rolls.join(
        ", "
      )}&nbsp;→&nbsp;${keptString}`;
    },

    dropLowest: function (match, rng) {
      const [_, dice, sides, drop] = match;

      if (isLimitExceeded(parseInt(dice), parseInt(sides)))
        return "Limite de dados fuera del límite permitido.";

      const numDice = parseInt(dice);
      const numSides = parseInt(sides);
      const dropCount = parseInt(drop);

      const rolls = generateRolls(numDice, numSides, rng);
      const sorted = [...rolls].sort((a, b) => a - b); // Ordenar de menor a mayor
      const kept = sorted.slice(dropCount);
      const sum = kept.reduce((a, b) => a + b, 0);

      const keptString =
        kept.length === 0 ? "(0)" : `(${kept.join(" + ")}&nbsp;=&nbsp;${sum})`;

      return `Ignorar Bajos:&nbsp;${rolls.join(
        ", "
      )}&nbsp;→&nbsp;${keptString}`;
    },

    advantageDisadvantage: function (match, rng) {
      const [_, dice, sides, mode] = match;

      if (isLimitExceeded(parseInt(dice), parseInt(sides)))
        return "Limite de dados fuera del límite permitido.";

      const d = parseInt(dice);
      const s = parseInt(sides);

      if (d !== 1) return "Ventaja/Desventaja sólo se aplica a 1 dado.";

      const r1 = rollDice(s, rng);
      const r2 = rollDice(s, rng);
      const result = mode === "v" ? Math.max(r1, r2) : Math.min(r1, r2);

      return `${mode === "v" ? "Ventaja" : "Desventaja"
        }:&nbsp;${r1}&nbsp;vs ${r2}&nbsp;→&nbsp;${result}`;
    },
  };

  // Función principal para procesar tiradas de dados
  function processDiceRoll(rollText, rng) {
    // Verificar cada patrón y usar el handler correspondiente
    for (const [type, pattern] of Object.entries(dicePatterns)) {
      const match = rollText.match(pattern);
      if (match) {
        return diceHandlers[type](match, rng);
      }
    }

    return "Formato inválido de tirada de dados";
  }

  // Procesar todos los elementos <dado>
  $("dado").each(function () {
    const $this = $(this);

    // Obtener información de contexto para la generación de semilla
    const closestPostRow = $this.closest("div.post").filter(function () {
      return [...this.classList].some((cls) => /^row\d+$/.test(cls));
    });

    const parentId = closestPostRow.attr("id") || "";
    const currentUrl = window.location.href;
    const urlMatch = currentUrl.match(/\.com\/(t\d+-)/);
    const tnValue = urlMatch ? urlMatch[1] : "";
    const tagId = $this.attr("id") || "";

    // Generar la semilla y el generador de números aleatorios
    const seed = `${tnValue}${parentId}${tagId}`;
    const rng = new Math.seedrandom(seed);

    // Procesar la tirada
    const rollText = $this.text().trim();
    const resultText = processDiceRoll(rollText, rng);

    // Mostrar ID de la tirada si está disponible
    if (tagId) {
      const idDiv = $("<div>", {
        class: "customroll-id",
        html: `ID de la tirada:&nbsp;<span style="color:var(--tx5)">${tagId}</span>`,
      });
      $this.after(idDiv);
    }

    // Mostrar el resultado
    const resultDiv = $("<div>", {
      class: "customroll-result",
      html: resultText,
    });

    $this.after(resultDiv);
  });
});