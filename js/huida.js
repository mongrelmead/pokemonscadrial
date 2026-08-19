(function () {
  var global = globalThis;
  if (typeof window !== "undefined") {
    global = window;
  }

  const FLEE_CHANCE = 0.5;
  const FLEE_IMG = {
    escaped: "https://i.ibb.co/PZcF2r9Y/dados-escapaste.png",
    failed: "https://i.ibb.co/fzp0msyR/dados-noescapas.png",
  };

  function resolveFlee(rng) {
    if (rng() < FLEE_CHANCE) {
      return true;
    }
    return false;
  }

  function formatResult(escaped) {
    var imgUrl = FLEE_IMG.failed;
    var imgAlt = "no escapas";
    if (escaped) {
      imgUrl = FLEE_IMG.escaped;
      imgAlt = "escapaste";
    }
    return (
      'Intentas huir y...<br><img src="' +
      imgUrl +
      '" alt="' +
      imgAlt +
      '">'
    );
  }

  function processFlee(rng) {
    return formatResult(resolveFlee(rng));
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

  function renderFleeBlock(tagId, seed) {
    if (typeof Math.seedrandom !== "function") {
      return '<div class="customroll-result">Error: seedrandom no está cargado.</div>';
    }

    var rng = new Math.seedrandom(seed);
    var html =
      '<div class="customroll-result">' + processFlee(rng) + "</div>";
    if (tagId) {
      html =
        '<div class="customroll-id">ID de la tirada:&nbsp;<span style="color:var(--tx5)">' +
        tagId +
        "</span></div>" +
        html;
    }
    return html;
  }

  function bindFlees($) {
    var topicId = topicIdFromUrl();

    $("huida").each(function (index) {
      var $this = $(this);

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
        renderFleeBlock(tagId, topicId + parentId + tagId + "-" + index)
      );
    });
  }

  if (typeof global.$ === "function") {
    global.$(function () {
      bindFlees(global.$);
    });
  }

  if (typeof module === "object" && module.exports) {
    module.exports = {
      resolveFlee: resolveFlee,
      formatResult: formatResult,
      processFlee: processFlee,
      FLEE_CHANCE: FLEE_CHANCE,
    };
  }
})();
