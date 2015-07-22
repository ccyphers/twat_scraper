"use strict";

var cheerio = require('cheerio')
    , ParseIndividualTweet = require('./parse_individual_tweet')
    , Search = require('./search')
    , FeaturedStreams = require('./featured_streams');

// trends
// https://twitter.com/i/trends?k=&pc=true&query=%24GOOG&show_context=true&src=module

/**
 * @typedef {Object} SearchOptions
 * @property {string} query Search term
 * @property {boolean} paging Indicator used to determine whether to fetch additional results
 * @property {number} num_pages Number of pages to fetch if paging is enabled
 */

/**
 *
 * @typedef {Array} TwitterResults
 * @property {TweitterResult}
 */

/**
 * @typedef {Object} TweitterResult An individual result from TwitterResults
 * @property {string} tweet_id The ID twitter assigns to the tweet
 * @property {string} user_id The ID twitter assigns to the user who posted the tweet
 * @property {string} name The person's name that posted the tweet
 * @property {string} handle The twitter handle
 * @property {string} post_time Time the tweet was posted
 * @property {string} content Content of the tweet
 * @property {number} number_favorites Number of favorites for the tweet
 * @property {number} num_retweets Number of times the tweet has been re-tweeted
 *
 *
 */



/** Base class for search interface providing methods to pull out data elements associated to a tweet
 *
 *
 * @constructor
 */
function Tweets(body) {
    var self = this
        , Promise = require('bluebird')
        , _ = require('underscore');

    if(body) {
        var $body = cheerio.load(body);
        this.tweet_lis = $body('li[data-item-type="tweet"]');
    }

    this.get_tweet_lis = function () {
        return this.tweet_lis;
    };

    this.parse = function () {
        var records = [];

        for (var x = 0; x < this.tweet_lis.length; x++) {
            records.push(ParseIndividualTweet(this.tweet_lis[x]))
        }

        return records;
    };

    this.get_tweets_for_stream = function(options, body) {
        var deferred = Promise.defer()
            , results = []
            , featured_streams = new FeaturedStreams(body);

        featured_streams.featured_streams(options)
            .then(function(res) {

                for(var x = 0; x < res.length; x++) {
                    var tmp = cheerio.load(res[x]);

                    self.tweet_lis = tmp('li[data-item-type="tweet"]');
                    results.push(self.parse())
                }

                results = _.flatten(results);
                deferred.resolve(results);
            }, function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    this.get_featured_streams_list = function() {
        var deferred = Promise.defer()
            , featured_streams = new FeaturedStreams();

        featured_streams.get_details()
            .then(function(res) {
                deferred.resolve(res);
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    /** Interface for Search class
     *
     * @implements {Search}
     * @param {SearchOptions} options
     * @constructor
     * @returns {TwitterResults}
     */
    this.search = function (options) {
        options = options || {};
        options.paging = options.paging || false
        var s = new Search(options)
            , deferred = Promise.defer()
            , results = []
            , parsed_tweet;
        s.get()
            .then(function(res) {
                for(var x = 0; x < res.length; x++) {
                    var tmp = cheerio.load(res[x]);
                    self.tweet_lis = tmp('li[data-item-type="tweet"]');
                    parsed_tweet = self.parse();
                    results.push(_.map(parsed_tweet, function(i) {
                        if(i.tweet_id) {
                            return i;
                        }
                    }));
                    
                }
                results = _.flatten(results);
                deferred.resolve(results);
            });
        return deferred.promise;
    }
}

module.exports = Tweets;