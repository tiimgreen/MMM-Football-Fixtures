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
    teamComparator: "OR"
  },

  leagueTable: {},
  teamBadges: {},

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.setTeamBadges();
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

  setTeamBadges: function() {
    this.teamBadges['Germany'] = 'https://img.fifa.com/images/flags/4/ger.png';
    this.teamBadges['Brazil'] = 'https://img.fifa.com/images/flags/4/bra.png';
    this.teamBadges['Belgium'] = 'https://img.fifa.com/images/flags/4/bel.png';
    this.teamBadges['Portugal'] = 'https://img.fifa.com/images/flags/4/por.png';
    this.teamBadges['Argentina'] = 'https://img.fifa.com/images/flags/4/arg.png';
    this.teamBadges['Switzerland'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Switzerland.svg/1024px-Flag_of_Switzerland.svg.png';
    this.teamBadges['France'] = 'https://img.fifa.com/images/flags/4/fra.png';
    this.teamBadges['Poland'] = 'https://img.fifa.com/images/flags/4/pol.png';
    this.teamBadges['Spain'] = 'https://img.fifa.com/images/flags/4/esp.png';
    this.teamBadges['Peru'] = 'https://img.fifa.com/images/flags/4/per.png';
    this.teamBadges['Denmark'] = 'https://img.fifa.com/images/flags/4/den.png';
    this.teamBadges['England'] = 'https://img.fifa.com/images/flags/4/eng.png';
    this.teamBadges['Uruguay'] = 'https://img.fifa.com/images/flags/4/uru.png';
    this.teamBadges['Mexico'] = 'https://img.fifa.com/images/flags/4/mex.png';
    this.teamBadges['Colombia'] = 'https://img.fifa.com/images/flags/4/col.png';
    this.teamBadges['Croatia'] = 'https://img.fifa.com/images/flags/4/cro.png';
    this.teamBadges['Tunisia'] = 'https://img.fifa.com/images/flags/4/tun.png';
    this.teamBadges['Iceland'] = 'https://img.fifa.com/images/flags/4/isl.png';
    this.teamBadges['Costa Rica'] = 'https://img.fifa.com/images/flags/4/crc.png';
    this.teamBadges['Sweden'] = 'https://img.fifa.com/images/flags/4/swe.png';
    this.teamBadges['Senegal'] = 'https://img.fifa.com/images/flags/4/sen.png';
    this.teamBadges['Serbia'] = 'https://img.fifa.com/images/flags/4/srb.png';
    this.teamBadges['Australia'] = 'https://img.fifa.com/images/flags/4/aus.png';
    this.teamBadges['Iran'] = 'https://img.fifa.com/images/flags/4/irn.png';
    this.teamBadges['Morocco'] = 'https://img.fifa.com/images/flags/4/mar.png';
    this.teamBadges['Egypt'] = 'https://img.fifa.com/images/flags/4/egy.png';
    this.teamBadges['Nigeria'] = 'https://img.fifa.com/images/flags/4/nga.png';
    this.teamBadges['Korea Republic'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/255px-Flag_of_South_Korea.svg.png';
    this.teamBadges['Panama'] = 'https://www.onlinestores.com/flagdetective/images/download/panama-hi.jpg';
    this.teamBadges['Saudi Arabia'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/1000px-Flag_of_Saudi_Arabia.svg.png';
    this.teamBadges['Japan'] = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/1200px-Flag_of_Japan.svg.png';
    this.teamBadges['Russia'] = 'https://upload.wikimedia.org/wikipedia/en/archive/f/f3/20120812153730%21Flag_of_Russia.svg';

    // add user defined team badges
    if (this.config.teamBadges) {
      for (var team in this.config.teamBadges) {
        if (this.config.teamBadges.hasOwnProperty(key)) {
          this.teamBadges[team] = this.config.teamBadges[team];
        }
      }
    }
  },

  getData: function() {
    this.sendSocketNotification(
      'GET_FOOTBALL_FIXTURES_DATA',
      {
        api_key: this.config.api_key,
        leagues: this.config.leagues,
        leagues_show_all_games: this.config.leagues_show_all_games
      }
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

      if (config.teamComparator == "AND") {
        return (
          teams.includes(fixture.homeTeamName) &&
          teams.includes(fixture.awayTeamName)
        );
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
      var index = findObjectWithDate(array, formattedDate);

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

        gameCounter++;
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

          if (this.teamBadges[game.homeTeamName]) {
            homeIcon.src = this.teamBadges[game.homeTeamName]
          } else {
            homeIcon.src = 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg';
          }

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

          if (this.teamBadges[game.awayTeamName]) {
            awayIcon.src = this.teamBadges[game.awayTeamName]
          } else {
            awayIcon.src = 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg';
          }

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
