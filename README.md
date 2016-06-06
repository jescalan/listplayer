# ListPlayer

[![npm](http://img.shields.io/npm/v/listplayer.svg?style=flat)](https://badge.fury.io/js/listplayer) [![tests](http://img.shields.io/travis/jescalan/listplayer/master.svg?style=flat)](https://travis-ci.org/jescalan/listplayer) [![dependencies](http://img.shields.io/david/jescalan/listplayer.svg?style=flat)](https://david-dm.org/jescalan/listplayer) [![coverage](http://img.shields.io/coveralls/jescalan/listplayer.svg?style=flat)](https://coveralls.io/github/jescalan/listplayer)

💃 A simple headless API for managing audio playlists in the browser

### Why should you care?

While managing a single track is straightforward enough using the web audio API directly, managing a playlist can get a little messy. This library wraps the complexity and exposes a simple and straightforward interface for playlists.

### Installation

`npm install listplayer -S`

### Usage

First, create an instance of ListPlayer for your playlist by feeding it a list of tracks, and any options you want to pass. Example below shows the default options.

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

You can also control the volume and seeking position:

```js
player.volume() // returns the volume, from 0 to 100
player.volume(50) // sets the volume to 50%
player.seek() // returns the position of the playhead, from 0 to 100
player.seek(50) // moves the playhead to 50% of the way through the track
```

#### Metadata

You can get information about the currently playing track easily through `player.currentTrack`. This information is read from [ID3 tags](https://www.wikiwand.com/en/ID3) on your audio files. It returns an object containing the following metadata:

```js
// returned from player.currentTrack
{
  title: 'xxx',
  album: 'xxx',
  artist: 'xxx',
  year: 'xxx',
  duration: 'xxx'
}
```

If you don't want to deal with ID3 tags, you can also set the metadata on a track manually by passing it in with this alternate syntax:

```js
const player = new ListPlayer({
  tracks: [
    {
      title: 'xxx',
      album: 'xxx',
      artist: 'xxx',
      year: 'xxx',
      src: '/audio/song.mp3'
    }, {
      title: 'xxx',
      album: 'xxx',
      artist: 'xxx',
      year: 'xxx',
      src: '/audio/othersong.mp3'
    }
  ]
})
```

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
- `volumeChange` - player's volume has been changed
- `error` - there was some type of error

Each event will provide a response object as the first parameter with additional information, if necessary.

#### Advanced

Finally, you can access the raw web audio nodes if you need to do more advanced things:

```js
player.ctx // raw web audio context
player.analyzer // raw analyzer for getting frequency, visualizations, etc
```

The UI is up to you entirely. You can build any UI you want and control it through ListPlayer. If anyone has built a nice UI that you'd like to share, please submit a pull request and we'll add it to the readme!

### License & Contributing

- [MIT Licensed](LICENSE.md)
- [Contributing Guidelines](contributing.md)
