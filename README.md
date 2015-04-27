# Simple Url Shortener

I had to make a url shortener for an app recently and decided to turn it into a package! I hope you enjoy it.

I've made a short video tutorial for adding this package to your app so feel to check that out [here](https://www.youtube.com/watch?v=fcKAf-di-bA) or you can follow the instructions below.

Here is the code from the example app in the video: https://github.com/ryanswapp/url-shortener-example

## Getting Started

Add the package:

```
meteor add ryanswapp:url-shortener
```

This package assumes you are using Iron Router for routing so you will also need to set that up if you haven't already.

Next you need to use the 'UrlShortener.shorten()' method wherever you plan to shorten urls. This function takes a url (String) and a callback. Let's say you have an input with a class of '.url-to-shorten' on the home page in which users can put a regular url and then when they click a button with a class of '.shorten' the link will be shortened. The code would look like this:

```
Template.Home.events({
  'click .shorten': function(e, tmpl) {
    e.preventDefault();

    var url = $('.url-to-shorten').val();

    UrlShortener.shorten(url, function(err, res) {
      if (err) {
        console.log(err);
      } else {
        // This isn't required I am just demonstrating that you can set a
        // session variable to the value of res.path which is useful for
        // displaying the new short url to the user
        Session.set('shortUrl', res.path);

        // Clear the input value
        $('.url-to-shorten').val('');
      }
    });


  }
});
```

This code will validate the entered url, and if it is a valid url, will return a response object with a 'path' property. The 'path' property value is equal to the full short url that was just created.

The full short url is made up of the following:

```
res.path = UrlShortener.options.prefix + 's/' + newPath
```

A typical short url with default options will look something like this:

```
http://your_url/s/rTyud
```

I have added the "/s/" in there so that it won't catch your other routes. If this proves to be a problem please let me know and I will figure out a way to extend the functionality.

The last thing you will need to do is create a template that the app will redirect to if someone enters a short url route that doesn't exist. This configuration will need to be in the ```lib``` directory.

You set the bad_url option like this:

```
Meteor.startup(function() {
  UrlShortener.options.bad_url = "bad-urls";
});
```

As you can see, I have set the bad_url option to a string which represents a relative path. The corresponding route would look something like this:

```
Router.route('/bad-urls', {
  name: 'BadUrls'
});
```

And that should be all you need to get set up! Check the video tutorial [here](https://www.youtube.com/watch?v=fcKAf-di-bA) if you run into any trouble.

## More Info

This package exposes the UrlShortener object to both the client and server so that you can query the ShortUrls collection from either. This is what the default UrlShortener object looks like:

````
UrlShortener = {
    collection: new Mongo.Collection('short_urls'),
    options: {
      bad_url: '',
      prefix: Meteor.absoluteUrl(),
      url_length: 5
    }
}
````

You can customize the options by adding them in a ```Meteor.startup()``` function in the ```lib``` folder like so:

```
Meteor.startup(function() {
  UrlShortener.options.bad_url = "bad-urls";
  UrlShortener.options.url_length = 10;
});
```

As previously mentioned, this code needs to be in the ```lib``` folder (or anywhere other than the client or server folders).

You can also query the short_urls collection like this:

```
UrlShortener.collection.find({});
```

I have setup a publication that you can subscribe to in order to get all of the short urls. The publication looks like this:

```
Meteor.publish('shortUrls', function () {
  return UrlShortener.collection.find({});
});
```

I plan to add functionality that allows you to choose whether you'd like the collection automatically published or not. That way you can customize what data a template receives.

### A UrlShortener.collection Document

When created, a document of the UrlShortener.collection will have the following properties:

```
{
  long_url: 'http://your_long_url.com/',
  path: 'eRtjY',
  createdAt: new Date(),
  clicks: 0
}
```

Every time that a short url is visited, a Meteor method named 'url-shortener/add-click' is called and the 'clicks' property is incremented by 1.

### The Url

I initially was using ```/:_id``` as the path for redirects but ran into too many problems with it catching other routes so I changed the short url route to ```/s/:_id```. So, if you generate a new short url with a path of 'sXrtf' a user can visit 'http://your_url/s/sXrtf' and they will be redirected to the link this short url points to.

### Options

Here are a list of the options that exist and how you should use them.

#### bad_url

```
UrlShortener.options.bad_url
```

The default for this option is a blank string. This means that if a user tries to go to a short url that is not found they will be redirected to your apps home page. If you would like to route them to a particular template you must first add a route in your routes file:

```
Router.route('/bad-urls', {
  name: 'BadUrls'
});
```

You next need to configure the 'bad_url' option to point to this route:

```
Meteor.startup(function() {
  UrlShortener.options.bad_url = "bad-urls";
});
```

Now, when someone tries to go to a short url that doesn't exist they will be redirected to this template. Note that I am setting the 'bad_url' option to the relative path of the template.

#### prefix

```
UrlShortener.options.prefix
```

If for some reason you need to change the prefix (the root url that will be added before the bad_url option) you can do it like so:

```
Meteor.startup(function() {
  UrlShortener.options.prefix = "http://your_url/";
});
```

#### url_length

```
UrlShortener.options.url_length
```

This option sets the length of the short url string. The short url string (e.g. http://yoururl/s/eRtdY) is based off the random id generated by the database. You can set that option like so:

```
Meteor.startup(function() {
  UrlShortener.options.url_length = 10;
});
```

## Final Words

Please open an issue if you have questions or suggestions as to how I can improve the package. Thanks!
