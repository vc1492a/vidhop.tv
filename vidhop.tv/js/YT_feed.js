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
});