class ListPlayer extends EventEmitter { // eslint-disable-line
  constructor (options = {}) {
    super()
    this.tracks = (options.tracks || []).map((t) => {
      if (typeof t === 'string') return { src: t }
      return t
    })
    this.loopTracks = options.loopTracks || true
    this.el = this._injectAudioElement()
    this.index = 0
    this._loadTrack()
  }

  play () {
    this.emit('play')
    this._loadTrack()
    return this.el.play()
  }

  pause () {
    this.emit('pause')
    return this.el.pause()
  }

  next () {
    this.emit('next')
    this.index++
    if (this.index > this.tracks.length) {
      if (this.loopTracks) {
        this.index = 0
      } else {
        this.index--
        this.emit('error', 'you are on the last track')
      }
    }
    this._loadTrack()
    if (this.playing()) this.play()
  }

  prev () {
    this.emit('prev')
    this.index--
    if (this.index < 0) {
      if (this.loopTracks) {
        this.index = this.tracks.length
      } else {
        this.index++
        this.emit('error', 'you are on the first track')
      }
    }
    this._loadTrack()
    if (this.playing()) this.play()
  }

  playing () {
    return !this.el.paused
  }

  /**
   * Injects an audio element to the body and hides it.
   * @private
   */
  _injectAudioElement () {
    const el = document.createElement('audio')
    document.body.appendChild(el)
    el.style.display = 'none'
    return el
  }

  /**
   * Loads a track into the player
   * @private
   */
  _loadTrack () {
    if (this._loadedTrack === this.index) {
      this.el.currentTime = 0
      return
    }
    this.el.innerHTML = ''

    this.currentTrack = this.tracks[this.index]
    const source = document.createElement('source')
    source.src = this.currentTrack.src
    source.type = 'audio/mp3'

    this.el.appendChild(source)
    this.el.load()
    this._loadedTrack = this.index
  }
}
