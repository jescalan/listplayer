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
    this._loadTrack()
    this.emit('play')
    return this.el.play()
  }

  pause () {
    this.emit('pause')
    return this.el.pause()
  }

  next () {
    this.index++
    this.emit('next')
    this._loadTrack()
    if (this.playing()) this.play()
  }

  prev () {
    this.index--
    this.emit('prev')
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
