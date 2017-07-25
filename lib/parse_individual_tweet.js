const cheerio = require('cheerio');

function ParseIndividualTweet(li) {
  const tmp = cheerio.load(li);
  const divs = tmp('div');
  const record = {};

    /** Get the user id associated with the tweet
     * @access private
     */
  function getUserId() {
    return divs[0].attribs['data-user-id'];
  }

    /** Get the person's name who posted the tweet
     * @access private
     */
  function getName() {
    return divs[0].attribs['data-name'];
  }

    /** Get the person's handle associated with the tweet
     * @access private
     */
  function getHandle() {
    return tmp('div.stream-item-header').find('span[class="username js-action-profile-name"]').text();
  }

    /** Get the tweet id
     * @access private
     */
  function getTweetId() {
    return li.attribs['data-item-id'];
  }

    /** Get the time the tweet was posted
     * @access private
     */
  function getPostTime() {
    let t;
    try {
      t = tmp('small.time').find('a[class="tweet-timestamp js-permalink js-nav js-tooltip"]')[0].attribs.title;
      // eslint-disable-next-line no-console
    } catch (e) { console.log(e.message); }
    return t;
  }

    /** Get the tweet content
     * @access private
     */
  function getContent() {
    return tmp('p[class="TweetTextSize  js-tweet-text tweet-text"]').text();
  }

    /** Get the number of favorites for the tweet
     * @access private
     */
  function getNumFavorites() {
    try {
      const n = Number(tmp('div[class="ProfileTweet-action ProfileTweet-action--favorite js-toggleState"]').find('span[class="ProfileTweet-actionCountForPresentation"]').html());
      return Number.isNaN(n) ? 0 : n;
    } catch (e) {
      return 0;
    }
  }

    /** Get the number of times the tweet has been re-tweeted
     * @access private
     */
  function getNumRetweets() {
    try {
      const n = Number(tmp('div[class="ProfileTweet-action ProfileTweet-action--retweet js-toggleState js-toggleRt"]').find('span[class="ProfileTweet-actionCountForPresentation"]').html());
      return Number.isNaN(n) ? 0 : n;
    } catch (e) {
      return 0;
    }
  }

  record.tweet_id = getTweetId();
  record.user_id = getUserId();
  record.name = getName();
  record.handle = getHandle();
  record.post_time = getPostTime();
  record.content = getContent();
  record.number_favorites = getNumFavorites();
  record.num_retweets = getNumRetweets();
  record.tweet_id = getTweetId();

  return record;
}

module.exports = ParseIndividualTweet;
