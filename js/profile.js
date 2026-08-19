// HIDES UNEDITABLE FIELDS
$(document).ready(function () {
    function hideUneditableFields() {
        const fieldIds = ["profile_field_10_1", "profile_field_2_2", "profile_field_13_13"];

        fieldIds.forEach(function (id) {
            const $input = $("#" + id);

            // Elimina el contenedor editable en la vista de perfil
            $input.closest(".field_editable").remove();

            // Elimina el <dl> en la edición de perfil
            $input.closest("dl").remove();
        });
    }

    const ITEMS_URL =
        "https://raw.githubusercontent.com/mongrelmead/pokemonscadrial/refs/heads/main/data/items.json";

    var itemAliases = {};
    var itemsById = {};

    function normalizeInventory(inventory) {
        const normalized = {};
        Object.keys(inventory || {}).forEach(function (key) {
            const canonical = itemAliases[key] || key;
            const quantity = inventory[key];
            if (typeof quantity !== "number") {
                normalized[canonical] = quantity;
                return;
            }
            normalized[canonical] = (normalized[canonical] || 0) + quantity;
        });
        return normalized;
    }

    function applyItemsData(data) {
        itemAliases = data.aliases || {};
        itemsById = {};
        var list = data.items || [];
        var i;
        for (i = 0; i < list.length; i++) {
            itemsById[list[i].id] = list[i];
        }
    }

    function formatsInventoryItems() {
        const inventoryText = $("#field_id2 .field_uneditable").text();
        var inventory = {};
        if (inventoryText) {
            inventory = normalizeInventory(JSON.parse(inventoryText));
        }
        console.log('inventory', inventory);

        const money = $("#field_id1 .field_uneditable").text();

        $(".availablemoney .value").html(`<span>₽</span>${money}`);

        const itemTemplate = `
      <div class="item">
        <div class="title">{ITEM_NAME}</div>
        <img
          src="{ITEM_IMG}"
          alt="{ITEM_ID}-illustration"
        />
        <div class="infofield">
          <div class="label">
            <i class="fa-solid {ITEM_ICON}"></i>{ITEM_EFFECT_LABEL}
          </div>
          <div class="value">{ITEM_EFFECT_VALUE}</div>
        </div>
        <div class="infofield">
          <div class="label"><i class="fa-solid fa-boxes-stacked"></i>cantidad</div>
          <div class="value">{ITEM_QUANTITY}</div>
        </div>
        <div class="description">
          {ITEM_DESCRIPTION}
        </div>
      </div>
      `;

        const renderedItems = Object.keys(inventory).map(function (key) {
            const data = itemsById[key];
            if (!data) {
                return "";
            }

            return itemTemplate
                .replace("{ITEM_NAME}", data.name)
                .replace("{ITEM_IMG}", data.img)
                .replace("{ITEM_ID}", data.id)
                .replace("{ITEM_ICON}", data.icon)
                .replace("{ITEM_EFFECT_LABEL}", data.effect_label)
                .replace("{ITEM_EFFECT_VALUE}", data.effect_value)
                .replace("{ITEM_QUANTITY}", inventory[key])
                .replace("{ITEM_DESCRIPTION}", data.description);
        });

        $(".itemslist").append(renderedItems.join(""));
    }

    function fieldOrDefault(selector, fallback) {
        const value = $(selector).text().trim();
        if (value !== "-") {
            return value;
        }
        return fallback;
    }

    function formatProfile() {
        const styleColor = $('.deleteable span[style*="color"]')
            .attr("style")
            .match(/color\s*:\s*([^;]+)/);
        var groupColor = null;
        if (styleColor) {
            groupColor = styleColor[1].trim().substring(1);
        }
        $("#profile-container").addClass(`color-${groupColor}`);

        const hasAvatar = !!$("#del-avatar img").length;
        var avatarSrc = "https://2img.net/i.imgur.com/skWkRjB.gif";
        if (hasAvatar) {
            const avatarAttr = $("#del-avatar img").attr("src");
            if (avatarAttr && avatarAttr.trim() !== "-") {
                avatarSrc = avatarAttr;
            }
        }

        const coverSrc = fieldOrDefault(
            "#field_id8 .field_uneditable",
            "https://2img.net/i.imgur.com/9LCsa3s.gif"
        );
        const iconSrc = fieldOrDefault(
            "#field_id9 .field_uneditable",
            "https://2img.net/i.imgur.com/kpn4VGJ.gif"
        );
        var age = "Eclosionando";
        const ageValue = $("#field_id10 .field_uneditable").text().trim();
        if (ageValue !== "-") {
            age = ageValue + " años";
        }
        const profession = fieldOrDefault(
            "#field_id4 .field_uneditable",
            "Desempleado"
        );
        const nickname = fieldOrDefault("#field_id3 .field_uneditable", "Newbie");
        const quote = fieldOrDefault(
            "#field_id7 .field_uneditable",
            "La vida es dura, pero más dura es la verdura."
        );
        const money = fieldOrDefault("#field_id1 .field_uneditable", "0");
        const experience = fieldOrDefault("#field_id13 .field_uneditable", "0");

        // Replaces fields in the custom profile
        $('[data-replace="avatar"]').attr("src", avatarSrc);
        $('[data-replace="group"]').text($("#del-groups").first().text());
        $('[data-replace="field_id1"]').text(money);
        $('[data-replace="field_id3"]').text(nickname);
        $('[data-replace="field_id4"]').text(profession);
        $('[data-replace="field_id5"]').attr(
            "href",
            $("#field_id5 .field_uneditable").text()
        );
        $('[data-replace="field_id6"]').attr(
            "href",
            $("#field_id6 .field_uneditable").text()
        );
        $('[data-replace="field_id7"]').text(quote);
        $('[data-replace="field_id8"]').attr("src", coverSrc);
        $('[data-replace="field_id9"]').attr("src", iconSrc);
        $('[data-replace="field_id10"]').text(age);
        $('[data-replace="field_id11"]').attr(
            "href",
            $("#field_id11 .field_uneditable").text()
        );
        $('[data-replace="field_id12"]').attr(
            "href",
            $("#field_id12 .field_uneditable").text()
        );
        $('[data-replace="field_id13"]').text(experience);
        $('[data-replace="field_id-4"]').text(
            $("#field_id-4 .field_uneditable").text()
        );

        $(".deleteable").remove();
    }

    const url = window.location.href;

    const patternUser = /\.com\/u[1-9]\d*$/;
    const patternEditProfile = /\.com\/profile\?mode=editprofile(?:&|$)/;

    if (patternUser.test(url)) {
        formatProfile();
        $.getJSON(ITEMS_URL)
            .done(function (data) {
                applyItemsData(data);
                formatsInventoryItems();
            })
            .fail(function () {
                $(".itemslist").append(
                    '<div class="description">Error: no se pudo cargar items.json.</div>'
                );
            });
    }

    if (patternEditProfile.test(url)) {
        hideUneditableFields();
    }
});