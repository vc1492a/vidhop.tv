$(document).ready(function() {
    //hide any elements that will be loaded after the page finishes loaded all other elements.
    var allFour = $('#info, #mail, #cog, #keyboard');
    allFour.hide();
    var wholeThing = $('#wholething');
    $('#wholething').fadeIn(3000);
});

//these elements load after the window is finished loading all other elements.
$(window).bind("load", function() {
   //option bar
   var infoClick = $('#info');
   var mailClick = $('#mail');
   var cogClick = $('#cog');
   var keyboardClick = $('#keyboard');

   var allFour = $('#info, #mail, #cog, #keyboard');

   infoClick.hide();
   mailClick.hide();
   cogClick.hide();
   keyboardClick.hide();

   //I want to find a way to highlight the symbols while the menu is shown
   $('#infoclick').click(function(e) {
    if(!infoClick.is(':visible')){
        allFour.fadeOut(300);
    }
       infoClick.animate({
           height: "toggle",
           opacity: "toggle",
       }, 1000);
       e.preventDefault();
   });

   $('#mailclick').click(function(e) {
    if(!mailClick.is(':visible')){
        allFour.fadeOut(300);
    }
       mailClick.animate({
           height: "toggle",
           opacity: "toggle",
       }, 1000);
       e.preventDefault();
   });

   $('#cogclick').click(function(e) {
    if(!cogClick.is(':visible')){
        allFour.fadeOut(300);
    }
       cogClick.animate({
           height: "toggle",
           opacity: "toggle",
       }, 1000);
       e.preventDefault();
   });

   $('#keyboardclick').click(function(e) {
       if(!keyboardClick.is(':visible')){
           allFour.fadeOut(300);
       }
       keyboardClick.animate({
           height: "toggle",
           opacity: "toggle",
       }, 1000);
       e.preventDefault();
   });



   //interaction with channel controls
   var chanButton = $('.chan');
   var choice;

   chanButton.click(function() {
    choice = $(this);
    //first check to see if it is the only active class
    if (choice.hasClass('active')){
        if (!noOtherActive(choice.parent())) {choice.toggleClass('active');}
    }
    else {choice.toggleClass('active');}
   });

   function noOtherActive(parent) {
    var output = true;
    parent.children().each( function() {
        var child = $(this);
        if (child.html() != choice.html() && child.hasClass('active')) {
            output = false;
        }
    });

    return output;
   }

   //hide mouse on timeout
   var idleMouseTimer;
   var forceMouseHide = false;
   $("body").css('cursor', 'none');
   $("#wrapper").mousemove(function(ev) {
           if(!forceMouseHide) {
                   $("body").css('cursor', '');
                   clearTimeout(idleMouseTimer);
                   idleMouseTimer = setTimeout(function() {
                           $("body").css('cursor', 'none');
                           forceMouseHide = true;
                           setTimeout(function() {
                                   forceMouseHide = false;
                           }, 200);
                   }, 5000);
           }
   });

   //fade out
   $('.buttonbox').fadeTo(0, '0.3').hover(function() {
       $(this).fadeTo(500, 1);
   }, function() {
       $(this).fadeTo(500, '0.3');
   });

   $('.optionbar').fadeTo(0, '0.3').hover(function() {
       $(this).fadeTo(500, 1);
   }, function() {
       $(this).fadeTo(500, '0.3');
   });

   $('.thumbsmenuL').fadeTo(0, '0.3').hover(function() {
       $(this).fadeTo(500, 1);
   }, function() {
       $(this).fadeTo(500, '0.3');
   });

   $('.thumbsmenuR').fadeTo(0, '0.3').hover(function() {
       $(this).fadeTo(500, 1);
   }, function() {
       $(this).fadeTo(500, '0.3');
   });

   $('.consider-donating').fadeTo(0, '0.3').hover(function() {
          $(this).fadeTo(500, 1);
      }, function() {
          $(this).fadeTo(500, '0.3');
      });
});