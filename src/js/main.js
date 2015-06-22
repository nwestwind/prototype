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
				// $('section').css({'transform' : 'translateY('+ (scrolledY  / 2 )+ 'px)'});
			}
		}

		var navBtn = $('.sb-toggle');
		navBtn.click(function(){
			$('.sb-menu').toggle();
			$('html').toggleClass('menu-open');
			return false;
		});


		getSections();

		function getSections() { 	
			$('section').each(function(){
				var id = $(this).attr('id');

				var windowHash  = window.location.hash;

				$('nav').append('<a href="#'+id+'" class="">'+id+'</a>');
			});

			
		}

		

		function showContent($navHash) {

			if($('.content').attr('id') != $($navHash).text()); {

				$('.content').hide();
				$($navHash).show();
			}
			// console.log($navHash);
		}

		var $navLink = $('nav').find('a');

		$navLink.each(function(index){
			var $el = $(this),
				$navHash = $el.attr('href');
			
				$el.click(function(){ 
					$el.siblings().removeClass('active');
					$el.addClass('active');
					showContent($navHash);	

					window.location.hash = $navHash;

					return false;
				});
		});

    }
}

$(document).ready(function(){
    $twpPrototype.init();
});
