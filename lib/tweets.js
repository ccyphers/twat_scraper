const cheerio = require('cheerio');
const ParseIndividualTweet = require('./parse_individual_tweet');
const Search = require('./search');
const _ = {}
_.clone = require('lodash/clone')
_.flatten = require('lodash/flatten')
_.filter = require('lodash/filter')


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


/** Base class for search interface providing methods to pull out data
 *  elements associated to a tweet
 *
 *
 * @constructor
 */
class Tweets {

  // eslint-disable-next-line class-methods-use-this
  parse(tweetLIS) {
      // there are properties on the proto that aren't defined such that enumerable
      // is false so we have to know which keys to use in the object
    const keys = Object.keys(tweetLIS).slice(0, tweetLIS.length);
    const results = [];

    keys.forEach((key) => {
      const li = tweetLIS[key];
      results.push(ParseIndividualTweet(li));
    });
    return results;
  }

  // eslint-disable-next-line class-methods-use-this
  getTweetLIS(doc) {
    const body = cheerio.load(doc);
    return body('li[data-item-type="tweet"]');
  }


    /** Interface for Search class
     *
     * @implements {Search}
     * @param {SearchOptions} options
     * @constructor
     * @returns {TwitterResults}
     */
  search(_options) {
    const options = _.clone(_options) || {};
    options.paging = options.paging || false;
    const s = new Search(options);
    const results = [];

    return s.get()
            .then((res) => {
              res.forEach((item) => {
                const lis = this.getTweetLIS(item);
                const parsedTweet = this.parse(lis);
                // eslint-disable-next-line consistent-return
                results.push(_.filter(parsedTweet, (i) => {
                  if (i.tweet_id) {
                    return i;
                  }
                }));
              });
              return _.flatten(results);
            });
  }
}

module.exports = Tweets;
