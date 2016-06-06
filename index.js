// Event Emitter
// adapted from https://github.com/scottcorgan/tiny-emitter

class EventEmitter {
  on (name, callback, ctx) {
    const e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    })

    return this
  }

  once (name, callback, ctx) {
    const self = this
    function listener () {
      self.off(name, listener)
      callback.apply(ctx, arguments)
    };

    listener._ = callback
    return this.on(name, listener, ctx)
  }

  emit (name) {
    const data = [].slice.call(arguments, 1)
    const evtArr = ((this.e || (this.e = {}))[name] || []).slice()
    let i = 0
    const len = evtArr.length

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data)
    }

    return this
  }

  off (name, callback) {
    const e = this.e || (this.e = {})
    const evts = e[name]
    const liveEvents = []

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback) {
          liveEvents.push(evts[i])
        }
      }
    }

    (liveEvents.length) ? e[name] = liveEvents : delete e[name]

    return this
  }
}

class ListPlayer extends EventEmitter {
  constructor (options = {}) {
    super()
    this.tracks = options.tracks || []
    this.loopTracks = options.loopTracks || true
    this.el = this._injectAudioElement()
    this.index = 0

    // const AudioContext = window.AudioContext || window.webkitAudioContext
    // this.ctx = new AudioContext
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
    if (this.playing()) this.play()
  }

  prev () {
    this.index--
    this.emit('prev')
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
   */
  _loadTrack () {
    if (this._loadedTrack === this.index) {
      this.el.currentTime = 0
      return
    }

    this.el.innerHTML = ''

    console.log(`loading up track ${this.index}`)

    const source = document.createElement('source')
    source.src = this.tracks[this.index]
    source.type = 'audio/mp3'

    this.el.appendChild(source)
    this.el.load()
    this._loadedTrack = this.index
  }
}
