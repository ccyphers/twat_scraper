"use strict";

var assert = require('chai').assert
    , fs = require('fs')
    , FeaturedStreams = require(__dirname + '/../lib/featured_streams')
    , home_body = fs.readFileSync(__dirname + "/twit.home.html").toString()

describe('FeaturedStreams', function () {
    var featured_streams = new FeaturedStreams(home_body)
        , details = [],
        keys = [];

    before(function() {
        this.timeout = 5000;
        return featured_streams.get_details()
            .then(function(res) {
                details = res;
                //console.log(res[0])
                //keys = Object.keys(res[0]);
            })
    });


    it("should return a list of featured streams", function() {
        assert(details.length > 0)
    });


    it("should return a first record with an id of 38", function() {
        assert(details[0].id == 38)
    });

    it("should return a first record with a name of 'Pop artists'", function() {
        assert(details[0].name == 'Pop artists')
    });


});
