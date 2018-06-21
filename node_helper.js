var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function() {
    console.log('Football fixtures module starting...');
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification == 'GET_FOOTBALL_FIXTURES_DATA') {
      var fixtures = [];

      for (var key in payload.leagues) {
        this.fetchData(payload, payload.leagues, key);
      }

      for (var key in payload.leagues_show_all_games) {
        this.fetchData(payload, payload.leagues_show_all_games, key);
      }
    }
  },

  fetchData: function(payload, leagues, key) {
    var options = {
      url: 'http://api.football-data.org/v1/competitions/' + leagues[key] + '/fixtures?timeFrame=' + payload.timeFrame
    }

    if (payload.api_key) {
      options.headers = { 'X-Auth-Token': payload.api_key };
    }

    this.getData(options, payload, leagues, key);
  },

  getData: function(options, payload, leagues, key) {
    var self = this;

    request(options, function(error, response, body) {
      if (error) {
        console.log('error: ', error);
      } else if (parseInt(response.statusCode) == 200) {
        self.sendSocketNotification('FOOTBALL_FIXTURES_DATA', {
          id: leagues[key],
          league: key,
          fixtures: JSON.parse(body).fixtures
        });
      }
    });
  }
})
