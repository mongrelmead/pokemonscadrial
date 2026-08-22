// INFORMATION CATEGORY
$(document).ready(function () {
    function moveChildrenAndRemoveCContent(parentSelector) {
        const $parent = $(parentSelector);
        const $ccontent = $parent.find('.ccontent');

        if ($ccontent.length) {
            $ccontent.children().appendTo($parent);
            $ccontent.remove();
        }
    }

    // Seleccionar todos los .subforum dentro de #c1
    const subforums = $('#c1 .subforums .subforum');

    // Clases a asignar en orden
    const classesToAdd = ['announcements', 'setting', 'guides', 'affiliations'];

    // Recorrer los subforums y asignar clases
    subforums.each(function (index) {
        if (classesToAdd[index]) {
            $(this).addClass(classesToAdd[index]);
        }
    });

    // Crear ilustración y quote para después del último subforum
    const illustrationDivAfter = $('<div>', { class: 'illustration' });
    const quoteDiv = $(`
    <div class="quote">
      Strong Pokémon.${' '}Weak Pokémon.${' '}That is only the ${' '}<span>selfish perception </span>${' '} of people.
      <i class="fa-solid fa-quote-left"></i>
      <i class="fa-solid fa-quote-right"></i>
    </div>
  `);

    // Insertar ilustración y quote después del último subforum
    subforums.last().after(illustrationDivAfter, quoteDiv);

    // Crear ilustraciones individuales
    const illustrationDivInsideAffiliations = $('<div>', { class: 'illustration' });
    const illustrationDivInsideSetting = $('<div>', { class: 'illustration' });

    // Insertar como primer hijo en affiliations
    $('#c1 .subforums .subforum.affiliations').prepend(illustrationDivInsideAffiliations);

    // Insertar como último hijo en setting
    $('#c1 .subforums .subforum.setting').append(illustrationDivInsideSetting);

    // Modifica la estructura de los subforos
    moveChildrenAndRemoveCContent('.subforum.announcements');
    moveChildrenAndRemoveCContent('.subforum.setting');
    moveChildrenAndRemoveCContent('.subforum.guides');
});

// STACKED CATEGORIES (c2 moderación, c5 usuarios)
function setupStackedCategory(categorySelector, quoteClass, quoteHtml) {
    const classes = ["threads", "trades", "quests"];
    const $category = $(categorySelector);
    const $subforums = $category.find(".subforums");

    if (!$subforums.length) {
        return;
    }

    const illustration = $('<div class="side-illustration"></div>');
    const quote = $(`
    <div class="quote ${quoteClass}">
      ${quoteHtml}
      <i class="fa-solid fa-quote-left"></i>
      <i class="fa-solid fa-quote-right"></i>
    </div>
  `);

    $subforums.prepend(quote).prepend(illustration);

    $subforums.find(".subforum").each(function (index) {
        const $subforum = $(this);

        if (classes[index]) {
            $subforum.addClass(classes[index]);
        }

        $subforum.find(".subforumimg, .subforumlinks").remove();

        const $summary = $subforum.find(".summary");
        const imgSrc = $summary.find("img").attr("src");
        $summary.find("img").remove();
        const cleanSummary = $summary.html().replace(/<br\s*\/?>/gi, '').trim();
        $summary.html(cleanSummary);

        const $lastThread = $subforum.find(".last-thread");
        const $lastTitle = $lastThread.find(".title");
        const titleText = $lastTitle.text().trim();

        if (!titleText) {
            $lastThread.find(".cinfo").html('<div class="username">No hay nada para leer acá</div>');
        } else {
            const $usernameBlock = $lastThread.find(".username");
            const postedAtText = $usernameBlock.clone().children('strong, a, br').remove().end().text().trim();
            const username = $usernameBlock.find('strong').text().trim();
            const finalUsername = postedAtText ? `${postedAtText} por ${username}` : username;
            $usernameBlock.text(finalUsername);
        }

        $subforum.append(`<div class="illustration" style="background: url(${imgSrc}) center center / cover;"></div>`);

        if (index === 1) {
            const $content = $subforum.find(".ccontent");
            const $illustration = $subforum.find(".illustration");
            $content.before($illustration);
        }
    });
}

$(document).ready(function () {
    setupStackedCategory(
        "#c2",
        "quote--2",
        `We're standing here for no reason, and one day ${' '}<span>we'll be gone</span>${' '} for no reason.`
    );

    setupStackedCategory(
        "#c5",
        "quote--5",
        `Everyone has their own ${' '}<span>way of living</span>${' '} that they're struggling to find.`
    );
});

function isViewforumCategory($category) {
    const id = $category.attr("id") || "";
    return /^f\d+$/.test(id);
}

// VIEWFORUM SUBFORUMS (BOARD_INDEX inside viewforum_body)
$(document).ready(function () {
    $(".category").each(function () {
        const $category = $(this);

        if (!isViewforumCategory($category)) {
            return;
        }

        $category.addClass("viewforum-subs");
        $category.find(".subforumlinks").remove();
    });
});

// CATEGORIES HEADERS
$(document).ready(function () {
    let categoryNumber = 0;

    $(".category").each(function () {
        const $category = $(this);

        if (isViewforumCategory($category) || $category.hasClass("viewforum-subs")) {
            return;
        }

        categoryNumber += 1;
        let formattedIndex = `${categoryNumber}`;
        if (categoryNumber < 10) {
            formattedIndex = `0${categoryNumber}`;
        }
        $category.find(".number").first().text(formattedIndex);
    });

    // Descriptions — orden de aparición en el índice: c1, c2, c5, c3, c4
    const descriptions = [
        `<div class="description"><div class="line"></div>I don't remember all of them <span>word to word</span> but they still <span>stand out</span> to me.</div>`,
        `<div class="description"><div class="line"></div>For your insolence, <span>you shall</span> feel a <span>world of pain!</span></div>`,
        `<div class="description"><div class="line"></div>Every face here has a <span>story</span> still being <span>written</span>.</div>`,
        `<div class="description"><div class="line"></div>Change your perspective and the <span>reality</span> <span>changes!</span></div>`,
        `<div class="description"><div class="line"></div>The <span>void</span> is so... <span>cold</span></div>`,
    ];

    let descriptionIndex = 0;

    $(".description").each(function () {
        const $description = $(this);

        if ($description.closest(".category.viewforum-subs").length) {
            return;
        }

        if (descriptionIndex < descriptions.length) {
            $description.replaceWith(descriptions[descriptionIndex]);
            descriptionIndex += 1;
        }
    });
});

// SUBFORUM IMAGES
$(document).ready(function () {
    const customLayoutCategories = new Set(["c1", "c2", "c5"]);

    $('.subforum').each(function () {
        const $subform = $(this);
        const $parent = $subform.closest(".category");

        if (!$parent.length) {
            return;
        }

        const id = $parent.attr("id") || "";
        const isViewforum = $parent.hasClass("viewforum-subs") || isViewforumCategory($parent);
        const isIndexNationStyle = /^c\d+$/.test(id) && !customLayoutCategories.has(id);

        if (!isViewforum && !isIndexNationStyle) {
            return;
        }

        const $summaryImg = $subform.find(".summary img").first();
        const $subforumimg = $subform.find(".subforumimg").first();
        const imgSrc = $summaryImg.attr("src");

        if ($summaryImg.length && imgSrc) {
            if ($subforumimg.length) {
                $subforumimg.css("background", `url(${imgSrc}) center center / cover`);
            }

            $summaryImg.remove();
        }

        if (isViewforum) {
            const backgroundImage = $subforumimg.css("background-image") || "";
            const hasImage = backgroundImage !== "" && backgroundImage !== "none";

            if (!hasImage) {
                $subform.addClass("no-image");
            }
        }
    });
});

// SUBFORUM LAST THREADS
$(document).ready(function () {
    $(".last-thread").each(function () {
        const $lastThread = $(this);

        if ($lastThread.closest("#c2, #c5").length) {
            return;
        }

        const $titleLink = $lastThread.find(".cinfo .title");
        const $usernameContainer = $lastThread.find(".cinfo .username");
        const $mainIcon = $lastThread.find(".icon i[data-icon]").first();
        const dataIcon = $mainIcon.attr("data-icon") || "";
        const href = ($titleLink.attr("href") || "").trim();
        const title = $titleLink.text().trim();
        const hasValidTitle = $titleLink.length && href !== "" && title !== "";

        let newHtml = `
        <div class="icon icon-pencil">
          <i class="fa-solid fa-pencil"></i>
        </div>
        <div class="cinfo">
      `;

        if (hasValidTitle) {
            const rawHtml = $usernameContainer.html() || "";
            const splitHtml = rawHtml.split("<br")[0].trim();
            const preText = $("<div>").html(splitHtml).text().trim();
            const strongText = $usernameContainer
                .find("strong")
                .first()
                .text()
                .trim();

            let finalUsername = strongText;
            if (preText) {
                finalUsername = `${preText} por ${strongText}`;
            }

            newHtml += `
          <a href="${href}" class="title">${title}</a>
          <div class="username">${finalUsername}</div>
        `;
        } else {
            newHtml += `
          <div class="username">No hay nada para leer acá</div>
        `;
        }

        newHtml += `
        </div>
        <div class="icon">
          <i data-icon="${dataIcon}" class="fa-solid fa-fire"></i>
        </div>
      `;

        $lastThread.html(newHtml);
    });
});

// SUBFORUM LINKS
const subforumLinksIconMap = {
    // Amakna
    "Cuna Silvestre": "fa-baby-carriage",
    "Campos Cantarines": "fa-hill-rockslide",
    "Bosque de Emelka": "fa-tree",
    "Llanura de los Riktus": "fa-user-ninja",
    // Sufokia
    "Bahía de las Tormentas": "fa-poo-storm",
    "Óceano Agresivo": "fa-water",
    "Montaña de los Charcosos": "fa-mountain-sun",
    "Duna Cana": "fa-umbrella-beach",
    // Brakmar
    "Nido de Obsidiana": "fa-volcano",
    "Landas de Sidimonte": "fa-mountain",
    "Jamelyn": "fa-chess-rook",
    "Campos Téril": "fa-radiation",
    // Bonta
    "Jardín Esmeralda": "fa-leaf",
    "Kara": "fa-worm",
    "Sabana de Kania": "fa-paw",
    "Bosquecillo de Túkulo": "fa-tree",
};

$(document).ready(function () {
    $('.subforumlinks').each(function () {
        const $container = $(this);

        if ($container.closest(".category.viewforum-subs").length) {
            $container.remove();
            return;
        }

        const newContent = [];

        $container.find('a').each(function () {
            const $link = $(this);
            const title = $link.text().trim();
            const iconClass = subforumLinksIconMap[title] || "fa-question";

            const formattedLink = `
        <a href="${$link.attr('href')}">
          <i class="fa-solid ${iconClass}"></i>
          <span>${title}</span>
        </a>
      `;
            newContent.push(formattedLink);
        });

        $container.html(newContent.join(''));
    });
});