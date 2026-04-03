# Demo Game Engine

## Summary

The Demo Game Engine is a simple NodeJs app that provides game result generation.

## Games

Games are defined via a profile class and a game model class.

### Profile

The profile contains the maths profile for the game including the reel bands, pay table
 and winline configuration.

For the purpose of the demo engine, the profile also contains the stake range for the 
game although this would be provided via a config service in the real world.

### Game Model

The model contains the logic that runs the game mechanics of a particular game. In this 
way, the model can be reused across multiple games by combining it with different maths 
profiles.

## Players and Sessions

The engine maintains the player session which is mapped via a token. If a token is 
reused, the engine will fetch the existing session.

In the real world, this would be managed externally to the engine.

## API

The engine has a simple API as it is intended only for demo purposes rather than being 
a full production game engine.

### POST `/api/init`

Initialises a game session and returns the front-end game configuration.

see: [/docs/schemas/init.json](./docs/schemas/init.json)

| Param | Description |
|-------|-------------|
| token | Token used for authenication. For demo purposed, if tokens are reused, the engine will retrieve the existing session. |
| currency | The currency that the game should be played with. For demo purposes currency is not used, so it's inclusion is purely illustrative. |
| gameId | The ID of the game that should be initialised. |

### POST `/api/play`

Produces a play response for the a game.

For simplicity, all games are resolved after a single round removing the need for an 
and acknowledgement request from the game.

The previous result is stored in the player's session and will be displayed as the 
initial reel positions on resume.

see: [/docs/schemas/play.json](./docs/schemas/play.json)

| Param     | Description                                      |
|-----------|--------------------------------------------------|
| sessionId | The ID of the current play session.              |
| stake     | The value of the bet the player wishes to place. |

### `/api/prune`

Utility method that clear all current sessions.

### `/api/frig/add`

Adds a force code to the RNG allowing results to be frigged.

NOTE: Force codes are consumed in order and are not scoped to the player session as 
these are intended to be used locally only when testing a game.

see: [/docs/schemas/frig.json](./docs/schemas/frig.json)

| Param | Description                                      |
|-------|--------------------------------------------------|
| frig  | Comma separated string of reel positions to stop the reels at. E.g "0,0,0" -
 stops the reels on the first symbol of each reel band |

### `/api/frig/clear`

Clears any frigs currently in the RNG.

### `/api/health`

Provides an endpoint for service health observability.

## How To Use the Engine

The engine is built with Node at v25.8.1. However, it should work with older versions 
too although this has not been tested.

Assuming a valid version of Node is installed, first run `npm install` to install all
the project dependencies.

Next, build the server via `npm build` and finally, start an instance via `npm start`.

By default the server is set to run on port 3001. If you want to use a custom port, you
can pass this in the command line via the `--port` argument (e.g. `npm start --- ---port 3456`).

## Availabble Games

### Classic Fruity

Classic Fruity is a traditional 3 reel slot with 5 winlines.

Game ID: `classic-fruity`

#### Example Requests

##### Game initialisation

```
curl -X POST http://localhost:3000/api/init \
  -H "Content-Type: application/json" \
  -d '{
    "token": "random-player-token",
    "gameId": "classic-fruity",
    "currency": "GBP"
  }'
```

##### Play round

```
curl -X POST http://localhost:3000/api/play \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "<sessionId-from-init>",
    "stake": 1
  }'
```
# service-game-engine
