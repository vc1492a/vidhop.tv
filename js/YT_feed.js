$(document).ready(function() {
	//option buttons
	var chanSelector = $('#chanSelector');
	var sendChoices = $('#sendChoices');
	var combos;
	var query;
	var vids;
	var selection = 0;
	
	//we can change this
	query = 'cats=scishort+natureshort+miscshort';
	
	//get initial set of video Ids
	$.ajax({
		url: "php/send_ids.php",
		data: query,
		success: function(data) {
			vids = $.makeArray(JSON.parse(data));
			selection = 0;
		}
	});
	
	//load YT player iframe API
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	
	//Create a YT player after the API downloads
	var player;
	window.onYouTubeIframeAPIReady = function() {
		player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: vids[selection],
		playerVars: {autoplay: 1,fs: 1,modestbranding: 1},
		events: {'onStateChange': onPlayerStateChange}
	    });
	
		//Play next vid ID on list after vid ends
		function onPlayerStateChange (event) {
			if (event.data === 0){
				selection += 1;
		    		player.loadVideoById(vids[selection]);
			}
		} 
		
		$('#prev').click( function() {
	    	if (selection == 0) {
	    		selection = vids.length - 1;
	    	}
	    	else {
	    		selection -= 1;
	    	}
	    	player.loadVideoById(vids[selection]);
	    });
	    $('#next').click( function() {
	    	if (selection == vids.length - 1) {
	    		selection = 0;
	    	}
	    	else {
	    		selection += 1;
	    	}
	    	player.loadVideoById(vids[selection]);
	    });
	    $('#prevtext').click( function() {
	    	if (selection == 0) {
	    		selection = vids.length - 1;
	    	}
	    	else {
	    		selection -= 1;
	    	}
	    	player.loadVideoById(vids[selection]);
	    });
	    $('#nexttext').click( function() {
	    	if (selection == vids.length - 1) {
	    		selection = 0;
	    	}
	    	else {
	    		selection += 1;
	    	}
	    	player.loadVideoById(vids[selection]);
	    });
	    
	    //get list of all choices
		sendChoices.click( function () {
			combos = [];
			var outputArray = [];
			var fields = chanSelector.children();
			fields.each( function(){
				field = $(this);
				outputArray[field.attr('name')] = [];
				var choices = field.children();
				choices.each( function() {
					var choice = $(this);
					if (choice.hasClass('active')){
						outputArray[field.attr('name')].push(choice.attr('name'));
					}
				});
			});
			
			//make a string for php (need to make this more complex for more than two category types)
			$.each(outputArray['category'], function(index, catValue){
				$.each(outputArray['duration'], function(index, durValue) {
					combos.push(catValue + durValue);
				});
			});
			
			
			query = 'cats=' + combos.join('+');
			getIds(query);
			
		});
		
		function getIds(query) {
			//This gets a list of videoIDs from the server
			$.ajax({
				url: "php/send_ids.php",
				data: query,
				success: function(data) {
					vids = $.makeArray(JSON.parse(data));
					selection = 0;
					player.loadVideoById(vids[selection]);
				}
			});
		}
		
	};
	
	//keyboard shortcuts. Currently cannot use within YT_shortcuts as vids are not defined there. 
	window.onkeyup = function(e) {
	    var key = e.keyCode ? e.keyCode : e.which;
    	//space bar
		if (key == 32) {
			if (player.getPlayerState(1)) {
				player.pauseVideo(vids[selection]);
			}
			//replay (after pausing) currently not supported
			/*if (player.getPlayerState(0)) {
				player.playVideo(vids[selection])
			}*/
			else {
				player.playVideo(vids[selection]);
			}
		}
		//m key
		if (key == 77) {
			if (player.isMuted() == false) {
				player.mute(vids[selection]);
			}
			else {
				player.unMute(vids[selection]);
			}
		}
		//f key
		if (key == 70) {
			if (player.getPlaybackRate() == 1) {
				player.setPlaybackRate(1.5);
			}
			if (player.getPlaybackRate() == 1.5) {
				player.setPlaybackRate(2);
			}
			if (player.getPlaybackRate() == 2) {
				player.setPlaybackRate(1);
			}
		}
		//r key
		if (key == 82) {
			if (player.getPlaybackRate() == 1) {
				player.setPlaybackRate(0.5);
			}
			if (player.getPlaybackRate() == 0.5) {
				player.setPlaybackRate(0.25);
			}
			if (player.getPlaybackRate() == 0.25) {
				player.setPlaybackRate(1);
			}
		}
		//escape
		//enter
		//ctrl
		//alt
		//shift
		//up arrow
		//left arrow
	    if (key == 37) {
	        if (selection == 0) {
	            selection = vids.length - 1;
	        }
	        else {
	            selection -= 1;
	        }
	        player.loadVideoById(vids[selection]);
		}
		//bottom arrow
		//right arrow
		if (key == 39) {
	        if (selection == vids.length - 1) {
	            selection = 0;
	        }
	        else {
	            selection += 1;
	        }
	        player.loadVideoById(vids[selection]);
	    }
	}
});

//player.getCurrentTime() for use to display an ad after x amount of time of video play.
//player.getPlaybackQuality() retrives current video quality. have filters for sd/hd and skip to next video if not hd
//player.setPlaybackQuality(suggestedQuality:String):Void
//player.getAvailableQualityLevels():Array