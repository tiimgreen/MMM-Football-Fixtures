Module.register('MMM-Football-Fixtures', {
  defaults: {
    api_key: false,
    coloured: false,
    leagues: {
      'Premier League': 445
    },
    leagues_show_all_games: {
      'Champions League': 464
    },
    teams: [
      'Manchester City FC',
      'Tottenham Hotspur FC',
      'Chelsea FC',
      'Manchester United FC'
    ],
    max_teams: 10
  },

  leagueTable: {},

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.getData();

    // refresh every x milliseconds
    setInterval(
      this.getData.bind(this),
      this.config.api_key ? 300000 : 1800000 // with api_key every 5min, without every 30min
    );

    setInterval(
      this.updateDom.bind(this),
      5000
    );
  },

  getData: function() {
    this.sendSocketNotification(
      'GET_FOOTBALL_FIXTURES_DATA',
      { api_key: this.config.api_key, leagues: this.config.leagues }
    );
  },

  updateLeagueTable: function(data, teams) {
    var config = this.config;

    var prioritisedMatches = data.fixtures.filter(function(fixture) {
      for (key in config.leagues_show_all_games) {
        if (config.leagues_show_all_games[key] == data.id) {
          return true;
        }
      }

      return (
        teams.includes(fixture.homeTeamName) ||
        teams.includes(fixture.awayTeamName)
      );
    });

    function getFormattedDate(date) {
      var monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      return dayNames[date.getDay()] + ' ' + getOrdinalNum(date.getDate()) + ' ' + monthNames[date.getMonth()]
    }

    function getOrdinalNum(n) {
      return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    }

    function findObjectWithDate(array, date) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].formattedDate == date) {
          return i;
        }
      }

      return -1;
    }

    function sortByDay(a, b) {
      var dateA = Date.parse(a.formattedDate);
      var dateB = Date.parse(b.formattedDate);

      if (dateA < dateB) {
        return -1;
      }

      if (dateA > dateB) {
        return 1;
      }

      return 0;
    }

    function sortByKickOff(a, b) {
      var dateA = Date.parse(a.date);
      var dateB = Date.parse(b.date);

      if (dateA < dateB) {
        return -1;
      }

      if (dateA > dateB) {
        return 1;
      }

      return 0;
    }

    function addToFormattedMatchesArray(array, match) {
      var formattedDate = getFormattedDate(new Date(match.date));
      var index = findObjectWithDate(formattedMatches, formattedDate);

      if (index == -1) {
        array.push({
          formattedDate: formattedDate,
          games: [
            match
          ]
        });
      } else {
        array[index].games.push(match);
        array[index].games = array[index].games.sort(sortByKickOff);
      }
    }

    var formattedMatches = [];

    prioritisedMatches.map(function(match) {
      addToFormattedMatchesArray(formattedMatches, match);
    });

    var gameCounter = 0;
    var limitedMatches = [];

    for (var i = 0; i < formattedMatches.length; i++) {
      for (var j = 0; j < formattedMatches[i].games.length; j++) {
        var match = formattedMatches[i].games[j];
        if (!this.config.display_max || gameCounter < this.config.display_max) {
          addToFormattedMatchesArray(limitedMatches, match);
        }
      }
    }

    if (limitedMatches.length > 0) {
      this.leagueTable[data.league] = limitedMatches.sort(sortByDay);
    }
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

    function pad(num, size) {
      return ('000000000' + num).substr(-size);
    }

    var table = document.createElement('table');
    table.classList.add('football-fixtures-table', 'xsmall');

    for (var league in this.leagueTable) {
      var leagueHeader = document.createElement('thead');
      var leagueRow = document.createElement('tr');
      leagueRow.classList.add('league-row');

      var leagueHead = document.createElement('th');
      leagueHead.classList.add('centered', 'league-cell');
      leagueHead.innerHTML = league;
      leagueHead.colSpan = 5;

      leagueRow.appendChild(leagueHead);
      leagueHeader.appendChild(leagueRow);
      table.appendChild(leagueHeader);

      var leagueGames = document.createElement('tbody');
      leagueGames.classList.add('league-games');

      for (var i = 0; i < this.leagueTable[league].length; i++) {
        var day = this.leagueTable[league][i];

        var dateRow = document.createElement('tr');
        dateRow.classList.add('date-row');

        var dateCell = document.createElement('td');
        dateCell.classList.add('centered');
        dateCell.colSpan = 5;
        dateCell.innerHTML = day.formattedDate;

        dateRow.appendChild(dateCell);
        leagueGames.appendChild(dateRow);

        for (var j = 0; j < day.games.length; j++) {
          var game = day.games[j];

          var gameRow = document.createElement('tr');

          var homeIconCell = document.createElement('td');
          var homeIcon = document.createElement('img');
          homeIcon.classList.add('team-icon');
          homeIcon.src = 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg';

          homeIconCell.appendChild(homeIcon);
          var homeTeamName = document.createElement('td');
          homeTeamName.classList.add('team-cell', '-home');
          homeTeamName.innerHTML = game.homeTeamName;

          var gameTimeCell = document.createElement('td');
          var date = new Date(game.date);
          gameTimeCell.innerHTML = date.getHours() + ':' + pad(date.getMinutes(), 2);

          var awayIconCell = document.createElement('td');
          var awayIcon = document.createElement('img');
          awayIcon.classList.add('team-icon');
          awayIcon.src = 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg';

          awayIconCell.appendChild(awayIcon);
          var awayTeamName = document.createElement('td');
          awayTeamName.classList.add('team-cell', '-away');
          awayTeamName.innerHTML = game.awayTeamName;

          gameRow.appendChild(homeIconCell);
          gameRow.appendChild(homeTeamName);
          gameRow.appendChild(gameTimeCell);
          gameRow.appendChild(awayTeamName);
          gameRow.appendChild(awayIconCell);

          leagueGames.appendChild(gameRow);
        }
      }

      table.appendChild(leagueGames);
    }

    return table;
  },

  socketNotificationReceived: function(notification, payload) {
    switch (notification) {
      case 'FOOTBALL_FIXTURES_DATA':
        this.updateLeagueTable(payload, this.config.teams);
        break;
    }
  }
});
