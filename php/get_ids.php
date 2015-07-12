<?php

#so it doesn't time out
ini_set('max_execution_time', 300);

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
	. 'key=AIzaSyArTyW_uUWZ2ZGSXSvsbk1qWJuT9Z9Cs_I'; /** 'key=AIzaSyArTyW_uUWZ2ZGSXSvsbk1qWJuT9Z9Cs_I', 'key=AIzaSyA-4lY7Vc2IYSjdjnoH836HabdNMjrK8Ww', 'key=AIzaSyAQ2VBcrQUnBS3vwQlfNZxBWssZroIIRco' **/
	
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

/**
 * In case we decide to get more intricate with this script/the site in general
 * I think that we should keep all of our sources organized into individual .txt
 * files based off of the genre and length of the material. For now I am just 
 * combining everything into one file (ids.txt) but keeping everything separate will
 * make it easy for us to integrate customizable content into the site.
 * **/
 
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

#initialize array to contain the video ids
$ids = array();

#making an array index for all vids
$all_name = str_pad('allshort', 11, ' ');
$ids['allshort'] = array($all_name);
 
 /**gonna have a lot of rulez for the file formatting, need to put a super kewl description here**/
$sources = fopen('sources.txt','r');

while(! feof($sources)) {
	$line = trim(fgets($sources));
	
	#make sure its not an empty line before trying to read it
	if (!$line){continue;}
	
	#if a # is there that means its a title for a category
	if ($line[0] == '#') {
		#remove #
		$channel = trim($line, "#");
		
		#pad to 11 char for the file format
		$title = str_pad($channel, 11, ' ');
		
		$ids[$channel] = array($title);
	}
	
	#request Ids from playlist
	else if ($line[0] == 'P'){
		
		#make the API request, convert json into a PHP object
			$result = json_decode(file_get_contents(playlist_query($line)));
		
			#iterate through the 'items' array in the PHP object
			foreach ($result->items as $video) {
				
				#push the videoID parameter of each item into $ids
				array_push($ids[$channel], $video->contentDetails->videoId);

				array_push($ids['allshort'], $video->contentDetails->videoId);			
			}
	}
	
	#request Ids from user
	else if ($line[0] == 'U'){
	
		#make the API request, convert json into a PHP object
			$result = json_decode(file_get_contents(channel_query($line)));
		
			#iterate through the 'items' array in the PHP object
			foreach ($result->items as $video) {
				
				#push the videoID parameter of each item into $ids
				array_push($ids[$channel], $video->id->videoId);

				array_push($ids['allshort'], $video->id->videoId);			
			}
	}
}

$ids['alllong'] = $ids['allshort'];
$ids['alllong'][0] = str_pad('alllong', 11, ' ');

#get lengths of each list
$lengths = array();

foreach ($ids as $key => $value) {
	$lengths[$key] = count($value);
}

#opens the ids.txt file, currently in 'w' mode which deletes everything upon opening
$file = fopen('ids.txt', 'w');

#iterate through dem boys
for ($i = 0; $i < max($lengths); $i++) {
	
	#create string with all elements
	$input = '';
	
	#go through each category in the list
	foreach ($ids as $key => $value){
		
		#check if all ids from the category have been written
		if ($i < $lengths[$key]) {
			$input = $input . ' ' . $value[$i];
		}
		
		#if so just spaces
		else {
			$input = $input . ' ' . str_repeat(' ', 11);
		}
	}
	
	#EOL bruh
	$input = $input . PHP_EOL;
	
	#write it to the file
	fwrite($file, $input);
}

fclose($file);

?>