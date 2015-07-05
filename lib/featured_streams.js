"use strict";

function FeaturedStreams(body) {

    var Promise = require('bluebird')
        , request = require('request')
        , HomePage = require('./home_page')
        , cheerio = require('cheerio')
        , self = this
        , page_number = 0
        , results = []
        , get_deferred = Promise.defer();

    // when running from unit test home page body payload is passed
    if(body) {
        var home_page = new HomePage(body)
    } else {
        var home_page = new HomePage()
    }

    var stream_objects = [];

    function get_stream(option, max_position) {
        var url = "https://twitter.com/i/streams/stream/" + option.stream_id;

         if(option.paging && max_position && page_number < option.num_pages) {
             url += "&max_position=" + max_position
         }

        request.get(url, function(err, res, body) {
            if(err) {
                get_deferred.reject(err);
            } else {

                var $ = cheerio.load(body)
                    , tmp = $('div.stream-container')
                    , previous_max_position = max_position
                    , max_position = tmp[0].attribs['data-min-position'];

                results.push(body);
                page_number += 1;

                if(option.paging && max_position && page_number < option.num_pages) {

                    if (page_number > 1) {
                        if (previous_max_position != max_position) {
                            get_stream(option, max_position)
                        } else {
                            get_deferred.resolve(results);
                        }
                    } else {
                        get_stream(option, max_position)
                    }

                } else {
                    get_deferred.resolve(results);
                }
            }


        });

        return get_deferred.promise;
    }

    function find_stream(op) {
        op = op || {};
        op.id = op.id || -1;
        op.name = op.name || "";

        for(var x = 0; x < stream_objects.length; x++) {
            if(stream_objects[x].id == op.id || stream_objects[x].name == op.name) {
                return stream_objects[x];
            }
        }
    }

    this.get_details = function() {
        var deferred = Promise.defer();

        home_page.get_stream_details()
            .then(function(res) {
                deferred.resolve(res)
            }, function(err) {
                deferred.reject(err)
            });
        return deferred.promise;
    };

    this.featured_streams = function(option) {
        var deferred = Promise.defer();

        option = option || {};
        option.stream_id = option.stream_id || -1;
        option.paging = option.paging || false;
        option.num_pages = option.num_pages || 0;

        get_stream(option)
            .then(function(res) {
                results.push(res)
                deferred.resolve(results);
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }
}

module.exports = FeaturedStreams;
