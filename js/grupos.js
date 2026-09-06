// GROUPS PAGE (Grupos de Usuarios)
$(document).ready(function () {
  var $groupList = $(".group_list.noList");

  if (!$groupList.length) {
    return;
  }

  $("#main-content").addClass("groups-page");

  var $pageTitle = $("#main-content > h1.page-title").first();
  var titleText = $pageTitle.text().trim() || "Grupos de Usuarios";

  var $header = $(
    '<div class="header">' +
      '<div class="greet"><div class="line"></div>Vista de</div>' +
      '<div class="title">' + titleText + "</div>" +
      "</div>"
  );

  $pageTitle.replaceWith($header);

  $("#main-content.groups-page .panel .corners-top, #main-content.groups-page .panel .corners-bottom").remove();

  $("#main-content.groups-page .panel").wrapAll(
    '<div class="itemsdisplayouter"><div class="itemsdisplaygradient"><div class="itemsdisplaycontainer"></div></div></div>'
  );
});
