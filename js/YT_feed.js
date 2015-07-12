//we need to fix the errors in the player load. I think the YouTube API needs some time to load
//loading the api just prior to creating the playlist in YT_feed.js causes errors 3/4ths of the time
//in Chrome and 2/3 of the time in Safari. Moving that load to the top of this file does nothing for Chrome
//but improves Safari significantly to failing to load just 1/6 of the time.

//I pushed some elements in base.js to load after the page is finished loading.
//this has reduced the player load error even more, meaning the player loads and works well in Mozilla and Safari
//almost all the time. Chrome is better but still has some issues. I think the YouTube API finishes loading and
//tries to queue the playlist and selection, but the send_ids.php file fails to load all of the videos prior
//to the player calling for the playlist of videos. This causes an undefined error to occur and then as a result
//the player fails to load.

$(document).ready(function() {
    
    //option buttons
	var chanSelector = $('#chanSelector');
	var sendChoices = $('#sendChoices');
	var combos;
	var query;
	var vids;
	var selection = 0;
	var volume;
	var count = 0;

	//we can change this. start with short videos
	query = "cat[]=sci&cat[]=nat&len[]=short";

	function getVids() {

		var defer = $.Deferred();

		//get initial set of video Ids
		$.ajax({
			url: "php/send_ids.php",
			data: query,
			success: function(data) {
				defer.resolve(vids = $.makeArray(JSON.parse(data)));
				//selection = 0;
			},
			error: function(err){
				defer.reject(err);
			}
		});

		return defer.promise();
	}

	getVids()
		.done(function(vids){

			window.vids = vids

			//load YT player iframe API
		    var tag = document.createElement('script');
		    tag.src = "https://www.youtube.com/iframe_api/";
		    var firstScriptTag = document.getElementsByTagName('script')[0];
		    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		})
		.fail(function(err){
			console.log(err);
		})


	//Create a YT player after the API downloads
	var player;
	window.onYouTubeIframeAPIReady = function() {
		player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: vids[selection], //this line throws an error in Chrome: "cannot read property '0' of undefined". Works pretty well in Firefox and Safari.
		playerVars: {autoplay: 1,fs: 1,modestbranding: 1},
		events: {'onStateChange': onPlayerStateChange}
	    });
	
		//Play next vid ID on list after vid ends
		function onPlayerStateChange (event) {
			if (event.data === 0){
				selection += 1;
				count = checkCount(count);
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

	    	count = checkCount(count);
	    	player.loadVideoById(vids[selection]);
	    });
	    $('#next').click( function() {
	    	if (selection == vids.length - 1) {
	    		selection = 0;
	    	}
	    	else {
	    		selection += 1;
	    	}

	    	count = checkCount(count);
	    	player.loadVideoById(vids[selection]);
	    });

	    $('#prevtext').click( function() {
	    	if (selection == 0) {
	    		selection = vids.length - 1;
	    	}
	    	else {
	    		selection -= 1;
	    	}

	    	count = checkCount(count);
	    	player.loadVideoById(vids[selection]);
	    });

	    $('#nexttext').click( function() {
	    	if (selection == vids.length - 1) {
	    		selection = 0;
	    	}
	    	else {
	    		selection += 1;
	    	}

	    	count = checkCount(count);
	    	player.loadVideoById(vids[selection]);
	    });
	    
	    var channelSel = $("#channel-sel");

	    channelSel.submit(function(e){
	    	e.preventDefault();
	    	e.stopPropagation();

	    	var query = channelSel.serialize();

	    	$.ajax({
				url: "php/send_ids.php",
				data: query,
				success: function(data) {
					vids = $.makeArray(JSON.parse(data));
					selection = 0;

					count = checkCount(count);
					player.loadVideoById(vids[selection]);
					$('#set-blank').tab('show');
				}
			});

	    });
	};

	//keyboard shortcuts. Currently cannot use within YT_shortcuts as vids and vids[selection] are not defined there.
	window.onkeyup = function(e) {
	    var key = e.keyCode ? e.keyCode : e.which;
    	//space bar
		if (key == 32) {
			if (player.getPlayerState() == 1) {
				player.pauseVideo(vids[selection]);
			}
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
		//u key
        if (key == 85) {
            //need to check mute because player.getVolume returns a value even if the video is muted
            //if muted, unmute
            if (player.isMuted() == true) {
                player.unMute(vids[selection]);
            }
            //get volume and raise by 5
            if (player.isMuted() == false) {
                volume = player.getVolume();
                volume += 5;
                player.setVolume(volume);
            }
        }
		//d key
		if (key == 68) {
            //if muted, unmute
            if (player.isMuted() == true) {
                player.unMute(vids[selection]);
            }
            //get volume and raise by 5
            if (player.isMuted() == false) {
                volume = player.getVolume();
                volume -= 5;
                player.setVolume(volume);
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

	        count = checkCount(count);
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

	        count = checkCount(count);
	        player.loadVideoById(vids[selection]);
	    }
	}

	function checkCount(count){

		if (count == 4){

			$("#pop-up").show();
			setTimeout(function(){$("#pop-up").hide();}, 10000);

			return 0;
		}

		else{
			return count + 1;
		}
	}
});



//player.getCurrentTime() for use to display an ad after x amount of time of video play.
//player.getPlaybackQuality() retrives current video quality. have filters for sd/hd and skip to next video if not hd
//player.setPlaybackQuality(suggestedQuality:String):Void
//player.getAvailableQualityLevels():Array
//if no video with selected filters, prompt user and suggest selecting different categories