
//  마우스휠 and 스크롤, 항목 이동

window.headerScrollOffset = function() {
  return window.innerHeight;
};

(function() {
  var wheelling = false;
  var offsets = [], reverseOffsets = [], offsetById = {}, idByOffset = {};
  var indicator = document.querySelector('#indicator > .indicator-list');
  var indicatorItems = indicator.querySelectorAll('.indicator-item');
  var video = document.querySelector('#pr-video');

  function scrollTo(top, duration) {
    wheelling = true;
    if (duration == null) {
      duration = 600;
    }
    // 주소 업뎃
    updateAddressByOffset(top);
    // 인디케이터 업뎃
    var index = offsets.findIndex(function(x) { return top == x });
    updateIndicator(index);
    // 애니메이션
    $('html').animate({
      scrollTop: top
    }, duration, function(){
      wheelling = false;
    });
  }

  function updateAddressByOffset(offset) {
    // 현재 위치의 링크 주소 가져오기
    var id = idByOffset[offset];
    if (id == null) {
      offset = reverseOffsets.find(function(k) { return (offset - 1) >= k });
      id = idByOffset[offset];
    }
    // 주소 강제 설정
    history.replaceState({}, '', id === '#home' ? location.pathname : id);
  }

  function updateIndicator(index) {
    // 인디케이터 active 설정
    Array.prototype.forEach.call(indicatorItems, function(element) {
      element.classList.remove('active');
    });
    var target = indicatorItems.item(index);
    target.classList.add('active');
    // 인디케이터 색상 설정
    var color = target.dataset['color'];
    indicator.classList.remove('color-white');
    indicator.classList.remove('color-brown');
    indicator.classList.add('color-' + color);
  }


// 마우스 휠 스크롤

  window.addEventListener('mousewheel', function(event) {
    // 스크롤중이면 무시
    if (wheelling) {
      event.preventDefault();
      return;
    }
    // 오프셋 계산
    var offset = 0;
    var y = Math.round(window.pageYOffset);
    if ((event.wheelDeltaY || event.wheelDelta) > 0) {
      offset = reverseOffsets.find(function(x) { return y > x }); // wheel up
    } else {
      offset = offsets.find(function(x) { return y < x }); // wheel down
    }
    // 영역 밖에는 스크롤 이벤트 처리 안함 (푸터 영역)
    if (offset === undefined) {
      return
    }
    // 스크롤 시작
    event.preventDefault();
    scrollTo(offset);
  });

  //  화면 스크롤

  var windowScrollHandler = function(event) {
    var y = Math.round(window.pageYOffset);
    // 주소 업뎃, 인디케이터 업뎃
    if (!wheelling) {
      updateAddressByOffset(y);
      var index = reverseOffsets.length - 1 - reverseOffsets.findIndex(function(x) { return y >= x });
      updateIndicator(index);
    }
    // 홍보영상
    if (index == 3) {
      video.play();
    } else {
      video.pause();
    }
  };
  window.addEventListener('scroll', windowScrollHandler);

  //  인디케이터 클릭

  indicator.addEventListener('click', function(event) {
    event.preventDefault();
    var target = event.target;
    if (target && target.matches('.indicator-item')) {
      var index = Array.prototype.indexOf.call(indicatorItems, target);
      var offset = offsets[index];
      scrollTo(offset);
    }
  });

  //  메뉴 클릭

  var menuClickHandler = function(event) {
    if (event.target) {
      event.preventDefault();
      var target = event.target;
      // 이미지일 경우 상위 태그를 가져온다
      if (target.tagName === 'IMG') {
        target = target.parentNode;
      }
      // 링크 처리
      if (target.matches('.menu-item, .logo-link')) {
        var offset = offsetById[target.hash] || 0;
        scrollTo(offset);
        history.replaceState({}, '', offset == 0 ? location.pathname : target.hash);
      } else if (target.matches('.btn-scroll')) {
        var offset = offsets[1];
        scrollTo(offset);
      }
    }
  };
  //document.querySelector('#site-header').addEventListener('click', menuClickHandler);
  document.querySelector('.btn-scroll').addEventListener('click', menuClickHandler);

  //  브라우저 리사이즈

  var windowResizeHandler = function(event) {
    var cpos = [];
    var c1h = window.innerHeight;
    var height = c1h - headerSize;
    var width = window.matchMedia('(orientation: landscape)').matches ? Math.min(height * 1.3348, 1180) : '';

    // 헤더, 푸터 크기 설정
    Array.prototype.forEach.call(document.querySelectorAll('#site-header > .header, #site-header > .header-alt, footer > .contents'), function(element) {
      element.style.width = width + 'px';
    });
    // 컨텐츠 영역 크기 설정, 컨텐츠 영역 위치 가져오기
    Array.prototype.forEach.call(document.querySelectorAll('.container-cont'), function(element) {
      element.querySelector('.contents').style.width = width + 'px';
      var offset = Math.max(element.offsetTop - headerSize, 0);
      cpos.push({
        id: element.id,
        offset: offset
      });
    });

    // 컨텐츠 영역 위치 저장
    cpos.forEach(function(item) {
      if (item.id != '') {
        offsetById['#' + item.id] = item.offset;
        idByOffset[item.offset] = '#' + item.id;
      }
    });
    var a = cpos.map(function(item) { return item.offset }).sort(function(a, b) { return a - b; });
    offsets = Array.from(a);
    reverseOffsets = Array.from(a.reverse());

    // 상태 업뎃
    windowScrollHandler(null);
  };
  window.addEventListener('resize', windowResizeHandler);
  setTimeout(windowResizeHandler, 0);
})();

$(document).ready(function(){

  $(window).scroll(function(){
      if ($(window).scrollTop() >= 974) {
         $('header .wrap').addClass('on');
      }
      else {
         $('.sub').removeClass('fixed-header');
      }

      if ($(window).scrollTop() < 300 ) {
        $('.layout-header').addClass('sub-fixed-header');
     }
     else {
        $('.layout-header').removeClass('sub-fixed-header');
     }
  });

  // header
  $('.menu .menu-item').on('mouseenter', function(event) {
    $(this).addClass('menu-active');
  }).on('mouseleave', function(event) {
    $(this).removeClass('menu-active');
  });

  var $layoutHeader = $('.layout-header');

  $layoutHeader.on('mouseenter', '.menu', function(event) {
    var $menu = $(this);
    var $target = $($menu.data('target'));
    $layoutHeader.find('.sub-menu').addClass('on');
    $layoutHeader.find('.menu').removeClass('on');
    $(this).addClass('on');
    $target.addClass('on');
  }).on('mouseleave', '.menu', function(event) {
    var $menu = $(this);
    var $target = $($menu.data('target'));
    $target.removeClass('on');
    $(this).removeClass('on');
    $layoutHeader.find('.sub-menu').removeClass('on');
  }).on('mouseenter', '.sub-menu', function(event) {
    var $menu = $(this);
    if ($menu.find('.sub-menu-wrap.on').length == 0) {
      $menu.removeClass('on');
    } else {
      $menu.addClass('on');
    }
  }).on('mouseleave', '.sub-menu', function(event) {
    var $menu = $(this);
    $menu.removeClass('on');
  }).on('mouseenter', '.sub-menu-wrap', function(event) {
    var $menu = $(this);
    $menu.addClass('on');
    $layoutHeader.find('.menu[data-target="#' + $menu.attr('id') + '"]').addClass('on');
  }).on('mouseleave', '.sub-menu-wrap', function(event) {
    var $menu = $(this);
    $menu.removeClass('on');
    $layoutHeader.find('.menu[data-target="#' + $menu.attr('id') + '"]').removeClass('on');
  });


  $('.btn-download-pdf').click(function(){
    alert('입주자모집공고는 25일 오픈일에 공개됩니다.');
  })

});
