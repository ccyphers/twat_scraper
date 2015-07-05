"use strict";

function HomePage(body) {
    var request = require('request')
        , Promise = require('bluebird')
        , _ = require('underscore')
        , self = this
        , cheerio = require('cheerio');

    if (body) {
        this.body = body;
    }

    this.ensure_body = function() {
        var deferred = Promise.defer();

        if(this.body) {
            deferred.resolve(this.body)
        } else {
            request.get('https://twitter.com', function (err, res, body) {
                if(err) {
                    deferred.reject(err);
                } else {
                    self.body = body;
                    deferred.resolve(body);
                }
            })
        }
        return deferred.promise;

    };

    function stream_details(stream_div) {
        return JSON.parse(stream_div.attribs['data-scribe-context'])
    }

    this.get_stream_details = function() {
        var deferred = Promise.defer()
            , stream_objects = [];

        this.ensure_body()
            .then(function() {
                var $ = cheerio.load(self.body);
                self.stream_divs = $('div.TweetWithPivotModule');

                for (var x = 0; x < self.stream_divs.length; x++) {
                    stream_objects.push(stream_details(self.stream_divs[x]))
                }

                deferred.resolve(stream_objects)
            }, function(err) {
                deferred.reject(err)
            });
        return deferred.promise;
    }

}

module.exports = HomePage;