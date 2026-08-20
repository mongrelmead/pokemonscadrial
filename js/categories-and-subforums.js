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

// MODERATION CATEGORY
$(document).ready(function () {
    const classes = ["threads", "trades", "quests"];

    const $category = $("#c2");

    const $subforums = $category.find(".subforums");

    // 1. Insertar los dos nuevos hijos
    const illustration = $('<div class="side-illustration"></div>');
    const quote = $(`
    <div class="quote quote--2">
      We're standing here for no reason, and one day ${' '}<span>we'll be gone</span>${' '} for no reason.
      <i class="fa-solid fa-quote-left"></i>
      <i class="fa-solid fa-quote-right"></i>
    </div>
  `);

    $subforums.prepend(quote).prepend(illustration);

    // 2. Modificar cada subforum
    $subforums.find(".subforum").each(function (index) {
        const $subforum = $(this);

        // Agregar la clase (threads, trades, quests)
        $subforum.addClass(classes[index]);

        // Eliminar subforumimg y subforumlinks
        $subforum.find(".subforumimg, .subforumlinks").remove();

        // Remover imagen (conservar src) del summary y limpiar br
        const imgSrc = $('.summary img').attr('src');
        const $summary = $subforum.find(".summary");
        $summary.find("img").remove();
        const cleanSummary = $summary.html().replace(/<br\s*\/?>/gi, '').trim();
        $summary.html(cleanSummary);

        // Limpiar last-thread
        const $lastThread = $subforum.find(".last-thread");
        const $lastTitle = $lastThread.find(".title");
        const titleText = $lastTitle.text().trim();

        if (!titleText) {
            // Si no hay tema, mostrar mensaje
            $lastThread.find(".cinfo").html('<div class="username">No hay nada para leer acá</div>');
        } else {
            const $usernameBlock = $lastThread.find(".username");
            const postedAtText = $usernameBlock.clone().children('strong, a, br').remove().end().text().trim();
            const username = $usernameBlock.find('strong').text().trim();
            const finalUsername = postedAtText ? `${postedAtText} por ${username}` : username;
            $usernameBlock.text(finalUsername);
        }

        // 3. Transformar subforumimg en illustration
        $subforum.append(`<div class="illustration" style="background: url(${imgSrc}) center center / cover;"></div>`);

        // 4. Si es el segundo (trades), invertir contenido
        if (index === 1) {
            const $content = $subforum.find(".ccontent");
            const $illustration = $subforum.find(".illustration");
            $content.before($illustration);
        }
    });
});

// CATEGORIES HEADERS
$(document).ready(function () {
    // Count
    $(".category").each(function (index) {
        let readableIdx = index + 1;
        const formattedIndex = index < 10 ? `0${readableIdx}` : `${readableIdx}`;
        $(this).find(".number").first().text(formattedIndex);
    });

    // Descriptions
    const descriptions = [
        `<div class="description"><div class="line"></div>I don't remember all of them <span>word to word</span> but they still <span>stand out</span> to me.</div>`,
        `<div class="description"><div class="line"></div>For your insolence, <span>you shall</span> feel a <span>world of pain!</span></div>`,
        `<div class="description"><div class="line"></div>Change your perspective and the <span>reality</span> <span>changes!</span></div>`,
        `<div class="description"><div class="line"></div>The <span>void</span> is so... <span>cold</span></div>`,
    ];

    $(".description").each(function (index) {
        if (index < descriptions.length) {
            $(this).replaceWith(descriptions[index]);
        }
    });
});

// SUBFORUM IMAGES
$(document).ready(function () {
    $('.subforum').each(function () {
        const $subform = $(this);

        const $validParent = $subform.closest('div[id^="c"]').filter(function () {
            const id = $(this).attr('id');
            const match = id.match(/^c(\d+)$/);
            return match && parseInt(match[1], 10) >= 3;
        });

        if ($validParent.length) {
            const $summaryImg = $subform.find('.summary img').first();

            if ($summaryImg.length) {
                const imgSrc = $summaryImg.attr('src');
                const $subforumimg = $subform.find('.subforumimg').first();

                if ($subforumimg.length) {
                    $subforumimg.css('background', `url(${imgSrc}) center center / cover`);
                }

                $summaryImg.remove();
            }
        }
    });
});

// SUBFORUM LAST THREADS
$(document).ready(function () {
    $(".last-thread").each(function () {
        const $lastThread = $(this);

        const $titleLink = $lastThread.find(".cinfo .title");
        const $usernameContainer = $lastThread.find(".cinfo .username");
        const $mainIcon = $lastThread.find(".icon i[data-icon]").first();
        const dataIcon = $mainIcon.attr("data-icon") || "";

        const hasValidTitle =
            $titleLink.length &&
            $titleLink.attr("href") &&
            $titleLink.attr("href").trim() !== "";

        let newHtml = `
        <div class="icon icon-pencil">
          <i class="fa-solid fa-pencil"></i>
        </div>
        <div class="cinfo">
      `;

        if (hasValidTitle) {
            const link = $titleLink.attr("href");
            const title = $titleLink.text().trim();

            // Obtener el texto antes del primer <br> (fecha y hora)
            const rawHtml = $usernameContainer.html();
            const splitHtml = rawHtml.split("<br")[0].trim(); // Hasta el primer <br
            const preText = $("<div>").html(splitHtml).text().trim(); // Decodificar si hay entidades

            // Obtener el texto del primer <strong> (usuario)
            const strongText = $usernameContainer
                .find("strong")
                .first()
                .text()
                .trim();

            const finalUsername = `${preText}${' '} por ${strongText}`;

            newHtml += `
          <a href="${link}" class="title">${title}</a>
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