$(document).ready(function() {


  $('#myCarousel').carousel({
    interval: 10000
  });

  var checkBtns = $(".check-btn");

  checkBtns.click(function(){
    $(this).toggleClass("active");
    $(this).children().first().prop( "checked", function( i, val ) {return !val;});
  })

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

  $(".buttonbox, .optionbar, .bottom-message").addClass("fade-in");

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