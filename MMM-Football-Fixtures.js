Module.register('MMM-Football-Fixtures', {
  defaults: {
    api_key: false,
    coloured: false,
  },

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.getData();

    // refresh every x milliseconds
    setInterval(
      this.getData.bind(this),
      this.config.api_key ? 300000 : 1800000 // with api_key every 5min, without every 30min
    );
  },

  getData: function() {
    this.sendSocketNotification(
      'GET_FOOTBALL_FIXTURES_DATA',
      { api_key: this.config.api_key }
    );
  },

  getScripts: function() {
    return [
      '//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.js'
    ];
  },

  getStyles: function() {
    return [
      'football-fixtures.css'
    ];
  },

  getHeader: function() {
    return 'Football Fixtures';
  },

  getDom: function() {
    return 'test';
  }

  socketNotificationReceived: function(notification, payload) {
    console.log('payload:', JSON.stringify(payload));

    switch (notification) {
      case 'FOOTBALL_FIXTURES_DATA':
        break;
    }
  }
});
