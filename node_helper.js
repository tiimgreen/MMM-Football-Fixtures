var NodeHelper = require('node_helper');
var request = require('request');


module.exports = NodeHelper.create({
  start: function() {
    console.log('Sonos helper starting...');
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification == 'GET_FOOTBALL_FIXTURES_DATA') {
      var self = this;

      var options = {
        url: 'http://api.football-data.org/v1/competitions/' +  + '/leagueTable'
      };

      if (payload.api_key) {
        options.headers = { 'X-Auth-Token': payload.api_key };
      }

      // request(options, function(error, response, body) {
      //   if (error) {
      //     console.error('Error: ' + error);
      //   } else if (parseInt(response.statusCode) == 200) {
      //     self.sendSocketNotification('FOOTBALL_FIXTURES_DATA', JSON.parse(body));
      //   }
      // });
    }
  }
})
