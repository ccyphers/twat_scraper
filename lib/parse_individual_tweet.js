function ParseIndividualTweet(li) {

    var cheerio = require('cheerio')
        , tmp = cheerio.load(li)
        , divs = tmp('div')
        , record = {};

    /** Get the user id associated with the tweet
     * @access private
     */
    function get_user_id() {
        return divs[0].attribs['data-user-id'];
    }

    /** Get the person's name who posted the tweet
     * @access private
     */
    function get_name() {
        return divs[0].attribs['data-name'];
    }

    /** Get the person's handle associated with the tweet
     * @access private
     */
    function get_handle() {
        return tmp('div.stream-item-header').find('span[class="username js-action-profile-name"]').text()
    }

    /** Get the tweet id
     * @access private
     */
    function get_tweet_id() {
        return li.attribs['data-item-id'];
    }

    /** Get the time the tweet was posted
     * @access private
     */
    function get_post_time() {
        return tmp('small.time').find('a[class="tweet-timestamp js-permalink js-nav js-tooltip"]')[0].attribs.title
    }

    /** Get the tweet content
     * @access private
     */
    function get_content() {
        return tmp('p[class="TweetTextSize  js-tweet-text tweet-text"]').text()
    }

    /** Get the number of favorites for the tweet
     * @access private
     */
    function get_num_favorites() {
        try {
            var n = Number(tmp('div[class="ProfileTweet-action ProfileTweet-action--favorite js-toggleState"]').find('span[class="ProfileTweet-actionCountForPresentation"]').html());
            return Number.isNaN(n) ? 0 : n
        } catch(e) {
            return 0;
        }
    }

    /** Get the number of times the tweet has been re-tweeted
     * @access private
     */
    function get_num_retweets() {
        try {
            var n = Number(tmp('div[class="ProfileTweet-action ProfileTweet-action--retweet js-toggleState js-toggleRt"]').find('span[class="ProfileTweet-actionCountForPresentation"]').html())
            return Number.isNaN(n) ? 0 : n
        } catch(e) {
            return 0;
        }
    }

    record.tweet_id = get_tweet_id();
    record.user_id = get_user_id();
    record.name = get_name();
    record.handle = get_handle();
    record.post_time = get_post_time();
    record.content = get_content();
    record.number_favorites = get_num_favorites();
    record.num_retweets = get_num_retweets();
    record.tweet_id = get_tweet_id();

    return record;

}

module.exports = ParseIndividualTweet;
