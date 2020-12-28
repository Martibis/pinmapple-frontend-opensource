<!DOCTYPE html>

<head>
    <link rel="shortcut icon" type="image/x-icon" href="IMG/favicon.ico">
    <link rel="image_src" type="image/png" href="IMG/maps.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8">
    <meta property="og:url" content="http://www.pinmapple.com" />
    <meta property="og:title" content="Pinmapple" />
    <meta property="og:image" content="http://www.pinmapple.com/IMG/pinmapplefinal.png" />
    <meta property="og:description" content="Find and share blog posts with others from all over the world!" />
    <title>Pinmapple</title>
    <meta name="description" content="Find and share blog posts with others from all over the world on Pinmapple!" />
    <link href="https://fonts.googleapis.com/css?family=Quicksand&display=swap" rel="stylesheet">
    <link rel="stylesheet" tye="text/css" href="CSS/datepicker.css">
    <link rel="stylesheet" type="text/css" href="CSS/index.css?1">
    <style>
    #map {
        height: 100%;
    }

    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
    }
    </style>
</head>


<body>
    <?php 
    $post = isset($_GET['post']) ? $_GET['post'] : '';
    $author = isset($_GET['author']) ? $_GET['author'] : '';
    $tag = isset($_GET['tag']) ? $_GET['tag'] : '';

    if($author === '' && $post === '' && $tag === ''){
        $editorsChoice = "checked";
    } else{
        $editorsChoice = isset($_GET['editorsChoice']) ? "checked" : '';
    }
    $dateRange = isset($_GET['dateRange']) ? $_GET['dateRange'] : '';
    ?>
    <input id="pac-input" class="controls" type="text" placeholder="Search for a location">
    <div id="blogCodeDiv">
        <input id="blogCodeDescription" placeholder="Short description here" maxlength="250" />
        <p id="clickCodeText" class="blogCodeText">Click the code to copy, then add it to your post on Hive.</p>
        <p id="goodCopy" class="blogCodeText">Copied succesfully!</p>
        <p id="clickMapText" class="blogCodeText">Click on the map on the location of your post for the code to be
            generated.</p>
        <p id="codeToCopyText" class="blogCodeText"><span id="codeToCopy"></span></p>
    </div>
    <div class="fineapple">
        <a href="https://peakd.com/@pinmapple" target="_blank"> <img src="IMG/nicepineapple.png" /></a>
    </div>
    <!-- Buymeberries (change to your username / remove) -->
    <div class="buymeberries">
        <a href='https://buymeberri.es/@pinmapple' target='_blank'><img
                src='https://buymeberries.com/assets/bmb-1-l.png' /></a>
    </div>

    <div id="navigationTools">
        <p id="myonoffswitch">get code</p>
        <p id="getLocation">my location</p>
        <p id="advancedSearch">filter the map</p>
        <div class="remainingSpace"></div>
        <p id="howTo">FAQ</p>
    </div>

    <div id="searchTerms">
        <form id="searchForm" name="form" method="get">
            <input id="postName" type="text" name="postName" value="<?php echo $post; ?>">
            <input id="author" type="text" name="author" placeholder="Author name" value="<?php echo $author; ?>"><br>
            <input id="tag" type="text" name="tag" placeholder="Tag (e.g.: travel)" value="<?php echo $tag; ?>"><br>
            <div id="dateRangeDiv">
                <input id="fromDate" name="fromDate" value="<?php echo $dateRange; ?>">
            </div>
            <input id="editorsChoice" type="checkbox" name="editorsChoice" value="1" <?php echo $editorsChoice; ?>>
            <label id="ecLabel" for="editorsChoice">Best Travel Posts Only</label>
        </form>
    </div>
    <div id="howToPopup">
        <h2 class="howToHeader">What is Hive?</h2>
        <p class="howToText howTo">Hive is a fork of the Steem blockchain launched on 20th March 2020. It is a
            decentralised ecosystem, a social blockchain, developed by the community that consists of devs, business
            owners and passionate end users. If you previously had an account on Steem, you can login with the same
            account using the same keys.<br><br>Pinmapple (formerly known as the Steemitworlmap) is one of the dapps on
            the Hive blockchain for the travel community.<br><br><a href="https://peakd.com" target="_blank">Peakd</a>
            and <a href="https://hive.blog" target="_blank">Hive Blog</a> are platforms you can use to post to Hive.</p>
        <h2 class="howToHeader">How can I add my post to the map?</h2>
        <p class="howToText howTo">
            Click on <strong>get code</strong> on Pinmapple<br><br>
            Zoom the map or search for the location of your post in the search box. Click the location when you find
            it!<br><br>
            Add an optional short description for your location. To copy the generated code to your clipboard, click on
            it. It looks like
            <br><code>[//]:# (!pinmapple xx.xxxxx lat yyy.yyyyy long  d3scr)</code><br><br> Paste it in your post on the
            Hive blockchain. It will be pinned to the map and curated by our team!<br><br><a href="https://peakd.com"
                target="_blank">Peakd</a> and <a href="https://hive.blog" target="_blank">Hive Blog</a> are platforms
            you can use to post to Hive.
        </p>
        <h2 class="howToHeader">How to filter the map?</h2>
        <p class="howToText howTo">
            Pinmapple consists of over 50 000 pins contributed by our users. The default view shows the best travel pins
            only. There's over 10 000 of them, and growing everyday<br><br>
            Under <strong>filter the map</strong> you can search for pins from a particular author if you know their
            Hive username. Or you can filter by tags used in a posts eg travel, hotel, buildings, backpacking, New
            York... To top it off you can also filter the pins added by date.
        </p>
        <h2 class="howToHeader">What is the daily travel digest?</h2>
        <p class="howToText howTo">
            Everyday the Pinmapple team curates the best travel posts and issues a Travel Digest to showcase the
            authors' work. This helps authors to gain more exposure and recognition. We also upvote the authors on the
            Hive blockchain so they are rewarded for their high quality articles! 🥳<br><br>
            <a href="https://peakd.com/@pinmapple" target="_blank">Read the incredible articles right now!</a>
        </p>
    </div>
    <div id="map"></div>


    <script src="LIBS/jquery.js"></script>
    <script src="LIBS/moment.js"></script>
    <script src="LIBS/datepicker.js"></script>
    <script src="JS/index.js?3"></script>
    <script src="LIBS/markerclusterer.js"></script>
    <!-- TODO: Change YourMapsApiCode with your API code for Google Maps -->
    <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=YourMapsApiCodeHere&callback=initMap&libraries=places">
    </script>
</body>

</html>