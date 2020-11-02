$(function () {
	'use strict';


	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			  return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			  return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
	      return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('min-height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('min-height', $(window).height());
			});
		}

	};

  $(function(){
		fullHeight();
  });

	var $ab = $('.animate-box');
	$ab.each(function(idx, item){
		$(item).waypoint(function(){
			if (idx % 2 ) $(item).addClass('fadeInLeft')
			else $(item).addClass('fadeInRight')
		}, {offset: '70%'})
	});
}());
