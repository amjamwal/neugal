$.fn.extend({
    visible: function( data ) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(this).offset().top;
        var elemBottom = elemTop + $(this).outerHeight();
        return ((docViewBottom >= elemTop) && (elemBottom >= docViewTop));
    }
});

(function($) {
    var $event = $.event;
    var $special;
    var resizeTimeout;
    $special = $event.special.debouncedresize = {
        setup: function() {
            $( this ).on( 'resize', $special.handler );
        },
        teardown: function() {
            $( this ).off( 'resize', $special.handler );
        },
        handler: function( event, execAsap ) {
            var context = this;
            var args = arguments;
            var dispatch = function() {
                event.type = 'debouncedresize';
                $event.dispatch.apply( context, args );
            };
            if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
            execAsap ? dispatch() : resizeTimeout = setTimeout( dispatch, $special.threshold );
        },
        threshold: 150
    };
})(jQuery);

function recalcParallax($item, rules) {
    var cssScroll = $(window).scrollTop();
    for (i = 0; i < (rules.length - 1); i++) {
        var cssRule = rules[i].split(':');
        var cssAttr = cssRule[0];
        var cssVal = cssRule[1];
        if (cssVal.indexOf('px') > 0) {
            cssVal = cssVal.replace('px', '') * cssScroll + 'px';
            $item.css(cssAttr, cssVal);
        } else {
            cssVal = cssVal * cssScroll;
            if ( cssAttr === 'opacity' && cssVal >= 1 ) cssVal = 1;
            if ( cssAttr === 'opacity' && cssVal <= 0 ) cssVal = 0;
            $item.css(cssAttr, cssVal);
        }
    }
}

function retestVisibility($targ) {
    var args = $targ.attr('data-visible').split('--');
    var $item = $( args[0] );
    var itemVis = args[0].replace('.', '') + '--' + args[1];
    var itemHid = (args.length > 2) ? args[0].replace('.', '') + '--' + args[2] : false;
    var blnVis = $targ.visible();
    if (blnVis && !$item.hasClass( itemVis )) { $item.addClass(itemVis); if (itemHid) $item.removeClass(itemHid); }
    else if (!blnVis && $item.hasClass( itemVis )) { $item.removeClass(itemVis); if (itemHid) $item.addClass(itemHid); }
    else if (itemHid && !blnVis && !$item.hasClass( itemHid )) { $item.removeClass(itemVis).addClass(itemHid); }
}

function resizeImage($img, $fill) {
    var $clone = new Image();
    $clone.src = $img.attr('src');
    var imgRatio = $clone.width / $clone.height;
    var imgWidth = $fill.width() + 10;
    var imgHeight = $fill.height() + 10;
    $clone = null;
    if ((parseInt(imgWidth / imgRatio)) < imgHeight) {
        $img.css({
            'width' : parseInt(imgHeight * imgRatio) + 'px',
            'height' : parseInt(imgHeight) + 'px',
            'opacity' : 1,
            'position' : 'absolute',
            'top' : '50%',
            'left' : '50%',
            'margin-top' : '-' + parseInt(imgHeight / 2) + 'px',
            'margin-left' : '-' + parseInt((imgHeight * imgRatio) / 2) + 'px'
        });
    } else {
        $img.css({
            'width' : parseInt(imgWidth) + 'px',
            'height' : parseInt(imgWidth / imgRatio) + 'px',
            'opacity' : 1,
            'position' : 'absolute',
            'top' : '50%',
            'left' : '50%',
            'margin-top' : '-' + parseInt((imgWidth / imgRatio) / 2) + 'px',
            'margin-left' : '-' + parseInt(imgWidth / 2) + 'px'
        });
    }
}

$(window).on('load debouncedresize scroll', function( event ) {
    $('*[data-parallax]').each(function() { recalcParallax( $(this), $(this).attr('data-parallax').split(';') ) });
    $('*[data-visible]').each(function() { retestVisibility( $(this) ) });
});

$('body').on('load', 'img[data-fill]', function( event ) {
    resizeImage( $(this), $( $(this).attr('data-fill') ) );
});

$(window).on('load debouncedresize', function( event ) {
    $('img[data-fill]').each(function() {
        resizeImage( $(this), $( $(this).attr('data-fill') ) );
        $('body').off('load', $(this));
    });
});

var $viewport = $('html, body');

$viewport.on('scroll mousedown DOMMouseScroll mousewheel keyup', function( event ) {
    if (event.which > 0 || event.type === 'mousedown' || event.type === 'mousewheel') {
        $viewport.stop();
    }
});

$('a[data-scroll]').on('click', function( event ) {
    // TODO : Introduce Mason settings to define scroll offsets.
    event.preventDefault();
    var $btn = $(this);
    var $anchor = ($( $btn.attr('data-scroll') ).length > 0) ? $( $btn.attr('data-scroll') ) : $('a[name=' + $btn.attr('data-scroll').replace('#', '') + ']');
    var intScroll = $anchor.offset().top;
    var intSpeed = intScroll - $(document).scrollTop();
    if (intSpeed < 0) intSpeed = -(intSpeed);
    $viewport.animate({ 'scrollTop': intScroll + 'px' }, { duration: intSpeed });
});

$('button[data-toggle]').on('click', function( event ) {
    var args = $(this).attr('data-toggle').split('--');
    var $block = $( args[0] + (args.length > 2 ? '--' + args[1] : '') );
    $block.toggleClass( args[0].replace('.', '') + '--' + args[ args.length - 1 ] );
});

$('button[data-add]').on('click', function( event ) {
    var args = $(this).attr('data-add').split('--');
    var $block = $( args[0] + (args.length > 2 ? '--' + args[1] : '') );
    $block.addClass( args[0].replace('.', '') + '--' + args[ args.length - 1 ] );
});

$('button[data-remove]').on('click', function( event ) {
    var args = $(this).attr('data-remove').split('--');
    var $block = $( args[0] + (args.length > 2 ? '--' + args[1] : '') );
    $block.removeClass( args[0].replace('.', '') + '--' + args[ args.length - 1 ] );
});

$('button[data-tab]').on('click', function( event ) {
    var args = $(this).attr('data-tab').split('--');
    if ($( args[0] + '--' + args[1] ).hasClass( args[0].replace('.', '') + '--' + args[ args.length - 1 ] )) {
        $( args[0] ).removeClass( args[0].replace('.', '') + '--' + args[ args.length - 1 ] );
    } else {
        $( args[0] ).removeClass( args[0].replace('.', '') + '--' + args[ args.length - 1 ] );
        $( args[0] + '--' + args[1] ).addClass( args[0].replace('.', '') + '--' + args[ args.length - 1 ] );
    }
});

$('menu[data-select]>ul').on('click', function( event ) {
    event.stopPropagation();
});

$('menu[data-select]>div').on('click', function( event ) {
    event.stopPropagation();
    var select = $(this).parent('menu');
    var openSelect = function() { select.addClass('ui_select--selected'); $('body').on( 'click', closeSelect ); }
    var closeSelect = function() { select.removeClass('ui_select--selected'); $('body').off( 'click', closeSelect ); }
    select.hasClass('ui_select--selected') ? closeSelect() : openSelect();
});
