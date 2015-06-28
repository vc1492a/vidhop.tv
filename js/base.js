$(document).ready(function() {

  //hide any elements that will be loaded after the page finishes loaded all other elements.

  /**
  var allFour = $('#info, #mail, #cog, #keyboard');
  allFour.hide();
  **/


  /**
  The following bit toggles the "expansion" arrow upon the clicking of a channel option selector,
  it is long af because it also has to check for other open selectors and close them since this is an oaccordion menu
  **/


  /*
  var channelOptions = $("#channel-sel>a");
  channelOptions.click(function(){
    var thisOne = $(this);
    var thisOnesIcon = thisOne.children().last().children().last();
    thisOnesIcon.toggleClass("fa-caret-down");
    thisOnesIcon.toggleClass("fa-caret-right");
    if(thisOnesIcon.hasClass("fa-caret-down")){
      channelOptions.each(function(){
        var otherOne = $(this);
        if(!otherOne.is(thisOne)){
          var otherOnesIcon = otherOne.children().last().children().last();
          if(otherOnesIcon.hasClass("fa-caret-down")){
            otherOnesIcon.toggleClass("fa-caret-down");
            otherOnesIcon.toggleClass("fa-caret-right");
          } 
        }
      });
    }
  });*/

  $('#myCarousel').carousel({
    interval: 10000
  });

  var checkBtns = $(".check-btn");

  checkBtns.click(function(){
    $(this).toggleClass("active");
    $(this).children().first().prop( "checked", function( i, val ) {return !val;});
  })

  /*
  var wholeThing = $('#wholething');
  $('#wholething').fadeIn(3000);*/

  //get height of YT port, set all vidcover elements to this height
  var YTHeight = $("#player").parent().outerHeight();
  var vidCovers = $(".vidcover");
  vidCovers.css({
    "min-height":String(YTHeight)+"px"
  });

  $(window).resize(function() {
    //reset vidcover heights when window resizes
    YTHeight = $("#player").parent().outerHeight();
    vidCovers.css({
      "min-height": String(YTHeight)+"px"
    });
  });
});

//these elements load after the window is finished loading all other elements.
$(window).bind("load", function() {
  //option bar

   var idleMouseTimer;
   var forceMouseHide = false;
   $("body").css('cursor', 'none');
   $(window).mousemove(function() {
      clearTimeout(idleMouseTimer);
      $("body").css('cursor', '');
      idleMouseTimer = setTimeout(function() {
              $("body").css('cursor', 'none');
      }, 4000);
   });

  $('.optionbar li').click(function(){


    var theButton = $(this);

    if (theButton.hasClass('active')) {

      setTimeout(function(){
        $('#set-blank').tab('show');
      },1);
    }
  });

  $("#infoclick").click(function(){
    $("#myCarousel").carousel(0);
  });

  $('#channel-sel label, #channel-sel input').click(function(e){
    e.stopPropagation();
  });

});