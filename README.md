# Virtual Radio Room

A interactive 3D virtual room built with Three.js.

## Features

- **Pink floor with golden stars**
- **Two sofas** for seating
- **3D radio** with four coloured buttons – approach it and click a button to play a song
- **Pink robot** with eyes that rolls around the room in a circle while carrying a tray with cheese and wine
- **First-person controls**: mouse look + WASD / arrow keys to walk around

## How to use

1. Open the live page (see below) or open `index.html` locally.
2. Click the screen to lock the mouse pointer and start looking around.
3. Use **W A S D** or the arrow keys to move.
4. Walk close to the radio (a small HUD appears) and **click** one of the four coloured buttons to play a track.
5. Press **Esc** to release the mouse.

The four demo tracks are free sample files from SoundHelix. You can replace the URLs in `script.js` with your own song files.

## GitHub Pages

To publish the site:

1. Go to the repository **Settings → Pages**
2. Under “Source” choose **Deploy from a branch**
3. Select branch **main** and folder **/ (root)**
4. Save – the site will be available at  
   `https://djpetradjp.github.io/virtual-radio-room/`

## Technical notes

- Three.js r134 + PointerLockControls
- Pure client-side HTML / JavaScript – no build step required
- Works best in a modern desktop browser with WebGL

Enjoy the room!
