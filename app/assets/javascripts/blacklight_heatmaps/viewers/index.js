Blacklight.onLoad(function () {
  'use strict';

  $('[data-index-map]').each(function () {
    var $el = $(this);
    var requestUrl = $el.data().searchUrl + '&format=json';
    var geometryField = $el.data().geometryField;
    var template = $el.data().sidebarTemplate;

    var map = L.map($el[0].id).setView([0, 0], 1);
    var basemap = L.tileLayer($el.data().basemap, {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    }).addTo(map);

    var solrLayer = L.solrHeatmap(requestUrl, {
      field: geometryField,
      maxSampleSize: 50,
    }).addTo(map);

    var sidebar = L.control.sidebar('index-map-sidebar', {
      position: 'right',
    });

    map.addControl(sidebar);

    solrLayer.on('click', function (e) {
      if (!sidebar.isVisible()) {
        map.setView(e.latlng);
      } else {
        var point = map.project(e.latlng);
        var offset = sidebar.getOffset();
        var newPoint = L.point(point.x - (offset / 2), point.y);
        map.setView(map.unproject(newPoint));
      }

      sidebar.show();
    });

    solrLayer.on('dataAdded', function (e) {
      if (e.response && e.response.docs) {
        var html = '';
        $.each(e.response.docs, function (i, value) {
          html += L.Util.template(template, value);
        });

        sidebar.setContent(html);
      }
    });
  });
});