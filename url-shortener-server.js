if (Meteor.isServer) {
  UrlShortener.collection.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return false;
    }
  });
  UrlShortener.collection.deny({
    update: function (userId, doc, fieldNames, modifier) {
      if (fieldNames.indexOf("long_url") === -1) {
        return false;
      } else {
        return true;
      }
    }
  });
}

Meteor.methods({
  'url-shortener/shorten': function(urlObj) {
    check(urlObj, {
        long_url: String
    });

    var expression = /^(https|http):\/\/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    if (!urlObj.long_url.match(regex)) {
      throw new Meteor.Error("Invalid URL", "That url is invalid");
    } else {
      var id = UrlShortener.collection.insert({long_url: urlObj.long_url, path: null, createdAt: new Date(), clicks: 0});

      var newPath = id.substr(0, UrlShortener.options.url_length);

      UrlShortener.collection.update(id, {$set: {path: newPath}});

      return {
        path: newPath
      }
    }

  },
  'url-shortener/add-click': function(url_id) {
    check(url_id, String);

    UrlShortener.collection.update(url_id, {$inc: {clicks: 1}});
  }
});

Meteor.publish('shortUrls', function () {
  return UrlShortener.collection.find({});
});

Router.route('/s/:_id', {
    where: 'server',
    action: function() {
      var url = this.params._id;

      var doc = UrlShortener.collection.findOne({path: url});

      if (doc) {
        Meteor.call('url-shortener/add-click', doc._id, function(err) {
          if (err) {
            throw new Meteor.Error("Click Count Fail", "Click count failed");
          }
        });
        this.response.writeHead(302, {
          'Location': doc.long_url
        });
        this.response.end();
      } else {
        this.response.writeHead(302, {
          'Location': UrlShortener.options.prefix + UrlShortener.options.bad_url
        });
        this.response.end();
      }

    }
});
