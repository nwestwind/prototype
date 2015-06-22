var $twpPrototype = {
    init: function() {
    	//add 'no-mq' class to html if media queries not supported
    	function mediaQueriesSupported() {
    		return (typeof window.matchMedia != "undefined" || typeof window.msMatchMedia != "undefined");
		}
		if (!mediaQueriesSupported()) {
			$('html').addClass('no-mq');
		}
  
		// Parallax for the heros
		if (!$('html').hasClass('no-mq')) {
		
			$(window).bind('scroll',function(e){
				parallaxScroll();
			});

			function parallaxScroll(){
				var scrolledY = $(window).scrollTop();
				$('section').css({'transform' : 'translateY('+ (scrolledY  / 2 )+ 'px)'});
			}
		}

		var navBtn = $('.sb-toggle');
		navBtn.click(function(){
			$('.sb-menu').toggle();
			$('html').toggleClass('menu-open');
			return false;
		})
    }
}

$(document).ready(function(){
    $twpPrototype.init();
});
