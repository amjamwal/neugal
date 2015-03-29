$(document).ready(function() {


    /////////////////////////////
    // HERO SLIDER
    /////////////////////////////
    $('.hero__slider').iosSlider({
        snapToChildren: true,
        snapSlideCenter: true,
        infiniteSlider: true,
        autoSlide: true,
        autoSlideTimer: 7000,
        autoSlideTransTimer: 2000,
        autoSlideHoverPause: false,
        onSliderLoaded: slideContentChange,
        onSlideChange: slideContentChange,
        navSlideSelector: slideNavigation('hero__slider', 'hero__slider')
    });

    function slideContentChange(args) {
        $('.hero__slider__item, .hero__slider__pager__item').removeClass('active'),
            $('.hero__slider__item:eq(' + (args.currentSlideNumber - 1) + '), .hero__slider__pager__item:eq(' + (args.currentSlideNumber - 1) + ')').addClass('active');
    }

    function slideNavigation(container, pager) {
        $('.'+ container +'').append('<div class="'+ pager +'__pager"><div class="'+ pager +'__pager__wrap"></div>');
        var slideCount = $('.'+ pager +'__item').length;
        for ( var i = 0; i < slideCount; i++ ) {
            $('.'+ pager +'__pager__wrap').append('<span class="'+ pager +'__pager__item ' + pager +'__pager__item--' + (i + 1) + 'active"></span>');
        }
        return $('.' + pager + '__pager__wrap .' + pager + '__pager__item');
    }

    //////////////////////
    // CHARACTER LIMITS
    //////////////////////
    function characterLimit(e, limit){
        $(e).each(function(i){
            textLength = $(this).text().length;
            if(textLength > limit) {
                $(this).text($(this).text().substr(0, limit) + '...');
            }
        });
    }
    characterLimit(".news__list__item__info__title", 70);

    //////////////////////
    // HOME NEWS THUMBS
    //////////////////////
    $(window).on("resize load", function () {
        var newsThumbWidth = $('.news__list__item__img').outerWidth();
        $('.news__list__item__img').css("height", newsThumbWidth + "px");
    });

    //////////////////////
    // NEWS CYCLE
    //////////////////////
    $('.news__list').cycle({
        fx: 'scrollHorz',
        timeout: 7000,
        delay: 3500,
        speed: 1000,
        slides: '.news__list__item',
        prev:   '.home__news--prev',
        next:   '.home__news--next'
    });

    //////////////////////
    // EVENT INTERACTION
    /////////////////////
    $('.calendar__events__day__link').hover(function(){
        $(this).parent().toggleClass('event__hover');
    });

    //////////////////////
    // LOAD ON SCROLL
    //////////////////////
    function isOnScreen(e, offset) {
        var viewTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (((viewTop + windowHeight) - offset) > $(e).offset().top) {
            $(e).addClass('inview');
        }
    };
    $(window).scroll(function(){
        isOnScreen ('.home__picturelink', 170);
    });
    isOnScreen ('.home__picturelink', 170);




    //////////////////////
    // DISABLE RIGHT CLICK(!!!)
    //////////////////////
    document.oncontextmenu = new Function("return false;");

    //////////////////////
    // QUICKLINKS MOBILE
    //////////////////////
    $('.quicklinks__btn').click(function(){
        $('.quicklinks__list').slideToggle();
        $(this).toggleClass('active');
    });

    //////////////////////
    // LOCK MENU
    //////////////////////
    $(window).on('scroll load', function() {
        var menuDistance = $('.menu').offset().top;
        var top = $(window).scrollTop();
        $('.mason').toggleClass( 'menu__locked', (top >= menuDistance) );
    });

    //////////////////////
    // HIDE MENU ON SCROLL DOWN
    //////////////////////
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = 400;

    $(window).on('scroll', function(event) {
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();
        if(Math.abs(lastScrollTop - st) <= delta)
            return;
        if (st > lastScrollTop && st > navbarHeight){
            $('.menu__sidebar').addClass('hide');
        } else {
            if(st + $(window).height() < $(document).height()) {
                $('.menu__sidebar').removeClass('hide');
            }
        }
        lastScrollTop = st;
    }

});
