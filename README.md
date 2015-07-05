# TwatScraper

A twitter scraper taking advantage of [cheerio](https://github.com/cheeriojs/cheerio).  Other projects use jsdom, which are more processing intensive.

## Installation
npm install twat_scraper

## Usage - Search

Perform a Twitter search supplying a required argument for query and optional arguments for paging and num_pages.  For the initial release error handling for arguments is not provided.


	var TwatScraper = require('twat_scraper')
	    , twat_scraper = new TwatScraper();
	
	twat_scraper.search({query: "$GOOG", paging: true, num_pages: 5})
    	.then(function(res) {
       		// do something with the array of objects
	    }, function(err) {
    	   // handle error
    	})
    
    	
## Search Response

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
    
## Usage - Home Page Featured List

Retrieve a list of featured streams for the Twitter home page.


	var TwatScraper = require('twat_scraper')
    	, twat_scraper = new TwatScraper();
    
	twat_scraper.get_featured_streams_list()
    	.then(function(res) {
        	// do something with the array of objects
	    }, function(err) {
        	// handle error
    	})

## Home Page Featured List Response

	[ { id: 38, name: 'Pop artists', type: 'stream' },
	  { id: 10, name: 'MLB players, teams & personalities', type: 'stream' },
	  { id: 40, name: 'Country artists', type: 'stream' },
	  { id: 2, name: 'Business news', type: 'stream' },
	  { id: 57, name: 'Politicians, pundits & parties', type: 'stream' },
	  ...
	  ...
	  N
	]      	
    

## Tweets for a stream

Get the tweets for a given stream_id.  The stream_id is a required argument while paging and num_pages are optional.  For the initial release error handling for arguments is not provided.  You obtain the stream_id by calling twat_scraper.get_featured_streams_list().


	var TwatScraper = require('twat_scraper')
    	, twat_scraper = new TwatScraper();
    	
	twat_scraper.get_tweets_for_stream({ stream_id: 38, paging: true, num_pages: 2})
		.then(function(res) {
        	// do something with the array of objects
	    }, function(err) {
        	// handle error
    	})

## Tweets for a stream Results
	[ { tweet_id: '617710955812687873',
    	user_id: '403255314',
	    name: 'Calum Hood',
    	handle: '@Calum5SOS',
	    post_time: '8:05 AM - 5 Jul 2015',
    	content: 'Judging pic.twitter.com/pqwzSYWdix',
	    number_favorites: 0,
    	num_retweets: 0 },
	  { tweet_id: '617710918332317696',
    	user_id: '82941287',
	    name: 'Dani Cimorelli',
    	handle: '@DaniCim',
	    post_time: '8:05 AM - 5 Jul 2015',
    	content: 'when u move to Tennessee where fireworks are legal 	pic.twitter.com/SHJn9nKVYz',
	    number_favorites: 300,
    	num_retweets: 162 },
    	...
    	...
    ]
