UrlShortener = {
  collection: new Mongo.Collection('short_urls'),
  options: {
    // route: '/s/:_id'
  }
}

Meteor.startup(function() {
  _.defaults(UrlShortener.options, {
    bad_url: '',
    prefix: Meteor.absoluteUrl(),
    url_length: 5
    });
});
