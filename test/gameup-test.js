var jsdom  = require('jsdom'),
    assert = require('assert');

var client;

before(function(done) {
  jsdom.env({
    'html': '<html><body></body></html>',
    'scripts': [
      __dirname + '/../bower_components/superagent/superagent.js',
      __dirname + '/../build/js/gameup.js'
    ],
    'done': function(errors, window) {
      // polyfill 'btoa' function support
      window.btoa = function(str) {
        return new Buffer(str.toString(), 'binary').toString('base64');
      };

      // TODO move API key to an Env Var
      client = new window.GameUp.Client('9e87fc40a177490f95e734750f6b513e');
      done(errors);
    }
  });
});

// helper to invoke failure from JSON error responses
function errorAssert(done) {
  return function(status, response) {
    done(status);
    console.log("Error Response: " + status + " " + response.message);
  };
};

describe('Web SDK Tests', function() {
  var leaderboardId = '6ded1e8dbf104faba384bb659069ea69';

  it('Ping', function(done) {
    client.ping({
      success: function(status, data) {
        assert.strictEqual(status, 200);
        done();
      },
      error: errorAssert(done)
    });
  });

  it('Get Server Info', function(done) {
    client.getServerInfo({
      success: function(status, data) {
        assert.strictEqual(status, 200);
        done();
      },
      error: errorAssert(done)
    });
  });

  it('Get Game', function(done) {
    client.getGame({
      success: function(status, data) {
        assert.strictEqual(status, 200);
        done();
      },
      error: errorAssert(done)
    });
  });

  it('Get Game Achievements', function(done) {
    client.getAchievements({
      success: function(status, data) {
        assert.strictEqual(status, 200);
        done();
      },
      error: errorAssert(done)
    });
  });

  it('Get Game Leaderboard', function(done) {
    client.getLeaderboard(leaderboardId, {
      success: function(status, data) {
        assert.strictEqual(status, 200);
        done();
      },
      error: errorAssert(done)
    });
  });

  describe('Gamer Tests', function() {
    var storageKey    = 'profile_info';
    var achievementId = '70c99a8e6dff4a6fac7e517a8dd4e83f';
    var token;
    var token2;
    var gamerProfile;
    var gamerProfile2;
    var match;
    var lastTurn;

    before(function(done) {
      client.loginAnonymous('gameup-js-test-anonymous-id-login', {
        success: function(status, data) {
          assert.strictEqual(status, 200);

          token = data.token;
          client.loginAnonymous('gameup-js-test-anonymous-id2-login', {
            success: function(status, data) {
              token2 = data.token;
              done();
            },
            error: errorAssert(done)
          });
        },
        error: errorAssert(done)
      });
    });

    it.skip('Facebook (OAuth2) Login', function(done) {
      var accessToken = 'facebook-access-token';

      client.loginOAuthFacebook(accessToken, {
        success: function(status, data) {
          assert.strictEqual(status, 200);
          assert.notEqual(data.length, 0);
          done();
        },
        error: function (status, response) {
          assert.ok(status == 0 || status == 400, "Bad Facebook Access Token");
          done();
        },
      }, token);
    });

    it('Get Gamer', function(done) {
      client.getGamer(token, {
        success: function(status, data) {
          assert.strictEqual(status, 200);
          assert.notEqual(data.nickname, 0);

          gamerProfile = data;
          client.getGamer(token2, {
            success: function(status, data) {
              gamerProfile2 = data;
              done();
            },
            error: errorAssert(done)
          });
        },
        error: errorAssert(done)
      });
    });

    it('Delete Object from Cloud Storage', function(done) {
      client.storageDelete(token, storageKey, {
        success: function(status, data) {
          assert.strictEqual(status, 204);
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Add Object to Cloud Storage', function(done) {
      var object = {
        'level': 6,
        'level_name': 'bloodline',
        'bosses_killed': ['mo', 'chris', 'andrei']
      };

      client.storagePut(token, storageKey, object, {
        success: function(status, data) {
          assert.strictEqual(status, 204);
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Get Object from Cloud Storage', function(done) {
      client.storageGet(token, storageKey, {
        success: function(status, data) {
          assert.strictEqual(status, 200);
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Get Gamer Achievements', function(done) {
      client.getGamerAchievements(token, {
        success: function(status, data) {
          assert.strictEqual(status, 200);
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Update Gamer Achievement', function(done) {
      client.updateAchievement(token, achievementId, 10, {
        success: function(status, data) {
          assert.ok(status === 201 || status === 204, "Error Response: " + status + " " + JSON.stringify(data));
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Get Gamer Leaderboard', function(done) {
      client.getLeaderboardWithRank(token, leaderboardId, {
        success: function(status, data) {
          assert.strictEqual(status, 200);
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Update Gamer Rank on Leaderboard', function(done) {
      var score = new Date().getTime();

      client.updateLeaderboardRank(token, leaderboardId, score, {
        success: function(status, data) {
          assert.ok(status === 200 || status === 201, "Error Response: " + status + " " + JSON.stringify(data));
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Create Match', function(done) {
      //queue for match
      client.createMatch(token2, 2, {
        success: function(status, data) {
          assert.ok(status === 204, "Error Response: " + status + " " + JSON.stringify(data));
          //new match
          client.createMatch(token, 2, {
            success: function(status, data) {
              assert.ok(status === 200, "Error Response: " + status + " " + JSON.stringify(data));
              done();
            },
            error: errorAssert(done)
          });
        },
        error: errorAssert(done)
      });
    });

    it('List Matches', function(done) {
      client.listMatches(token, {
        success: function(status, data) {
          assert.ok(status === 200, "Error Response: " + status + " " + JSON.stringify(data));
          if (status == 200) {
            assert.notEqual(data.matches.length, 0);
            match = data.matches[data.matches.length - 1];
          }
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Most Recent Match Status and Metadata', function(done) {
      client.getMatch(token, match.match_id, {
        success: function(status, data) {
          assert.ok(status === 200, "Error Response: " + status + " " + JSON.stringify(data));
          assert.notEqual(data.created_at, 0);
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Submit Turn', function(done) {
      var lastTurnCount = 0;
      if (lastTurn != null) {
        lastTurnCount = lastTurn.turn_count;
      }

      client.submitTurn(token, match.match_id, lastTurnCount, gamerProfile2.nickname, "web-sdk-test", {
        success: function(status, data) {
          assert.ok(status === 204, "Error Response: " + status + " " + JSON.stringify(data));
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Get Turn Data', function(done) {
      client.getTurnData(token, match.match_id, 0, {
        success: function(status, data) {
          assert.ok(status === 200, "Error Response: " + status + " " + JSON.stringify(data));
          if (status == 200) {
            assert.notEqual(data.turns.length, 0);
            lastTurn = data.turns[data.turns.length - 1];
          }
          done();
        },
        error: errorAssert(done)
      });
    });

    it('Leave Match', function(done) {
      client.leaveMatch(token, match.match_id, {
        success: function(status, data) {
          assert.ok(status === 204, "Error Response: " + status + " " + JSON.stringify(data));
          done();
        },
        error: errorAssert(done)
      });
    });

    it('End Match', function(done) {
      client.endMatch(token2, match.match_id, {
        success: function(status, data) {
          assert.ok(status === 204, "Error Response: " + status + " " + JSON.stringify(data));
          done();
        },
        error: errorAssert(done)
      });
    });
  });
});
