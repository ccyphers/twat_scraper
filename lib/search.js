const cheerio = require('cheerio');
const request = require('request-promise');
const Promise = require('bluebird');

/**
 *
 * @param {SearchOptions} options
 * @constructor
 */
class Search {

  constructor(options) {
    this.options = options;
    this.results = [];
    this.page_number = 0;
    this.deferred = Promise.defer();
  }

  get(_maxPosition) {
    let maxPosition = _maxPosition;
    // const q = querystring.escape(this.options.query);
    let url = `https://twitter.com/search?q=${this.options.query}`;

    if (this.options.paging && maxPosition && this.page_number < this.options.num_pages) {
      url += `&max_position=${maxPosition}`;
    }

    request.get(url).then((body) => {
      this.results.push(body);
      this.page_number += 1;
      const $ = cheerio.load(body);
      const tmp = $('div.stream-container');
      const previousMaxPosition = maxPosition;
      maxPosition = tmp[0].attribs['data-max-position'];

      if (this.options.paging && maxPosition && this.page_number < this.options.num_pages) {
        if (this.page_number > 1) {
          if (previousMaxPosition !== maxPosition) {
            this.get(maxPosition);
          } else {
            this.deferred.resolve(this.results);
          }
        } else {
          this.get(maxPosition);
        }
      } else {
        this.deferred.resolve(this.results);
      }
    });
    return this.deferred.promise;
  }
}

module.exports = Search;
