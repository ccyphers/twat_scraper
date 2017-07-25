const cheerio = require('cheerio');
const request = require('request-promise');
const Promise = require('bluebird');


class HomePage {
  constructor(body) {
    if (body) {
      this.body = body;
    }
  }

  ensureBody() {
    if (this.body) {
      return Promise.resolve(this.body);
    }
    return request.get('https://twitter.com')
                .then((body) => {
                  this.body = body;
                  return Promise.resolve(body);
                });
  }

  // eslint-disable-next-line class-methods-use-this
  _streamDetails(streamDiv) {
    return JSON.parse(streamDiv.attribs['data-scribe-context']);
  }

  getStreamDetails() {
    const streamObjects = [];

    return this.ensureBody()
            .then(() => {
              const $ = cheerio.load(this.body);
              this.streamDivs = $('div.TweetWithPivotModule');
              // proto has some extra garbage which is marked as enumerable so weed out unwanted
              const keys = Object.keys(this.streamDivs).slice(0, this.streamDivs.length);

              keys.forEach((key) => {
                const div = this.streamDivs[key];
                // eslint-disable-next-line no-underscore-dangle
                streamObjects.push(this._streamDetails(div));
              });

              return Promise.resolve(streamObjects);
            });
  }
}

module.exports = HomePage;
