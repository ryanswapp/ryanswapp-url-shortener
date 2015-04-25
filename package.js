Package.describe({
  name: 'ryanswapp:url-shortener',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Simple plug and play url shortener for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/ryanswapp/ryanswapp-url-shortener.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
    'iron:router@1.0.7',
    'mongo@1.1.0'
  ]);
  api.addFiles('url-shortener.js');
  api.addFiles('url-shortener-server.js', 'server');
  api.export('UrlShortener');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ryanswapp:url-shortener');
  api.addFiles('url-shortener-tests.js');
});
