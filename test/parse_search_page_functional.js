"use strict";

var assert = require('chai').assert
    , fs = require('fs')
    , Tweets = require(__dirname + '/../lib/tweets');

describe('Tweets', function () {
    var tweets = new Tweets()
        , parsed = []
        , keys = {};

    before(function() {
        this.timeout = 5000;
        return tweets.search({query: "$GOOG", paging: false})
            .then(function(res) {
                //console.log("Results from calling https://twitter.com/search");
                //console.log(res);
                parsed = res;
                keys = Object.keys(res[0]);
            })
    });

    describe("#parse()", function() {

        it("should return a collection of records", function() {
            assert.isArray(parsed);
            assert.isObject(parsed[0]);
            assert(parsed.length > 0)
        });

        it("an individula record should have the person's name", function() {
            assert(keys.indexOf('name' > -1))
        });

        it("an individula record should have the person's handle", function() {
            assert(keys.indexOf('handle' > -1))
        });

        it("an individula record should have a tweet id", function() {
            assert(keys.indexOf('tweet_id' > -1))
        });

        it("an individula record should have a user id", function() {
            assert(keys.indexOf('user_id' > -1))
        });

        it("an individula record should have a posted time", function() {
            assert(keys.indexOf('post_time' > -1))
        });

        it("an individula record should have the post content", function() {
            assert(keys.indexOf('content' > -1))
        });

        it("an individula record should have the number of favorites for the tweet", function() {
            assert(keys.indexOf('number_favorites' > -1))
        });

        it("an individula record should have the number of re-tweets", function() {
            assert(keys.indexOf('number_retweets' > -1))
        });

        it("an individula record should have the tweet id", function() {
            assert(keys.indexOf('tweet_id' > -1))
        });


    })
});