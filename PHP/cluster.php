<?php

if (isset($_POST['markerTitles']) === true) {
    include('connection.php');
    
    $markerTitles = $_REQUEST['markerTitles'];
    $markerTitlesImploded = "'" . implode("','", $markerTitles) . "'";
    
    $sql = "SELECT postDate, postLink, postImageLink, postTitle, postDescription, username, postUpvote, postValue FROM markerinfo WHERE postLink IN ($markerTitlesImploded) ORDER BY postValue DESC";
    
    $result = $conn->query($sql);

    $completeDiv = "<div class=\"clusterDiv\">";
    while ($row = $result->fetch_assoc()) {
    	date_default_timezone_set('UTC');
        $postDate = date("M j, Y", strtotime($row['postDate'])); 
    	
        $completeDiv = $completeDiv . "<div class=\"infoDiv infoDivCluster\">
            <a href=\"" . $row['postLink'] . "\" target=\"blank\">
            <div class=\"imageDiv\">
            <img data-src=\"https://images.ecency.com/256x512/" . htmlspecialchars($row['postImageLink']) . "\" alt=\"Post image\" class=\"postImg\">
            </div>
            </a>
            <div class=\"textDiv\">
                <h2 class=\"postTitle\"><a href=\"" .
            $row['postLink'] . "\" target=\"blank\">" . htmlspecialchars($row['postTitle']) . "</a></h2>
                <p class=\"postDescription\">" . htmlspecialchars($row['postDescription']) . "</p>
                <p class=\"extraInfo1\">" . htmlspecialchars($row['username']) . "&nbsp;&nbsp;&nbsp;&nbsp;</p>
                <p class=\"extraInfo\">▴" . htmlspecialchars($row['postUpvote']) . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▴$" . htmlspecialchars(round($row['postValue'], 0)) . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" . htmlspecialchars($postDate) . "</p>
            </div>
        </div>";
    }
    $completeDiv = $completeDiv . "</div>";
    echo $completeDiv;
    
    
}
$conn->close();

?>