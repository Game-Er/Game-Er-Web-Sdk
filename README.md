GameUp Web SDK
==============

The Web SDK for the GameUp Service.

### About
[GameUp](https://gameup.io/) is a scalable, reliable, and fast gaming service for game developers.

The service provides the features and functionality provided by game servers today. Our goal is to enable game developers to focus on being as creative as possible and building great games. By leveraging the GameUp service you can easily add social login, gamer profiles, cloud game storage, and many other features.

For the full list of features check out our [main documentation](https://gameup.io/docs/).

### Setup

The client SDK is available on [Bower.io](http://bower.io/search/?q=gameup-sdk)

The SDK depends on Superagent (0.21.0) to make Ajax calls.

### Using [Bower.io](http://bower.io/)

To include the library in your project:

```shell
bower install --save gameup-sdk
```

### Getting Started

To use the GameUp SDK you will need an API Key. You can get one in the GameUp [Dashboard](http://dashboard.gameup.io).

The SDK has an asynchronous client API; it uses Superagent to make network calls. Every client request uses a callback function to handle API responses.

```js
var client = new GameUp.Client("Your API Key");
client.ping({
  success: function (status) {
    window.alert("Valid API Key");
  },
  error: function (status, response) {
    window.alert("Ping failed because " + response);
  }
});
```

#### Login a Gamer

Most features in the Game API require a gamer to be logged in. You can login a gamer anonymously and link a social account to their gamer token later.

To login a gamer:

```js
var client = new GameUp.Client("Your API Key");
// A generated UUID; only generate one if you can't restore it from localStorage
var uniqueId = "8e9bbe7527924def93ba25025e46d884";
// Cache the UUID so the same gamer can be restored later
localStorage.setItem('gameupid', uniqueId);

// login the Gamer
client.loginAnonymous(uniqueId, {
  success: function(status, data) {
    localStorage.setItem('gamertoken', data.token);
  },
  error: function(status, data) {
    window.alert(data.message);
  }
});
// To reliably reload a gamer's account later; link their social account
```

#### More Documentation

For more examples and more information on features in the GameUp service have a look at our [main documentation](https://gameup.io/docs/).

#### Note

The Web SDK is still in _flux_, we're looking for [feedback](mailto:hello@gameup.io) from developers to make sure we're designing what you need to build incredible games. Please do get in touch and let us know what we can improve.

### Developer notes

The Web SDK is written in Typescript and uses Superagent to send and receive AJAX requests. To develop on the codebase you'll need to install:

- [Typescript](http://typescriptlang.org)
- [Node.js](http://nodejs.org)
- [GulpJS](http://gulpjs.com/)

#### Building the codebase

- `npm install`
- `gulp tsd`
- `gulp compile`

To compile and run tests:

- `npm test` (for headless tests)

And open `test/gameup-popup-test.html` in your browser.

### Contribute

All contributions to the documentation and the codebase are very welcome and feel free to open issues on the tracker wherever the documentation needs improving.

Lastly, pull requests are always welcome! `:)`
