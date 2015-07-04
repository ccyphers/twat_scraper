"use strict";

var assert = require('chai').assert
    , fs = require('fs')
    , Tweets = require(__dirname + '/../lib/tweets');

describe('Tweets', function () {
    var body = fs.readFileSync(__dirname + "/goog.html").toString()
        , tweets = new Tweets(body);

    describe("#get_tweet_lis()", function () {
        it('should have at least one <li>', function () {
            assert.equal(true, tweets.get_tweet_lis().length > 0)
        })
    });

    describe("#parse()", function() {
        var parsed = tweets.parse();

        it("should return a collection of records", function() {
            assert.isArray(parsed);
            assert(parsed.length > 0)
            assert.isObject(parsed[0]);
        });

        it("an individual record should have the person's name", function() {
            assert('Vala Afshar' == parsed[0].name)
        });

        it("an individual record should have the person's handle", function() {
            assert('@ValaAfshar' == parsed[0].handle)
        });

        it("an individual record should have a tweet id", function() {
            assert('616981145926897664' == parsed[0].tweet_id)
        });

        it("an individual record should have a user id", function() {
            assert('259725229' == parsed[0].user_id)
        });

        it("an individual record should have a posted time", function() {
            assert('7:45 AM - 3 Jul 2015' == parsed[0].post_time)
        });

        it("an individual record should have the post content", function() {
            //console.log(parsed[0])
            assert('Cash holdings ($ billions):\n \nApple $AAPL - $194b\nMicrosoft  $MSFT - $108b\nGoogle $GOOG  - $67b\n\nGreece GDP - $242b' == parsed[0].content)
        });

        it("an individual record should have the number of favorites for the tweet", function() {
            assert(18 == parsed[0].number_favorites)
        });

        it("an individual record should have the number of re-tweets", function() {
            assert(44 == parsed[0].num_retweets)
        });

        it("an individual record should have the tweet id", function() {
            assert('616981145926897664' == parsed[0].tweet_id)
        });


    })
});