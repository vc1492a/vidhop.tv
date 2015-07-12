<?php

	$categories = $_GET['cat'];
	$lengths = $_GET['len'];
	$choices = array();

	foreach ($categories as $category){
		foreach ($lengths as $length){
			array_push($choices, $category . $length);
		}
	}

?>


