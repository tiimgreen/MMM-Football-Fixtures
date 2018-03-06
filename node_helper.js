var NodeHelper = require('node_helper');
var request = require('request');


module.exports = NodeHelper.create({
  start: function() {
    console.log('Football fixtures module starting...');
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification == 'GET_FOOTBALL_FIXTURES_DATA') {
      var fixtures = [];
      var i = 1;

      for (var key in payload.leagues) {
        var options = {
          url: 'http://api.football-data.org/v1/competitions/' + payload.leagues[key] + '/fixtures?timeFrame=n7'
        }

        if (payload.api_key) {
          options.headers = { 'X-Auth-Token': payload.api_key };
        }

        var last = i == Object.keys(payload.leagues).length;
        i++;

        this.getData(options, payload, key, last);
      }
    }
  },

  getData: function(options, payload, key, last) {
    var self = this;

    request(options, function(error, response, body) {
      if (error) {
        console.error('Error: ' + error);
      } else if (parseInt(response.statusCode) == 200) {
        self.sendSocketNotification('FOOTBALL_FIXTURES_DATA', {
          id: payload.leagues[key],
          league: key,
          fixtures: JSON.parse(body).fixtures,
          last: last
        });
      }
    });
  }
})
