$(document).ready(function() {

  $("#bs-tour").tooltip({
    placement: 'bottom auto',
    trigger: 'manual',
    container: 'body',
    html: true
  });

  var BSTour = new Tour({
    storage: false,
    onStart: function(){$("#bs-tour").addClass("active")},
    onEnd: function(){$("#bs-tour").removeClass("active")}
  });

  BSTour.addStep({
    orphan: true,
    content: "Follow along to see how <span class='accent'>vidhop.tv</span> works."
  });

  BSTour.addStep({
    onShow: function(){
      $("#cogclick").tab("show");
    },
    onShown: function(){
      $("#channel-container").addClass('open');
    },
    onHide: function(){
      $("#set-blank").tab("show");
    },
    placement: 'top',
    element: "#channel-sel>.btn-group",
    content: "To choose a channel, you select one or more subjects and click <span class='accent'>go</span>",
  });

  BSTour.addStep({
    onShow: function(){
      $(".buttonbox").addClass("active");
    },
    onHide: function(){
      $(".buttonbox").removeClass("active");
    },
    placement: "top",
    element: "#back-n-forth",
    content: "Use the next and previous buttons to quickly find what you want to watch"
  });

  BSTour.addStep({
    onShow: function(){
      $("#mailclick").tab("show")
    },
    onHide: function(){
      $("#set-blank").tab("show");
    },
    placement: 'bottom',
    element: "#mc-embedded-subscribe-form",
    content: "Join the mailling list if you want to hear about new features and content"
  });

  BSTour.addStep({
    placement: 'top',
    element: ".bottom-message",
    content: "Have any suggestions or feedback? Please fill out this short survey!"
  });


  $("#bs-tour").click(function(){

    $(this).tooltip("hide");

    if(!BSTour.ended()){
      BSTour.init();
      BSTour.start();   
    }

    else{
      BSTour.restart();
    }
   

  });

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

  setTimeout(function(){
    $("#bs-tour").tooltip('show');
    setTimeout(function(){
      $("#bs-tour").tooltip('hide');
    }, 10000);

  },500)

 

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