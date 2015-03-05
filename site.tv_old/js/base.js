/**
 * @author Taylor
 */

$(document).ready(function () {
	var navicon = $('.navicon');
	var nav = $('.nav');
	navicon.click(function () {
		if (navicon.hasClass("active")) {navicon.removeClass("active");nav.hide();}
		else {navicon.addClass("active");nav.show();}
	});
});
