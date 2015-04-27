UrlShortener = {
  collection: new Mongo.Collection('short_urls'),
  shorten: function(url, callback) {
      var urlObj = {
        long_url: url
      }

      if (typeof callback === "function") {
        Meteor.call('url-shortener/shorten', urlObj, function(err, res) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, res);
          }
        });
      } else {
        throw new Meteor.Error("No Callback", "You must pass a callback function to the UrlShortener.shorten function");
      }
  },
  options: {

  }
}

Meteor.startup(function() {
  _.defaults(UrlShortener.options, {
    bad_url: '',
    prefix: Meteor.absoluteUrl(),
    url_length: 5
    });
});
