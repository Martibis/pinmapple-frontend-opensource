<?php

if (isset($_GET['postLink']) === true) {
    include('connection.php');
    
    $postLink = $_GET['postLink'];
    
    $sql = "SELECT postDate, postLink, postImageLink, postTitle, postDescription, username, postUpvote, postValue FROM markerinfo WHERE postLink = '$postLink'";
        
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
    	date_default_timezone_set('UTC');
        $postDate = date("M j, Y", strtotime($row['postDate'])); 
    	
        $completeDiv = "<div class=\"infoDiv\">
            <a href=\"" . htmlspecialchars($row['postLink']) . "\" target=\"blank\">
            <div class=\"imageDiv\">
            <img src=\"https://images.ecency.com/256x512/" . htmlspecialchars($row['postImageLink']) . "\" alt=\"Post image\" class=\"postImg\">
            </div>
            </a>
            <div class=\"textDiv\">
                <h2 class=\"postTitle\"><a href=\"" . htmlspecialchars($row['postLink']) . "\" target=\"blank\">" . htmlspecialchars($row['postTitle']). "</a></h2>
                <p class=\"postDescription\">" . htmlspecialchars($row['postDescription']) . "</p>
                <p class=\"extraInfo1\">" . htmlspecialchars($row['username']) . "&nbsp;&nbsp;&nbsp;&nbsp;</p>
                <p class=\"extraInfo\">▴" . htmlspecialchars($row['postUpvote']) . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▴$" . htmlspecialchars(round($row['postValue'])) . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" . htmlspecialchars($postDate) . "</p>
            </div>
        </div>";
    }
    echo $completeDiv;
    
    
}
$conn->close();

?>
