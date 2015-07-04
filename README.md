# TwatScraper

A twitter search results scraper without the heavy weight dependency of jsdom, wich some other projects require.  Instead of jsdom, [cheerio](https://github.com/cheeriojs/cheerio) is used instead.

## Installation
npm install twat_scraper

## Usage


	Tweets = require('twat_scraper')
	tweets = new Tweets();
	
	tweets.search({query: "$GOOG", paging: true, num_pages: 5})
    	.then(function(res) {
       		// do something with the array of objects
	    }, function(err) {
    	   // handle error
    	})
    	
## Example Response

	[ { tweet_id: '616981145926897664',
    	user_id: '259725229',
	    name: 'Vala Afshar',
    	handle: '@ValaAfshar',
	    post_time: '7:45 AM - 3 Jul 2015',
    	content: 'Cash holdings ($ billions):\n \nApple $AAPL - $194b\nMicrosoft  	$MSFT - $108b\nGoogle $GOOG  - $67b\n\nGreece GDP - $242b',
    	number_favorites: 23,
	    num_retweets: 56 },
	  { tweet_id: '617390820338081792',
    	user_id: '68739089',
	    name: 'Charles Gasparino',
    	handle: '@CGasparino',
	    post_time: '10:53 AM - 4 Jul 2015',
    	content: 'just got an earful from a very smart i banker on why $twtr will never be sold to either $FB or $goog will provide more detail by monday',
	    number_favorites: 0,
    	num_retweets: 3 },    	
    	...
    	...
    	N
    ]	