"use strict";

var cheerio = require('cheerio');
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

/**
 * @interface
 * @param {SearchOptions} options
 * @constructor
 */
function Search(options) {
    var request = require('request')
        , Promise = require('bluebird')
        , querystring = require('querystring')
        , results = []
        , page_number = 0
        , self = this
        , deferred = Promise.defer();

    this.get = function(max_position) {
        var q = querystring.escape(options.query)
            , url= 'https://twitter.com/search?q=' + options.query;

        if(options.paging && max_position && page_number < 11) {
            url += "&max_position=" + max_position
        }

        request.get(url, function(err, res, body) {

            results.push(body);
            page_number += 1;
            var $ = cheerio.load(body)
                , tmp = $('div.stream-container')
                , previous_max_position = max_position
                , max_position = tmp[0].attribs['data-max-position'];

            if(options.paging && max_position && page_number < options.num_pages) {


                if(page_number > 1) {
                    if(previous_max_position != max_position) {
                        self.get(max_position)
                    } else {
                        deferred.resolve(results);
                    }

                } else {
                    self.get(max_position)
                }

            } else {
                deferred.resolve(results);
            }

        });
        return deferred.promise;
    }
}

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

    /** Get the user id associated with the tweet
     * @access private
     */
    function get_user_id(li) {
        var tmp = cheerio.load(li)
            , divs = tmp('div');
        return divs[0].attribs['data-user-id'];
    }

    /** Get the person's name who posted the tweet
     * @access private
     */
    function get_name(li) {
        var tmp = cheerio.load(li)
            , divs = tmp('div');
        return divs[0].attribs['data-name'];

    }

    /** Get the person's handle associated with the tweet
     * @access private
     */
    function get_handle(li) {
        var tmp = cheerio.load(li);
        return tmp('div.stream-item-header').find('span[class="username js-action-profile-name"]').text()
    }

    /** Get the tweet id
     * @access private
     */
    function get_tweet_id(li) {
        return li.attribs['data-item-id'];
    }

    /** Get the time the tweet was posted
     * @access private
     */
    function get_post_time(li) {
        var tmp = cheerio.load(li);
        return tmp('small.time').find('a[class="tweet-timestamp js-permalink js-nav js-tooltip"]')[0].attribs.title
    }

    /** Get the tweet content
     * @access private
     */
    function get_content(li) {
        var tmp = cheerio.load(li)
        return tmp('p[class="TweetTextSize  js-tweet-text tweet-text"]').text()
    }

    /** Get the number of favorites for the tweet
     * @access private
     */
    function get_num_favorites(li) {
        var tmp = cheerio.load(li);
        try {
            return Number(tmp('div[class="ProfileTweet-action ProfileTweet-action--favorite js-toggleState"]').find('span[class="ProfileTweet-actionCountForPresentation"]').html())
        } catch(e) {
            return 0;
        }
    }

    /** Get the number of times the tweet has been re-tweeted
     * @access private
     */
    function get_num_retweets(li) {
        var tmp = cheerio.load(li);
        try {
            return Number(tmp('div[class="ProfileTweet-action ProfileTweet-action--retweet js-toggleState js-toggleRt"]').find('span[class="ProfileTweet-actionCountForPresentation"]').html())
        } catch(e) {
            return 0;
        }
    }


    this.parse = function () {
        var records = []
            , record;

        for (var x = 0; x < this.tweet_lis.length; x++) {
            record = {};
            record.tweet_id = get_tweet_id(this.tweet_lis[x]);
            record.user_id = get_user_id(this.tweet_lis[x]);
            record.name = get_name(this.tweet_lis[x]);
            record.handle = get_handle(this.tweet_lis[x]);
            record.post_time = get_post_time(this.tweet_lis[x]);
            record.content = get_content(this.tweet_lis[x]);
            record.number_favorites = get_num_favorites(this.tweet_lis[x]);
            record.num_retweets = get_num_retweets(this.tweet_lis[x]);
            record.tweet_id = get_tweet_id(this.tweet_lis[x]);
            records.push(record);
        }

        return records;
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
            , results = [];
        s.get()
            .then(function(res) {
                for(var x = 0; x < res.length; x++) {
                    var tmp = cheerio.load(res[x]);
                    self.tweet_lis = tmp('li[data-item-type="tweet"]');
                    results.push(self.parse())
                }
                results = _.flatten(results);
                deferred.resolve(results);
            });
        return deferred.promise;
    }
}

module.exports = Tweets;