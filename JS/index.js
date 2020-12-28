var map;
var markerArray = [];
var markerCluster;
var infowindow;
var codeMarker;
var selected;
var markerLatLng;
var clusterClicked;
var mapClicked;
var myLocationMarker = null;

function initMap() {
  var width = window.innerWidth;
  var mapTypeControl = true;
  var streetViewControl = true;
  var zoomControl = true;
  if (width < 801) {
    mapTypeControl = false;
    streetViewControl = false;
    zoomControl = false;
  }
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 3,
    center: {
      lat: 17,
      lng: 0,
    },
    minZoom: 2,
    clickableIcons: false,
    streetViewControl: streetViewControl,
    zoomControl: zoomControl,
    mapTypeControl: mapTypeControl,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.RIGHT_TOP,
    },
    fullscreenControl: false,
  });
  var geoOptions = {
    enableHighAccuracy: true,
    maximumAge: Infinity,
    timeout: 0,
  };
  var geo_options = {
    enableHighAccuracy: true,
  };
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      showPosition,
      geoNotWorking,
      geo_options
    );
  }

  markerCluster = new MarkerClusterer(map, markerArray, {
    zoomOnClick: false,
    imagePath: "https://pinmapple.com/IMG/markerclusterer/m",
  });

  codeMarker = new google.maps.Marker();

  infoWindow = new google.maps.InfoWindow();

  google.maps.InfoWindow.prototype.isOpen = function () {
    var map = this.getMap();
    return map !== null && typeof map !== "undefined";
  };

  map.addListener("zoom_changed", function () {
    infoWindow.close();
  });

  mapClicked = google.maps.event.addListener(map, "click", function (e) {
    setTimeout(function () {
      if (infoWindow.isOpen() && !clusterClicked) {
        infoWindow.close();
      }
      clusterClicked = false;
    }, 0);
  });

  map.addListener("idle", function () {
    $(".postImg").each(function () {
      var attr = $(this).attr("src");
      if ($(this).visible(true) && (attr == undefined || attr == false)) {
        var imageSrc = $(this).data("src");
        $(this).attr("src", imageSrc);
        $(this).on("load", function () {
          $(this).parent().css("background", "transparent");
          $(this).fadeTo(500, 1);
        });
        $(this).on("error", function () {
          $(this).parent().css("background", "transparent");
          $(this).attr("src", "/IMG/imageNotFound.png");
          $(this).addClass("noImage");
        });
      }
    });
  });
  var options = {
    types: ["geocode"],
  };

  var input = document.getElementById("pac-input");
  var searchBox = new google.maps.places.Autocomplete(input, options);

  map.addListener("bounds_changed", function () {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener("place_changed", function () {
    selected = true;
    var place = searchBox.getPlace();
    if (place.length == 0) {
      return;
    }

    var bounds = new google.maps.LatLngBounds();
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  });

  var theClickEvent;
  var codeLong;
  var codeLat;
  var theDescription;
  var completeCode;
  $("#myonoffswitch").bind("click", function (evt) {
    $("#myonoffswitch").toggleClass("checked");
    infoWindow.close();
    if ($("#myonoffswitch").hasClass("checked")) {
      $("#myonoffswitch").text("browse map");
      $("#blogCodeDiv").fadeIn(300);
      for (var i = 0, n = markerArray.length; i < n; ++i) {
        markerArray[i].setVisible(false);
      }
      markerCluster.clearMarkers();
      markerCluster.repaint();

      $("#advancedSearch").stop().hide();
      $("#clearSearch").stop().fadeOut(150);

      google.maps.event.removeListener(mapClicked);
      mapClicked = google.maps.event.addListener(map, "click", function (e) {
        //Determine the location where the user has clicked.
        codeMarker.setMap(null);
        var location = e.latLng;

        //Create a marker and placed it on the map.
        codeMarker = new google.maps.Marker({
          position: location,
          map: map,
        });
        codeLong = codeMarker.getPosition().lng();
        codeLat = codeMarker.getPosition().lat();
        theDescription = $("#blogCodeDescription").val();
        completeCode =
          "[//]:# (!pinmapple " +
          codeLat.toFixed(6) +
          " lat " +
          codeLong.toFixed(6) +
          " long " +
          theDescription +
          " d3scr)";
        $("#codeToCopy").empty().append(completeCode);
        $("#blogCodeDescription").bind("input propertychange", function (evt) {
          // If it's the propertychange event, make sure it's the value that changed.
          if (
            window.event &&
            event.type == "propertychange" &&
            event.propertyName != "value"
          )
            return;

          // Clear any previously set timer before setting a fresh one
          window.clearTimeout($(this).data("timeout"));
          $(this).data(
            "timeout",
            setTimeout(function () {
              theDescription = $("#blogCodeDescription").val();
              completeCode =
                "[//]:# (!pinmapple " +
                codeLat.toFixed(6) +
                " lat " +
                codeLong.toFixed(6) +
                " long " +
                theDescription +
                " d3scr)";
              $("#codeToCopy").empty().append(completeCode);
            }, 500)
          );
        });
        $("#goodCopy").hide();
        $("#clickMapText").hide();
        $("#clickCodeText").show();
        $("#codeToCopy").show();
      });
    } else {
      $("#myonoffswitch").text("get code");
      google.maps.event.removeListener(mapClicked);
      mapClicked = google.maps.event.addListener(map, "click", function (e) {
        setTimeout(function () {
          if (infoWindow.isOpen() && !clusterClicked) {
            infoWindow.close();
          }
          clusterClicked = false;
        }, 0);
      });

      $("#howToPopup")
        .stop()
        .fadeOut(300, function () {
          $(".howTo").hide();
          $(".ytVideo").each(function () {
            $(this)[0].contentWindow.postMessage(
              '{"event":"command","func":"' + "stopVideo" + '","args":""}',
              "*"
            );
          });
        });
      $("#blogCodeDiv")
        .stop()
        .fadeOut(300, function () {
          $("#blogCodeDescription").val("");
          $("#goodCopy").hide();
          $("#clickMapText").show();
          $("#clickCodeText").hide();
          $("#codeToCopy").hide();
        });
      for (var i = 0, n = markerArray.length; i < n; ++i) {
        markerArray[i].setVisible(true);
      }
      for (var i = 0, n = markerArray.length; i < n; ++i) {
        markerArray[i].setVisible(true);
      }
      markerCluster = new MarkerClusterer(map, markerArray, {
        zoomOnClick: false,
        imagePath: "https://pinmapple.com/IMG/markerclusterer/m",
      });
      google.maps.event.addListener(
        markerCluster,
        "clusterclick",
        function (cluster) {
          clusterClicked = true;

          infoWindow.setContent(
            '<div class="clusterDiv"><div class="infoDiv infoDivCluster"><div class="imageDiv"><img class="postImg"></div><div class="textDiv"><h2 class="postTitle"></h2><p class="postDescription"></p></div></div><div class="infoDiv infoDivCluster"><div class="imageDiv"><img class="postImg"></div><div class="textDiv"><h2 class="postTitle"></h2><p class="postDescription"></p></div></div></div>'
          );
          infoWindow.setPosition(cluster.getCenter());

          infoWindow.open(map);
          var markers = cluster.getMarkers();
          var markerTitles = [];

          for (i = 0; i < markers.length; i++) {
            markerTitles.push(markers[i].getTitle());
          }
          //SEND THIS TO PHP AND GET DATA FROM MARKERS WITH THIS TITLE
          $.post(
            "PHP/cluster.php",
            {
              markerTitles: markerTitles,
            },
            function (data) {
              infoWindow.setContent(data);
            }
          ).done(function () {
            $(".postImg").each(function () {
              var attr = $(this).attr("src");
              if (
                $(this).visible(true) &&
                (attr == undefined || attr == false)
              ) {
                var imageSrc = $(this).data("src");
                $(this).attr("src", imageSrc);
                $(this).on("load", function () {
                  $(this).parent().css("background", "transparent");
                  $(this).fadeTo(500, 1);
                });
                $(this).on("error", function () {
                  $(this).parent().css("background", "transparent");
                  $(this).attr("src", "IMG/imageNotFound.png");
                  $(this).addClass("noImage");
                });
              }
            });
            var imageLoad;
            $(".clusterDiv").bind("scroll", function () {
              clearTimeout(imageLoad);
              imageLoad = setTimeout(function () {
                $(".postImg").each(function () {
                  var attr = $(this).attr("src");
                  if (
                    $(this).visible(true) &&
                    (attr == undefined || attr == false)
                  ) {
                    var imageSrc = $(this).data("src");
                    $(this).attr("src", imageSrc);
                    $(this).on("load", function () {
                      $(this).parent().css("background", "transparent");
                      $(this).fadeTo(500, 1);
                    });
                    $(this).on("error", function () {
                      $(this).parent().css("background", "transparent");
                      $(this).attr("src", "IMG/imageNotFound.png");
                      $(this).addClass("noImage");
                    });
                  }
                });
              }, 200);
            });
          });
        }
      );
      $("#advancedSearch").stop().show();

      codeMarker.setMap(null);
      google.maps.event.removeListener(theClickEvent);
    }
  });
  searchAll();
}

$(document).ready(function () {
  $("#pac-input").bind("input propertychange", function (evt) {
    // If it's the propertychange event, make sure it's the value that changed.
    if (
      window.event &&
      event.type == "propertychange" &&
      event.propertyName != "value"
    )
      return;

    // Clear any previously set timer before setting a fresh one
    window.clearTimeout($(this).data("timeout"));
    $(this).data(
      "timeout",
      setTimeout(function () {
        // Do your thing here
        if ($("#pac-input").val() == "") {
          map.setZoom(3);
          map.setCenter({
            lat: 17,
            lng: 0,
          });
        }
      }, 800)
    );
  });

  $(".howToHeader").click(function () {
    $(".ytVideo").each(function () {
      $(this)[0].contentWindow.postMessage(
        '{"event":"command","func":"' + "stopVideo" + '","args":""}',
        "*"
      );
    });

    $(".howTo").stop().slideUp();
    $(this).next($(".howTo")).stop().slideToggle();
  });

  $("#codeToCopy").click(function () {
    var worldmapCode = $(this).text();
    copyToClipboard(worldmapCode);
    $("#clickCodeText").hide();
    $("#goodCopy").css("visibility", "hidden");
    $("#goodCopy").show();
    setTimeout(function () {
      $("#goodCopy").css("visibility", "visible");
    }, 100);
  });

  $("#mapCode").click(function () {
    var mapCode = $(this).text();
    copyToClipboard(mapCode);
  });

  $(document).on("click", function (event) {
    if (
      !$(event.target).closest("#searchTerms").length &&
      !$(event.target).closest("#advancedSearch").length &&
      !$(event.target).closest("#clearSearch").length &&
      !$(event.target).closest("#howTo").length &&
      !$(event.target).closest("#howToPopup").length
    ) {
      // Hide the menus.
      if ($("#searchTerms").is(":visible")) {
        $("#searchTerms").fadeOut(300);
      }
      if (
        $("#howToPopup").is(":visible") &&
        !$(event.target).closest(".onoffswitch").length
      ) {
        $("#howToPopup").fadeOut(300);
        $(".ytVideo").each(function () {
          $(this)[0].contentWindow.postMessage(
            '{"event":"command","func":"' + "stopVideo" + '","args":""}',
            "*"
          );
        });
      }
    }
  });

  $("#advancedSearch").click(function () {
    $("#howToPopup").hide();
    $(".ytVideo").each(function () {
      $(this)[0].contentWindow.postMessage(
        '{"event":"command","func":"' + "stopVideo" + '","args":""}',
        "*"
      );
    });
    $("#searchTerms").stop().fadeToggle(300);
  });
  $("#howTo").click(function () {
    $("#searchTerms").hide();
    $("#howToPopup").stop().fadeToggle(300);
    $(".ytVideo").each(function () {
      $(this)[0].contentWindow.postMessage(
        '{"event":"command","func":"' + "stopVideo" + '","args":""}',
        "*"
      );
    });
  });
  var timerForClear;
  $("#clearSearch").click(function () {
    if (myLocationMarker != null) {
      myLocationMarker.setMap(null);
    }
    clearTimeout(timerForClear);
    timerForClear = setTimeout(function () {
      $("#fromDate").data("dateRangePicker").clear();
      $("#editorsChoice").prop("checked", false);
      $("#searchTerms *")
        .filter(":input")
        .each(function () {
          $(this).val("");
        });
      $("#editorsChoice").val("1");
      $("#postName").val("");
      $("#pac-input").val("");
      map.setZoom(3);
      map.setCenter({
        lat: 17,
        lng: 0,
      });
      searchAll();
    }, 300);
  });
  $("#fromDate").dateRangePicker({
    inline: true,
    container: "#dateRangeDiv",
    alwaysOpen: true,
    language: "en",
    showShortcuts: true,
    customShortcuts: [
      {
        name: "week",
        dates: function () {
          var start = moment(new Date()).toDate();
          var end = moment(new Date()).subtract(1, "weeks").toDate();
          return [start, end];
        },
      },
      {
        name: "month",
        dates: function () {
          var start = moment(new Date()).toDate();
          var end = moment(new Date()).subtract(1, "months").toDate();
          return [start, end];
        },
      },
      {
        name: "year",
        dates: function () {
          var start = moment(new Date()).toDate();
          var end = moment(new Date()).subtract(1, "years").toDate();
          return [start, end];
        },
      },
      {
        name: "three years",
        dates: function () {
          var start = moment(new Date()).toDate();
          var end = moment(new Date()).subtract(3, "years").toDate();
          return [start, end];
        },
      },
    ],
    customTopBar: "Date range",
    monthSelect: true,
    yearSelect: true,
  });
  $(".month1").on("click", function () {
    window.clearTimeout($(this).data("timeout"));
    $(this).data(
      "timeout",
      setTimeout(function () {
        $("#postName").val("");
        searchAll();
      }, 800)
    );
  });
  $(".month2").on("click", function () {
    window.clearTimeout($(this).data("timeout"));
    $(this).data(
      "timeout",
      setTimeout(function () {
        $("#postName").val("");
        searchAll();
      }, 800)
    );
  });
  $(".custom-shortcut").on("click", function () {
    window.clearTimeout($(this).data("timeout"));
    $(this).data(
      "timeout",
      setTimeout(function () {
        $("#postName").val("");
        searchAll();
      }, 800)
    );
  });
  var timer;
  $("#bcImg").click(function () {
    timer = clearTimeout(timer);
    var textToCopy = "1FzNF3rxBp6HsJuuTF7swHi23hyjXmqwGc";
    copyToClipboard(textToCopy);
    $("#copiedMessage").slideUp(function () {
      $("#copiedMessage").html("");
      $("#copiedMessage").html("COPIED:&nbsp;&nbsp;&nbsp;" + textToCopy);
    });
    $("#copiedMessage").slideDown();
    timer = setTimeout(function () {
      $("#copiedMessage").slideUp();
    }, 3000);
  });
  $("#ethImg").click(function () {
    timer = clearTimeout(timer);
    var textToCopy = "0x86f341c3cc82e5bb0cfb8424d43abb2507e1ec06";
    copyToClipboard(textToCopy);
    $("#copiedMessage").slideUp(function () {
      $("#copiedMessage").html("");
      $("#copiedMessage").html("COPIED:&nbsp;&nbsp;&nbsp;" + textToCopy);
    });
    $("#copiedMessage").slideDown();
    timer = setTimeout(function () {
      $("#copiedMessage").slideUp();
    }, 3000);
  });

  $("#authorInput").on("keydown", function (e) {
    if (e.which == 13 || e.which == 10) {
      e.preventDefault();
      $("#authorInput").blur();
    }
  });
  $("#author").bind("input propertychange", function (evt) {
    // If it's the propertychange event, make sure it's the value that changed.
    if (
      window.event &&
      event.type == "propertychange" &&
      event.propertyName != "value"
    )
      return;

    // Clear any previously set timer before setting a fresh one
    window.clearTimeout($(this).data("timeout"));
    $(this).data(
      "timeout",
      setTimeout(function () {
        // Do your thing here
        $("#postName").val("");
        searchAll();
      }, 800)
    );
  });
  $("#tag").bind("input propertychange", function (evt) {
    // If it's the propertychange event, make sure it's the value that changed.
    if (
      window.event &&
      event.type == "propertychange" &&
      event.propertyName != "value"
    )
      return;

    // Clear any previously set timer before setting a fresh one
    window.clearTimeout($(this).data("timeout"));
    $(this).data(
      "timeout",
      setTimeout(function () {
        // Do your thing here
        $("#postName").val("");
        searchAll();
      }, 800)
    );
  });
  $("#fromDate").bind("input propertychange change", function (evt) {
    // If it's the propertychange event, make sure it's the value that changed.
    if (
      window.event &&
      event.type == "propertychange" &&
      event.propertyName != "value"
    )
      return;

    // Clear any previously set timer before setting a fresh one
    window.clearTimeout($(this).data("timeout"));
    $(this).data(
      "timeout",
      setTimeout(function () {
        // Do your thing here
        $("#postName").val("");
        searchAll();
      }, 800)
    );
  });
  $("#editorsChoice").bind("input propertychange change", function (evt) {
    // If it's the propertychange event, make sure it's the value that changed.
    if (
      window.event &&
      event.type == "propertychange" &&
      event.propertyName != "value"
    )
      return;

    // Clear any previously set timer before setting a fresh one
    window.clearTimeout($(this).data("timeout"));
    $(this).data(
      "timeout",
      setTimeout(function () {
        // Do your thing here
        $("#postName").val("");
        searchAll();
      }, 200)
    );
  });
});

!(function (t) {
  var i = t(window);
  t.fn.visible = function (t, e, o) {
    if (!(this.length < 1)) {
      var r = this.length > 1 ? this.eq(0) : this,
        n = r.get(0),
        f = i.width(),
        h = i.height(),
        o = o ? o : "both",
        l = e === !0 ? n.offsetWidth * n.offsetHeight : !0;
      if ("function" == typeof n.getBoundingClientRect) {
        var g = n.getBoundingClientRect(),
          u = g.top >= 0 && g.top < h,
          s = g.bottom > 0 && g.bottom <= h,
          c = g.left >= 0 && g.left < f,
          a = g.right > 0 && g.right <= f,
          v = t ? u || s : u && s,
          b = t ? c || a : c && a;
        if ("both" === o) return l && v && b;
        if ("vertical" === o) return l && v;
        if ("horizontal" === o) return l && b;
      } else {
        var d = i.scrollTop(),
          p = d + h,
          w = i.scrollLeft(),
          m = w + f,
          y = r.offset(),
          z = y.top,
          B = z + r.height(),
          C = y.left,
          R = C + r.width(),
          j = t === !0 ? B : z,
          q = t === !0 ? z : B,
          H = t === !0 ? R : C,
          L = t === !0 ? C : R;
        if ("both" === o) return !!l && p >= q && j >= d && m >= L && H >= w;
        if ("vertical" === o) return !!l && p >= q && j >= d;
        if ("horizontal" === o) return !!l && m >= L && H >= w;
      }
    }
  };
})(jQuery);

function searchAll() {
  var j = 0;
  infoWindow.close();
  $(".onoffswitch").hide();
  var postToSearch = $("#postName").val();
  var authorToSearch = $("#author").val();
  var tagToSearch = $("#tag").val();
  var dateRangeToSearch = $("#fromDate").val();
  if ($("#editorsChoice").is(":checked")) {
    var editorsChoice = $("#editorsChoice").val();
  } else {
    var editorsChoice = "";
  }
  $.ajax({
    url: "PHP/search.php",
    type: "GET",
    data: {
      author: authorToSearch,
      post: postToSearch,
      tag: tagToSearch,
      dateRange: dateRangeToSearch,
      editorsChoice: editorsChoice,
    },
    success: function (data) {
      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
      }
      markerArray = [];

      if (markerCluster) {
        markerCluster.clearMarkers();
      }
      if (data == "nodata") {
      } else {
        var xml = $.parseXML(data); //data.responseXML;
        var markers = xml.documentElement.getElementsByTagName("marker");
        var firstLat;
        var firstLng;
        Array.prototype.forEach.call(markers, function (markerElem) {
          j++;
          var postLink = markerElem.getAttribute("postLink");
          var point = new google.maps.LatLng(
            parseFloat(markerElem.getAttribute("lattitude")),
            parseFloat(markerElem.getAttribute("longitude"))
          );

          if (j == 1) {
            firstLat = parseFloat(markerElem.getAttribute("lattitude"));
            firstLng = parseFloat(markerElem.getAttribute("longitude"));
          }

          var marker = new google.maps.Marker({
            map: map,
            position: point,
            title: postLink,
          });
          marker.addListener("click", function () {
            $.ajax({
              url: "PHP/markerInfo.php",
              type: "GET",
              data: {
                postLink: marker.getTitle(),
              },
              success: function (data) {
                var infowincontent = data;
                infoWindow.setContent(infowincontent);
                infoWindow.open(map, marker);
              },
              complete: function (data) {
                $(".postImg").on("load", function () {
                  $(this).parent().css("background", "transparent");
                  $(this).fadeTo(500, 1);
                });
                $(".postImg").on("error", function () {
                  $(this).parent().css("background", "transparent");
                  $(this).attr("src", "IMG/imageNotFound.png");
                  $(this).addClass("noImage");
                  $(this).fadeTo(500, 1);
                });
              },
            });
          });
          markerArray.push(marker);
        });
        if (j == 1) {
          map.setCenter({
            lat: firstLat,
            lng: firstLng,
          });
        }
        $(".onoffswitch").show();
        markerCluster = new MarkerClusterer(map, markerArray, {
          zoomOnClick: false,
          imagePath: "https://pinmapple.com/IMG/markerclusterer/m",
        });
        google.maps.event.addListener(
          markerCluster,
          "clusterclick",
          function (cluster) {
            console.log("Check check");
            clusterClicked = true;
            var markers = cluster.getMarkers();
            var markerTitles = [];

            for (i = 0; i < markers.length; i++) {
              markerTitles.push(markers[i].getTitle());
            }

            infoWindow.setContent(
              '<div class="clusterDiv"><div class="infoDiv infoDivCluster"><div class="imageDiv"><img class="postImg"></div><div class="textDiv"><h2 class="postTitle"></h2><p class="postDescription"></p></div></div><div class="infoDiv infoDivCluster"><div class="imageDiv"><img class="postImg"></div><div class="textDiv"><h2 class="postTitle"></h2><p class="postDescription"></p></div></div></div>'
            );
            infoWindow.setPosition(cluster.getCenter());
            infoWindow.open(map);
            //SEND THIS TO PHP AND GET DATA FROM MARKERS WITH THIS TITLE
            $.post(
              "PHP/cluster.php",
              {
                markerTitles: markerTitles,
              },
              function (data) {
                infoWindow.setContent(data);
              }
            ).done(function () {
              $(".postImg").each(function () {
                var attr = $(this).attr("src");
                if (
                  $(this).visible(true) &&
                  (attr == undefined || attr == false)
                ) {
                  var imageSrc = $(this).data("src");
                  $(this).attr("src", imageSrc);
                  $(this).on("load", function () {
                    $(this).parent().css("background", "transparent");
                    $(this).fadeTo(500, 1);
                  });
                  $(this).on("error", function () {
                    $(this).parent().css("background", "transparent");
                    $(this).attr("src", "IMG/imageNotFound.png");
                    $(this).addClass("noImage");
                  });
                }
              });
              var imageLoad;
              $(".clusterDiv").bind("scroll", function () {
                clearTimeout(imageLoad);
                imageLoad = setTimeout(function () {
                  $(".postImg").each(function () {
                    var attr = $(this).attr("src");
                    if (
                      $(this).visible(true) &&
                      (attr == undefined || attr == false)
                    ) {
                      var imageSrc = $(this).data("src");
                      $(this).attr("src", imageSrc);
                      $(this).on("load", function () {
                        $(this).parent().css("background", "transparent");
                        $(this).fadeTo(500, 1);
                      });
                      $(this).on("error", function () {
                        $(this).parent().css("background", "transparent");
                        $(this).attr("src", "IMG/imageNotFound.png");
                        $(this).addClass("noImage");
                      });
                    }
                  });
                }, 200);
              });
            });
          }
        );
      }
    },
  });
}

function showPosition(position) {
  if (myLocationMarker != null) {
    myLocationMarker.setMap(null);
  }
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  $("#getLocation").show();
  $("#getLocation").on("click", function () {
    map.setZoom(16);
    map.setCenter({
      lat: lat,
      lng: long,
    });
    myLocationMarker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: long,
      },
      icon: "IMG/iAmHere.svg",
      map: map,
    });
  });
}

function geoNotWorking() {
  console.log("Geo location is not working.");
}

function copyToClipboard(textToCopy) {
  var aux = document.createElement("input");
  aux.setAttribute("value", textToCopy);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}

function downloadUrl(url, callback) {
  var request = window.ActiveXObject
    ? new ActiveXObject("Microsoft.XMLHTTP")
    : new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };

  request.open("GET", url, true);
  request.send(null);
}

function doNothing() {}
