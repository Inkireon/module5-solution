(function (global) {
  'use strict';

  // Define the $dc (David Chu) namespace
  var $dc = {};

  // Base URL for the Coursera menu API
  var baseUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/";

  /////////////////////////////////////////////////
  // PRIVATE FUNCTIONS
  /////////////////////////////////////////////////

  // Builds and shows the home page HTML
  // TODO: STEP 1 - This function is passed as a callback to the $.ajax call below
  var buildAndShowHomeHTML = function (categories) {
    // TODO: STEP 2 - Call chooseRandomCategory, passing it retrieved 'categories'
    var randomCategory = chooseRandomCategory(categories);

    // Load the home HTML snippet from the server
    $.ajax({
      type: "GET",
      url: "snippets/home-snippet.html",
      success: function (homeHtml) {
        // TODO: STEP 3 - Substitute {{randomCategoryShortName}} in the home html snippet
        //                with the chosen category short_name from step 2
        homeHtml = homeHtml.replace("{{randomCategoryShortName}}", "'" + randomCategory.short_name + "'");

        // TODO: STEP 4 - Insert the produced HTML into the #main-content div
        $("#main-content").html(homeHtml);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  };

  // Chooses a random category from the categories array returned by the server
  var chooseRandomCategory = function (categories) {
    // categories can be an array or object from Firebase
    var categoryList;
    if (Array.isArray(categories)) {
      categoryList = categories;
    } else {
      categoryList = Object.values(categories);
    }
    var randomIndex = Math.floor(Math.random() * categoryList.length);
    return categoryList[randomIndex];
  };

  /////////////////////////////////////////////////
  // PUBLIC FUNCTIONS (attached to $dc)
  /////////////////////////////////////////////////

  // Loads the home page: fetches categories, then builds the home HTML
  $dc.loadHome = function () {
    $.ajax({
      type: "GET",
      url: baseUrl + "categories.json",
      // TODO: STEP 1 - Substitute [...] with the *value* of the function buildAndShowHomeHTML
      //                so it can be called when server responds with the categories data
      success: buildAndShowHomeHTML,
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  };

  // Loads menu items for a given category short_name
  $dc.loadMenuItems = function (categoryShortName) {
    $.ajax({
      type: "GET",
      url: baseUrl + "menu_items/" + categoryShortName + ".json",
      success: function (categoryData) {
        var category = categoryData.category;
        var items = categoryData.menu_items;

        // Build the menu items HTML
        var menuHtml = "<h2 class='text-center'>" + category.name + "</h2>";
        menuHtml += "<div class='row'>";

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          menuHtml += "<div class='col-sm-6 col-md-4'>";
          menuHtml += "<div class='thumbnail'>";
          if (item.image_url) {
            menuHtml += "<img src='" + item.image_url + "' alt='" + item.name + "'>";
          }
          menuHtml += "<div class='caption'>";
          menuHtml += "<h3>" + item.name + "</h3>";
          menuHtml += "<p>" + (item.description || "") + "</p>";
          menuHtml += "<p class='price'><strong>";
          if (item.price_small) {
            menuHtml += "Small: $" + item.price_small;
          }
          if (item.price_large) {
            menuHtml += " / Large: $" + item.price_large;
          }
          menuHtml += "</strong></p>";
          menuHtml += "</div></div></div>";
        }

        menuHtml += "</div>";
        menuHtml += "<div class='row'><div class='col-sm-12'>";
        menuHtml += "<button class='btn btn-default' onclick='$dc.loadHome();'>&larr; Back to Home</button>";
        menuHtml += "</div></div>";

        $("#main-content").html(menuHtml);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  };

  // Expose $dc to the global scope
  global.$dc = $dc;

  // Load the home page on startup
  $(function () {
    $dc.loadHome();
  });

})(window);