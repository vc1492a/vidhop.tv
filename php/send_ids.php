<?php

	/**I'm tired I will comment this later...most likely... .. . . .
	 */
	$categories = explode(' ', $_GET['cats']);
	
	$ids = array();
	
	$idfile = fopen('ids.txt', 'r');
	
	#get names out of first line
	$line = trim(fgets($idfile));
	
	$options = str_split($line, 12);
	
	$indices = array();
	
	foreach ($options as $index=>$option){
		$option = trim($option);
		
		if (in_array($option, $categories)) {
			array_push($indices,$index);
		}
	}

	while(! feof($idfile)){
		$line = str_split(fgets($idfile),12);
		
		foreach ($line as $index=>$id){
			
			$id = trim($id);

			if (!in_array($index, $indices)){continue;}

			if (!$id){continue;}
			
			array_push($ids, $id);
		}
	}
	
	shuffle($ids);
	
	echo json_encode($ids);
	
?>