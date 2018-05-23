//  평형정보  //

$(function() {
  $('.space-item-list').on('click', 'a', function(event) {
    event.preventDefault();
    $('.space-item-list').find('a').removeClass('list-active');
    $(this).addClass('list-active');
    $('.space-content-container').find('.space-content').removeClass('space-content-active');
    $($(this).attr('href')).addClass('space-content-active');
  });
});

//  E모델하우스  //

$(function() {
  $('.house-header').on('click', '.tab-item', function(event) {
    event.preventDefault();

    var $header = $(event.delegateTarget);
    var $selected = $(this);
    // 선택 표시
    $header.find('.tab-item').removeClass('active');
    $selected.addClass('active');
    $header.find('.current-view').text($selected.text());
    // 뷰어 변경
    $('#viewer').attr('src', $selected.attr('href'));
  }).find('.tab-item').first().trigger('click');
});


//  지도  //

(function(list, factory) {
  // 지도 생성
  var maps = {};
  for (var selector in list) {
    var item = list[selector];
    var map = factory(selector, item);
    maps[selector] = map;
  }

//  이벤트  //
  var moveMapCenterHandler = function(event) {
    var selector = event.currentTarget.dataset.target;
    var map = maps[selector];
    var data = list[selector];
    map.setCenter(new daum.maps.LatLng(data.lat, data.lon));
  };
  Array.prototype.forEach.call(document.querySelectorAll('.btn-map-point'), function(button) {
    button.addEventListener('click', moveMapCenterHandler);
  });
})({
  '#map': {
    lat: 35.5556822,
    lon: 129.3309927,
    zoom: 4,
    markerImage: contextPath + 'images/map-marker1.png',
    markerSize: { w: 108, h: 71 },
    markerOffset: { x: 50, y: 69 }
  },
  '#map2': {
    lat: 35.562839,
    lon: 129.309496,
    zoom: 3,
    markerImage: contextPath + 'images/map-marker3.png',
    markerSize: { w: 59, h: 39 },
    markerOffset: { x: 27, y: 69 }
  }
}, function(selector, item) {
  var container = document.querySelector(selector);
  if (container == null) {
    return;
  }
  var location = new daum.maps.LatLng(item.lat, item.lon);

  var map = new daum.maps.Map(container, {
    center: location,
    level: item.zoom
  });

  map.addControl(new daum.maps.MapTypeControl(), daum.maps.ControlPosition.TOPRIGHT);
  map.addControl(new daum.maps.ZoomControl(), daum.maps.ControlPosition.RIGHT);

  var markerImage = new daum.maps.MarkerImage(item.markerImage, new daum.maps.Size(item.markerSize.w, item.markerSize.h), {
    offset: new daum.maps.Point(item.markerOffset.x, item.markerOffset.y)
  });
  var marker = new daum.maps.Marker({
    position: location,
    image: markerImage
  });
  marker.setMap(map);

  return map;
});

//  헤더 업데이트 //

var headerSize = 90;

window.headerScrollOffset = function() {
  return 280;
};

(function() {
  var header = document.querySelector('#site-header');
  var headerChangeOffset = 0;

  //  화면 크기 변경 처리 //

  var windowResizeHandler = function(event) {
    headerSize = header.querySelector('.header-alt').scrollHeight;
    headerChangeOffset = headerScrollOffset() - headerSize;
  };
  window.addEventListener("resize", windowResizeHandler);
  setTimeout(windowResizeHandler, 0);

  //  스크롤시 헤더 클래스 적용  //

  var windowScrollHandler = function(event) {
    var y = Math.round(window.pageYOffset);
    // 헤더 클래스 변경
    if (y >= headerChangeOffset) {
      header.classList.add('on');
    } else {
      header.classList.remove('on');
    }
  };
  window.addEventListener("scroll", windowScrollHandler);
  setTimeout(windowScrollHandler, 0);
})();

//  TOP 버튼  //

(function() {
  var topButton = document.querySelector('.btn-top');
  var topButtonBottomOffset = 0;

  if (topButton) {
    //  화면 크기 변경 처리 //
    var windowResizeHandler = function(event) {
      topButtonBottomOffset = document.querySelector('body').scrollHeight - window.innerHeight - 120;
    };
    window.addEventListener("resize", windowResizeHandler);
    setTimeout(windowResizeHandler, 0);

    //  스크롤시 TOP 버튼 처리 //
    var windowScrollHandler = function(event) {
      var y = Math.round(window.pageYOffset);
      // 상단에서 TOP 버튼 표시여부
      if (y > 100) {
        topButton.classList.remove('hide');
      } else {
        topButton.classList.add('hide');
      }
      // 하단에서 TOP 버튼 위치 //
      if (y >= topButtonBottomOffset) {
        topButton.classList.add('hold');
      } else {
        topButton.classList.remove('hold');
      }
    };
    window.addEventListener("scroll", windowScrollHandler);
    windowScrollHandler();

    //  버튼 클릭 //
    topButton.addEventListener('click', function(event) {
      event.preventDefault();
      $('html').animate( { scrollTop : 0 }, 400 );
    });
  }
})();
