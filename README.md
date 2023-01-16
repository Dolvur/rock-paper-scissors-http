# Simple Rock Paper Scissors HTTP API

This is a simple Rock Paper Scissors game that can be played through HTTP requests.

## Setup

To run this program, you need to have Node.js installed.

1. Change into the directory where the game is located: `cd /path/to/game`
2. Install the dependencies: `npm install`
3. Start the game: `npm start`

The game should now be running.

If you want to run the tests, follow the instructions above but run `npm test` instead of `npm start`.

## Insomnia

One way to send the requests is to use a graphical program like Postman or Insomnia.

Using Insomnia the requests can be specified like in the following picture:

![Window of the Insomnia application](/pictures/Insomnia_window.PNG)

The body can be added as a JSON with their corresponding keyvalue pairs mentioned in the API. Authorization keys can be added in the Headers tab like following:

![Window of the Insomnia application](/pictures/Insomnia_authorizations_headers.png)

Note: If you are using this approach, it could be useful to use enviroment variables to prevent having to retype IDs and keys in all the requests.

## API

The game can be played by sending POST and GET requests to the endpoints shown below (default port: 8000):

### `GET /api/games/{id}`
Get the current state of a game. If you provide an authorization key, you will be able to see the move of the corresponding player before the game is over.

**Authorization**
* `key`: The authorization key for the player.

### `POST /api/games`
Creates a new game. You can supply a playername in the request body (if omitted, the name will be "player1"):
```json
{
    "name": "Lisa"
}
```
**Returns**
* `key`: The authorization key for the player.

### `POST /api/games/{id}/join`
Connects to a game with the given ID. Supply a playername in the request-body (if omitted the name will be "player2"):
```json
{
    "name": "Pelle"
}
```
**Returns:**
* `key`: The authorization key for the player.

### `POST /api/games/{id}/move`
Makes a move in the game. You need to provide the authorization key and the specific move in the request body ("rock", "paper", or "scissors"):

**Authorization**
* `key`: The authorization key for the player.

```json
{
	"move": "rock"
}
```

## Example:
``POST /api/games``

Creating a game with name "Lisa".

**Body:**
```json
{
	"name": "Lisa"
}
```

**Reply**:
```json
{
	"gameID": "vkw0lnhzja",
	"key": "32i6vi453zm",
	"name": "Lisa"
}
```

---

``POST /api/games/vkw0lnhzja/join``

Joining the game with name "Pelle".

**Body:**
```json
{
	"name": "Pelle"
}
```

**Reply**:
```json
{
	"name": "Pelle",
	"key": "s4nfguxzp2"
}
```

---


``GET /api/games/vkw0lnhzja``

Get game state from Lisa's perspective.

**Authorization**: `32i6vi453zm`

**Reply**: 
```json
{
	"player1": {
		"name": "Lisa",
		"move": null
	},
	"player2": {
		"name": "Pelle",
		"move": "unknown"
	},
	"winner": null
}
```

---

``POST api/games/vkw0lnhzja/move``

Make the move "rock" for Pelle.

**Authorization**: `s4nfguxzp2`

**Body**:
```json
{
	"move": "rock"
}
```

**Reply**:
```json
{
	"player1": {
		"name": "Lisa",
		"move": "unknown"
	},
	"player2": {
		"name": "Pelle",
		"move": "rock"
	},
	"winner": null
}
```

---

``POST api/games/vkw0lnhzja/move``

Make the move "paper" for Lisa.

**Authorization**: `32i6vi453zm`

**Body**:
```json
{
	"move": "paper"
}
```

**Reply**:
```json
{
	"player1": {
		"name": "Lisa",
		"move": "paper"
	},
	"player2": {
		"name": "Pelle",
		"move": "rock"
	},
	"winner": "Lisa"
}
```

---

``GET /api/games/vkw0lnhzja``

Get the game state.

**Authorization**: `--` (game is over so everything is shown)

**Reply**: 
```json
{
	"player1": {
		"name": "Lisa",
		"move": "paper"
	},
	"player2": {
		"name": "Pelle",
		"move": "rock"
	},
	"winner": "Lisa"
}
```




