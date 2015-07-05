"use strict";

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
        , cheerio = require('cheerio')
        , deferred = Promise.defer();

    this.get = function(max_position) {
        var q = querystring.escape(options.query)
            , url= 'https://twitter.com/search?q=' + options.query;

        if(options.paging && max_position && page_number < options.num_pages) {
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

module.exports = Search;