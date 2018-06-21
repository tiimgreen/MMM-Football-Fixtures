# MMM-Football-Fixtures

A MagicMirror module to display upcoming fixtures for your chosen football leagues and teams.

Example:

![Example fixtures table](https://i.imgur.com/PMTg2hG.png)

MMM-Football-Fixtures uses [football-data.org](https://www.football-data.org/) as a data source.

## Config Options

| Option | Default value | Description |
| ------ | ------------- | ----------- |
| `api_key` | `false` | The API key for [football-data.org](https://www.football-data.org/) |
| `leagues` | `{}` | All the leagues you want to display, the key is the header of the fixtures that will appear on your MagicMirror and the value is the code for the league which can be found at [football-data.org](https://www.football-data.org/). Unfortunately you will have to search through the blog posts to find the leagues you want as there is no single data source. |
| `leagues_show_all_games` | `{}` | Similar to `leagues` but all games in these leagues will be displayed in the table. |
| `teams` | `[]` | These are a list of team names (as they appear in the league table) who's matches you want to display. |
| `teamComparator` | `OR` | This can be either of `["OR", "AND"]` this will determine if either the home team `OR` the away team, or the home team `AND` the away team must be teams that you are interested in (set in `teams`). |
