<?php

	/**This script is very minimal at this point. I'm not really sure
	 * if it needs much more though. It doesn't cost very much
	 * in terms of runtime so we might as well just send the full
	 * set of videos upon the request. I am just randomizing the array
	 * before sending it out but maybe we could come up with a more
	 * intracate way to maximize the variety.**/
	
	
	#open the file containing the YT video IDs
    $idfile = fopen("ids.txt", 'r');
	
	#initiallize an arrar for the IDs
	$ids = array();
	
	#iterate through each line in ids.txt and get the video ID
	while(! feof($idfile))
	  {
	  array_push($ids, trim(fgets($idfile)));
	  }
	  
	fclose($idfile);
	
	#randomize the order for a unique experience
	shuffle($ids);
	
	#send the array to the webpage as JSON
	echo json_encode($ids);
	
?>