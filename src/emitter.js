// Event Emitter
// adapted from https://github.com/scottcorgan/tiny-emitter

class EventEmitter { // eslint-disable-line
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
