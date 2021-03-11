# P5 Game Template

## Overview

This is an extended game template using P5.js library with a React wrapper on the frontend, and an Express server on the backend.

This documentation assumes you're familiar with:
- [P5.js](https://p5js.org/)
- [Koji Platform](https://developer.withkoji.com/tutorials/getting-started/your-first-project) and `@withkoji/core` package

## Main Features

- Easily configurable Remix menu
- Live leaderboard
- Functions built on top of P5.js library that allow faster prototyping and deployment of casual games
- Hot-reloading developer experience
- Flexible Entity system
- Support for common game features like particles, floating texts, easing functions etc.
- Integrated game camera, so you can follow the player, do camera shakes etc.
- Customizable thumbnail preview when sharing your link on social media

## Structure

- App
  - View
    - Main Menu
    - Game
  - Remix
  - Screenshot

## Main Menu

This is the first screen you see when the app loads. It's a simple menu with a featured image, play button and a mini leaderboard on the bottom.
Unless you want to completely redesign the main menu, you would just change the `src` property in `FeaturedImage` element inside the `View` component, so it will display the image you want. By default it is set to the player image.
## Game
This is where all of the gameplay action takes place. 
`Game/index.js` is the component that initializes the `P5` instance and renders it. We are using [P5's instance mode](https://p5js.org/examples/instance-mode-instantiation.html) in order to avoid using `window` global variables all over the place, so all of our custom values will be appended to the P5 object itself.

#### Preload
All of game settings and assets are defined inside of `preload()`. Loading all images and sounds inside of this function will make sure they have finished loading before `setup()` is called.

- **Loading images**

You can easily load any image from a url with `addImage()`:

``` 
// Get remix values from koji.json
const preload = () => {
  ...
  const remixValues = Koji.remix.get();
  addImage('player', remixValues.imgPlayer, size);
  ...
}

```

This will store the player image inside of the `game.images` object.
You can access it later simply with `game.images.player`.

-  **Loading an array of images**

Sometimes you will want to have an array of images, for example when you have different enemies or collectibles. You can assign them directly:

```
game.images.particles = addImagesFromArray(remixValues.imgParticles, size);
```

- **Loading sounds**

All you need to do in order to load sounds is to prefix them with `snd` inside of `koji.json`'s `remixData`, and they will automatically be loaded and added to the `game.sounds` object.

For example:
```
"remixData": {
    ...
    "sndLoseGame": "https://objects.koji-cdn.com/75a91eb9-8e9a-43c1-a164-5be46802810b/d5qk9-lose.mp3",
    "sndWin": "https://objects.koji-cdn.com/75a91eb9-8e9a-43c1-a164-5be46802810b/l0wxk-win.mp3",
    ...
  },

```

Will automatically be loaded and can be played during the game by calling
```
playSound(game.sounds.losegame);
playSound(game.sounds.win);
```

**Note:** Object keys for loaded sounds will be converted to lower case - `sndLoseGame` becomes `game.sounds.losegame`

- **Defining global variables and settings**

All values should be contained within the `game` object. The best place to define them is inside `initializeValues()` function in `preload.js`:

```
const initializeValues = () => {
    ...
    game.playerSize = isMobile() ? 64 : 96;
    game.mySetting = false;
    ...

}
```

They can later be accessed through the `game` object.

#### Setup

`setup()` runs once after `preload()` is finished.
This is where you will want to set up all starting objects and entities in your game, like the player, starting enemies, collectibles etc.
The best place to do that is inside the pre-made `init()` function below `setup()`:

Example:
```
const setup = () => {
  ...
  init();
  ...
}

const init = () => {
    game.lives = game.startingLives;
    const player = new Player(game.width / 2, game.height / 2, { img: game.images.player });
    game.addEntity(player);
}
```

#### Draw
This is the main game loop which runs every frame.
It is pre-populated with code that takes care of updating entities, camera, clearing background etc.

You can also define your own functions below and run them. A good example of this would be spawning enemies and other game objects that are not spawned in the beginning.

Example: 
```
//Run this every frame
const draw = () => {
    ...
    manageEnemySpawning();
    ...
}

const manageEnemySpawning = () => {
  //Enemy spawn logic goes here
}
```

### Entity

This is a base class for all `Entities` that you want to display inside your game, like Player, Enemies, Collectibles, Projectiles etc.

To create a Player class using Entity as a base, it would look something like this:

```
class Player extends Entity{
    constructor(x, y, options){
        super(x, y, options);

        this.img = game.images.player;
    }

    update(){
        super.update();
        //This is what I'll do every frame!
    }
}
```

**Note:** In order to be displayed, entities need to have the `img` property assigned. You can assign it either in the constructor, like in the example above, or while instantiating:
`const player = new Player(x, y, { img: game.images.player });`

By default, `Entity` is rendered with centered origin and equal width and height. If you want to change this behaviour, override the `render()` function.

#### Adding entities to game loop
To make sure entities are displayed and updated in your game, use `game.addEntity()`:
```
...
const player = new Player(x, y, { img: game.images.player });
game.addEntity(player);
...
```

### Camera

Camera is enabled by default, allowing you to make use of its `camera.shake()` function, even if you're not moving it.

It is based on [p5-play](https://molleindustria.github.io/p5.play/examples/index.html?fileName=camera.js) Camera, with added shake functionality.

```
camera.shake(duration, [intensity]);

duration - Time in seconds
intensity - Strength of the shake (optional)
```

WIP BELOW THIS LINE
----
----
----
---
----
----
----
### [Controls](#~/frontend/Game/Utilities/controls.js)

#### Click/Touch

- *Touch Start*: Anything you put into the `myTouchAction()` inside [Controls](#~/frontend/Game/Utilities/controls.js) will be executed during the game on *Touch/Click*
- *Touch End*: Anything you put into the `myTouchEndAction()` inside [Controls](#~/frontend/Game/Utilities/controls.js) will be executed during the game on *Touch/Click Release*

- *Key Pressed*: Anything you put into the `keyPressed()` inside [Controls](#~/frontend/Game/Utilities/controls.js) will be executed during the game when you *press* a key on your keyboard
- *Key Released*: Anything you put into the `keyReleased()` inside [Controls](#~/frontend/Game/Utilities/controls.js) will be executed during the game when you *release* a key on your keyboard

### [Easing Functions](#~/frontend/Game/Utilities/easingFunctions.js)

- Move an Entity from `startPos` to `goalPos` over 1 second:
```
if(this.animTimer < 1){
  const animSpeed = 1;
  this.animTimer += 1/frameRate() * animSpeed;
  this.pos.x = Ease(EasingFunctions.easeOutQuad, this.animTimer, this.startPos.x, this.goalPos.x - this.startPos.x);
  this.pos.y = Ease(EasingFunctions.easeOutQuad, this.animTimer, this.startPos.y, this.goalPos.y - this.startPos.y);
}
```

- Increase an Entity's sizeMod from 1 to 4 over half a second:
```
if(this.animTimer < 1){
  const animSpeed = 2;
  this.animTimer += 1/frameRate() * animSpeed;
  this.sizeMod = Ease(EasingFunctions.easeOutQuad, this.animTimer, 1, 3);
  this.pos.y = Ease(EasingFunctions.easeOutQuad, this.animTimer, this.startPos.y, this.goalPos.y - this.startPos.y);
}
```

You can also check out my [Twitch Video](https://www.twitch.tv/videos/592087905) on how to use Easing Function and Smoothing.

### [Particles](#~/frontend/Game/Effects/Particle.js)

To spawn particles, use 

```
spawnParticles(x, y, amount, [options])
```

Possible options:
- `xVelocityMin` - Minimum horizontal velocity `Default: -0.5`
- `xVelocityMax` - Maximum horizontal velocity `Default: 0.5`
- `yVelocityMin` - Minimum vertical velocity `Default: -0.5`
- `yVelocityMax` - Minimum vertical velocity `Default: 0.5`
- `startingSizeMod` - How big the particle is when spawned `Default: random(1, 2)`
- `startingRotSpeed` - How fast it rotates when spawned `Default: random(-0.4, 0.4)`
- `img` - Particle Image `Default: imgParticle`
- `minDuration` - Minimum possible duration `Default: 0.3`
- `maxDuration` - Maximum possible duration `Default: 1`
- `damping` - How fast it will slow down `Default: 0.2`
- `gravity` - How fast it will fall down `Default: 0`

### [Floating Text](#~/frontend/Game/Effects/FloatingText.js)

To spawn floating text, use 

```
spawnFloatingText(txt, x, y, [options])
```

Possible options:
- `maxSize` - Size at the end of the animation `Default: 1 * objSize`
- `duration` - How long before the text fades out `Default: 0.65`
- `color` - Text Color `Default: textColor`
- `velocity` - Starting vertical velocity `Default: objSize * 0.075`
- `maxVelocity` - Starting horizontal velocity `Default: objSize * 0.075`
- `easingFunction` - [Function](#~/frontend/Game/Utilities/easingFunctions.js) to use for animation `Default: EasingFunctions.easeOutElastic`
- `shouldPulse` - If the text should keep pulsing after finishing animation `Default: false`
- `isUI` - If the text should ignore camera and be drawn as UI `Default: false`
- `animSpeed` - Animation speed `Default: 2`


#### Ending The Game

- If Game Timer ([Gameplay VCC](#~/.koji/customization/game.json!visual)) is enabled, the game will automatically end when it reaches 0
- If Game Timer is disabled, you can end the game manually by calling
```
endGameManager.endGame();
```
