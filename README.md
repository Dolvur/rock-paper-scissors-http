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
Return a game's current state

## POST /api/games
Creates a new game. Supply a playername in the request-body (if omitted the name will be "player1"):
```
{
    "name": "Lisa"
}
```

## POST /api/games/{id}/join
Connects to a game with the given ID. Supply a playername in the request-body (if omitted the name will be "player2"):
```
{
    "name": "Pelle"
}
```

## POST api/games/{id}/move
Make a move. Supply the name and move in the request-body:
```
{
"name": "Lisa",
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

**Reply**: Created game with id: ul7l7appln

---

``POST /api/games/ul7l7appln/join``

**Body:**
``
{
"name": "Pelle"
}
``

**Reply**: Successfully joined game: "ul7l7appln", player name: Pelle

---


``GET /api/games/ul7l7appln``

**Reply**: 
```
{
	"player1": {
		"name": "Lisa",
		"move": null
	},
	"player2": {
		"name": "Pelle",
		"move": null
	},
	"winner": null
}
```

---

``POST api/games/ul7l7appln/move``

**Body**:
``
{
"name": "Lisa",
"move": "Rock"
}
``

**Reply**: Move rock made by Lisa in game ul7l7appln

---

``POST api/games/ul7l7appln/move``

**Body**:
``
{
"name": "Pelle",
"move": "Paper"
}
``

**Reply**: Move paper made by Pelle in game ul7l7appln

---

``GET /api/games/ul7l7appln``

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




