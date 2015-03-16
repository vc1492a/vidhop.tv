<?php

function channel_query($chname) {
	
	/**This function takes a YT channel ID and returns a 
	 * string with a url that is used to request individual
	 * video IDs from the channel using the search:list function
	 * from the YT data API.
	 * 
	 * Each parameter for this function has its own line so 
	 * we can edit them easily.
	 * 
	 * For info on this API function goto: 
	 * 
	 * https://developers.google.com/youtube/v3/docs/search/list
	 * 
	 * **/
	
	$chquery = 'https://www.googleapis.com/youtube/v3/search?'
	. 'order=viewCount&'
	. 'part=id&fields=items%2Fid&'
	. 'channelId=' . $chname . '&'
	. 'type=video&maxResults=50&'
	. 'key=AIzaSyArTyW_uUWZ2ZGSXSvsbk1qWJuT9Z9Cs_I';
	
	return $chquery;
};

function playlist_query($plname) {
	
	/**This function takes a YT playlist ID (string) and returns a 
	 * url string that is used to request individual video IDs
	 * from the playlist using the playlistItems:list function
	 * from the YT data API.
	 * 
	 * Each parameter for this function has its own line so 
	 * we can edit them easily.
	 * 
	 * For info on this API function goto: 
	 * 
	 * https://developers.google.com/youtube/v3/docs/playlistItems/list
	 * **/
	
	$plquery = 'https://www.googleapis.com/youtube/v3/playlistItems?'
	. 'part=contentDetails&'
	. 'maxResults=50&'
	. 'playlistId=' . $plname . '&'
	. 'fields=items%2FcontentDetails&'
	. 'key=AIzaSyArTyW_uUWZ2ZGSXSvsbk1qWJuT9Z9Cs_I';
	
	return $plquery;
}

function extract_ids($filename) {
	
	/**
	 * This function takes the filename of a txt file (string)
	 * (in the same folder as this function) which contains
	 * a list of YT channel/playlist IDs (one per line) and generates
	 * a list that contains video IDs of videos from each channel/playlist
	 * on the list. This is accomplished by making requests to the
	 * YT data api.
	 * 
	 * See the channel_query and playlist_query functions for more info.
	 * **/
	
	#initialize empty array for the IDs
	$ids = array();
	
	#open the txt file
	$file = fopen($filename, 'r');
	
	#iterate through the file until the end is reached
	while(! feof($file)) {
		
		#get the channel/playlist name, go to the next line
		$name = trim(fgets($file));
		
		#if its a channel use the channel_query function
		if ($name[0] == 'U'){
		
			#make the API request, convert json into a PHP object
			$result = json_decode(file_get_contents(channel_query($name)));
		
			#iterate through the 'items' array in the PHP object
			foreach ($result->items as $video) {
				
				#push the videoID parameter of each item into $ids
				array_push($ids, $video->id->videoId);			
			}
		}
		
		#if its a playlist use the playlist_query function
		elseif ($name[0] == 'P'){
			
			#make the API request, convert json into a PHP object
			$result = json_decode(file_get_contents(playlist_query($name)));
		
			#iterate through the 'items' array in the PHP object
			foreach ($result->items as $video) {
				
				#push the videoID parameter of each item into $ids
				array_push($ids, $video->contentDetails->videoId);			
			}
		}
	}
	
	fclose($file);
	return $ids;
}

/**
 * In case we decide to get more intricate with this script/the site in general
 * I think that we should keep all of our sources organized into individual .txt
 * files based off of the genre and length of the material. For now I am just 
 * combining everything into one file (ids.txt) but keeping everything separate will
 * make it easy for us to integrate customizable content into the site.
 * **/

#array containing the names of all of the different .txt files
$sources = array(
	'science_long.txt',
	#'science_short.txt', nothing in this file
	'nature_long.txt',
	#'nature_short.txt', same
	#'misc_long.txt', same
	'misc_short.txt'
);

#initialize array to contain the video ids
$ids = array();

#extract the video IDs from each source and add them the the IDs array
foreach ($sources as $file) {
	$ids = array_merge($ids, extract_ids($file));
}

#opens the ids.txt file, currently in 'w' mode which deletes everything upon opening
$file = fopen('ids.txt', 'w');

#write each ID to a new line in ids.txt
foreach ($ids as $id) {
	fwrite($file, $id . PHP_EOL);
}

?>