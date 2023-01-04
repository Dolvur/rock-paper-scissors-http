# Simple Rock Paper Scissors HTTP API

## Setup

To run this simple program you need Node installed.

First ``cd`` into the directory then run:

```
npm install
npm start
```

The application should now be running.

# API

To use this application you only have to send POST and GET requests to the following endpoints (if self-hosted use e.g. localhost:8000/\<endpoint\>):

## GET /api/games/{id}
Return a game's current state. Supply with a authorization key to see that player's move before the game is over.

**Authorization**: {key}

## POST /api/games
Creates a new game. Supply a playername in the request-body (if omitted the name will be "player1"):
```
{
    "name": "Lisa"
}
```
**Returns:** {key} used for authorization

## POST /api/games/{id}/join
Connects to a game with the given ID. Supply a playername in the request-body (if omitted the name will be "player2"):
```
{
    "name": "Pelle"
}
```
**Returns:** {key} used for authorization

## POST api/games/{id}/move
Make a move. Supply the authorization key and the specfic move in the request-body ("rock", "paper" or "scissors"):

**Authorization**: {key}

```
{
	"move": "Rock"
}
```

## Example:
``POST /api/games``

**Body:**
``
{
"name": "Lisa"
}
``

**Reply**: Created game with id: l88mdy9y5w, player name: Lisa, player key: 8onil1500px

---

``POST /api/games/ul7l7appln/join``

**Body:**
``
{
"name": "Pelle"
}
``

**Reply**: Successfully joined game: "l88mdy9y5w", player name: Pelle, player key: 1dvcmhwryiz

---


``GET /api/games/ul7l7appln``

**Authorization**: 8onil1500px

**Reply**: 
```
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

**Authorization**: 8onil1500px

**Body**:
``
{
"move": "Rock"
}
``

**Reply**: Action: "rock" by Lisa in game l88mdy9y5w

---

``POST api/games/ul7l7appln/move``

**Authorization**: 1dvcmhwryiz

**Body**:
``
{
"move": "Paper"
}
``

**Reply**: Action: "paper" by Pelle in game l88mdy9y5w

---

``GET /api/games/ul7l7appln``

Authorization: -- (game is over so everything is shown)

**Reply**: 
```
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




