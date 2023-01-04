# Simple Rock Paper Scissors HTTP API

This is a simple Rock Paper Scissors game that can be played through HTTP requests.

## Setup

To run this program, you need to have Node.js installed.

1. Change into the directory where the game is located: `cd /path/to/game`
2. Install the dependencies: `npm install`
3. Start the game: `npm start`

The game should now be running.

## API

The game can be played by sending POST and GET requests to the following endpoints (default port: 8000):

### `GET /api/games/{id}`
Gets the current state of a game. If you provide an authorization key, you will be able to see the move of the corresponding player before the game is over.

Authorization
* `key`: The authorization key for the player.

### `POST /api/games`
Creates a new game. You can supply a playername in the request body (if omitted, the name will be "player1"):
```json
{
    "name": "Lisa"
}
```
Returns
* `key`: The authorization key for the player.

### `POST /api/games/{id}/join`
Connects to a game with the given ID. Supply a playername in the request-body (if omitted the name will be "player2"):
```json
{
    "name": "Pelle"
}
```
**Returns:** {key} used for authorization

### `POST api/games/{id}/move`
Makes a move in the game. You need to provide the authorization key and the specific move in the request body ("rock", "paper", or "scissors"):

Authorization
* `key`: The authorization key for the player.

```json
{
	"move": "Rock"
}
```

## Example:
``POST /api/games``

**Body:**
```json
{
	"name": "Lisa"
}
```

**Reply**: Created game with id: l88mdy9y5w, player name: Lisa, player key: 8onil1500px

---

``POST /api/games/ul7l7appln/join``

**Body:**
```json
{
	"name": "Pelle"
}
```

**Reply**: Successfully joined game: "l88mdy9y5w", player name: Pelle, player key: 1dvcmhwryiz

---


``GET /api/games/ul7l7appln``

**Authorization**: `8onil1500px`

**Reply**: 
```json
{
	"player1": {
		"name": "Lisa",
		"move": null
	},
	"player2": {
		"name": "Pelle"
	},
	"winner": null
}
```

---

``POST api/games/ul7l7appln/move``

**Authorization**: `8onil1500px`

**Body**:
``
{
"move": "Rock"
}
``

**Reply**: Action: "rock" by Lisa in game l88mdy9y5w

---

``POST api/games/ul7l7appln/move``

**Authorization**: `1dvcmhwryiz`

**Body**:
``
{
"move": "Paper"
}
``

**Reply**: Action: "paper" by Pelle in game l88mdy9y5w

---

``GET /api/games/ul7l7appln``

Authorization: `--` (game is over so everything is shown)

**Reply**: 
```json
{
	"player1": {
		"name": "Lisa",
		"move": "rock"
	},
	"player2": {
		"name": "Pelle",
		"move": "paper"
	},
	"winner": "Pelle"
}
```




