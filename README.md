# ListPlayer

[![npm](http://img.shields.io/npm/v/listplayer.svg?style=flat)](https://badge.fury.io/js/listplayer)  [![dependencies](http://img.shields.io/david/jescalan/listplayer.svg?style=flat)](https://david-dm.org/jescalan/listplayer)

💃 A simple headless API for managing audio playlists in the browser

### Why should you care?

While managing a single track is straightforward enough using a normal html5 audio node, managing a playlist can get a little messy. This library wraps the complexity and exposes a simple and straightforward interface for playlists.

### Installation

You can grab the source (or minified) directly from [the latest release](https://github.com/jescalan/listplayer/releases) and inlude it in your page if you want. You can also install it through npm with `npm install listplayer -S`.

### Usage

ListPlayer is a [UMD](https://github.com/umdjs/umd) module, so it can be used attached directly to window, through a commonjs-based system like browserify or webpack, or through requirejs with no modification necessary. Just load it up, and it will work. If you are using it as an attach-to-window class, it exports under the name `ListPlayer`.

To use it, first create an instance of ListPlayer for your playlist by feeding it a list of tracks, and any options you want to pass. For example:

```js
const player = new ListPlayer({
  tracks: ['/audio/song.mp3', '/audio/othersong.mp3'],
  loopTracks: true
})
```

ListPlayer will create a hidden audio element at the bottom of the `<body>` from which it controls the tracks.

#### Track Control

You can control the playlist in any number of ways. For example:

```js
player.index // starts at 0, set it as you wish
player.play() // plays the currentTrack, by default first song in the list
player.playing() // boolean, is it actively playing a song?
player.pause() // pauses the song, resumed at the same place with `play()`
player.next() // moves to the next song in the playlist
player.prev() // moves to the previous song in the playlist
```

If you have `loopTracks` set to `false` and try to move to the previous track from the first track in the list or the next track from the last, you will get an error. Otherwise it will loop back through the other side. When one track is finished playing, it will move to the next track in the list.

You can also control the playhead position as such:

```js
player.seek() // returns the position of the playhead in seconds (float)
player.seek(10) // moves the playhead to 10 seconds into the track
```

#### Metadata

You can get information about the currently playing track easily through `player.currentTrack`. You must pass in metadata with the constructor in order to access it for any given track, as such:

```js
const player = new ListPlayer({
  tracks: [
    {
      title: 'xxx',
      album: 'xxx',
      artist: 'xxx',
      src: '/audio/song.mp3'
    }, {
      title: 'xxx',
      album: 'xxx',
      artist: 'xxx',
      src: '/audio/othersong.mp3'
    }
  ]
})
```

You can access the metadata any time through `player.currentTrack`, which returns an object like this, exactly as you passed it in:

```js
// returned from player.currentTrack
{
  title: 'xxx',
  album: 'xxx',
  artist: 'xxx',
  src: 'xxx'
}
```

You can use this metadata to customize the interface of your player.

#### Events

The player instance also emits events that you can listen to in order to figure out what's going on. For example:

```js
player.on('play', console.log)
```

Here's a listing of all the events:

- `play` - a track starts playing
- `pause` - the player is paused
- `next` - player is moving to the next track
- `prev` - player is moving to the previous track
- `seek` - player is seeking to a different location within a track
- `error` - there was some type of error

Each event will provide a response object as the first parameter with additional information, if necessary.

#### Advanced

If you would like to use the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) in order to get some more advanced functionality, we do have an integration with ListPlayer set up. Just pass in `advanced: true` as a parameter to the constructor and it will switch into "advanced mode". In this mode, the audio node will be connected directly to a web audio API node, and you will see these two additional properties on your instance:

```js
player.ctx // raw web audio context
player.src // a MediaElementAudioSourceNode
```

We do not connect the source node to an output to give advanced users the opportunity to route it through any number of custom nodes (for example, a gain node or analyser). If you do want to get some sound out of it, you must connect the source and destination yourself, and can do so like this:

```js
player.src.connect(player.ctx.destination)
```

This means that by default in advanced mode, no sound will come out unless you do this. Also note that the Web Audio API is not supported in any version of Internet Explorer, so these properties will not be present in IE, and it will emit an error and continue operating in "normal" mode. This allows for progressive enhancement if that's what you're after.

### UI

The UI is up to you entirely. You can build any UI you want and control it through ListPlayer. This project is purposefully headless to give developers the opportunity to build custom UIs around it. If anyone has built a nice UI that you'd like to share, please submit a pull request and we'll add it to the readme!

### Browser Compatibility

Since this project primarily uses the [`<audio> element`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio), it can be used in [IE9+](http://caniuse.com/#feat=audio) safely. If you are using the web audio API features described in the section above, they are only supported in [IE 10+](http://caniuse.com/#feat=audio-api), and unfortunately completely unsupported in Safari due to its lack of support for `createMediaElementSource` up to the latest version, which is `9` at the time of writing.

### License & Contributing

- [MIT Licensed](LICENSE.md)
- [Contributing Guidelines](contributing.md)
