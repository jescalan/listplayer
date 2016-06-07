
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.ListPlayer = factory();
  }
}(this, function(require, exports, module) {

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Event Emitter
// adapted from https://github.com/scottcorgan/tiny-emitter

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
  }

  _createClass(EventEmitter, [{
    key: 'on',
    // eslint-disable-line
    value: function on(name, callback, ctx) {
      var e = this.e || (this.e = {});

      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx
      });

      return this;
    }
  }, {
    key: 'once',
    value: function once(name, callback, ctx) {
      var self = this;
      function listener() {
        self.off(name, listener);
        callback.apply(ctx, arguments);
      };

      listener._ = callback;
      return this.on(name, listener, ctx);
    }
  }, {
    key: 'emit',
    value: function emit(name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;

      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }

      return this;
    }
  }, {
    key: 'off',
    value: function off(name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];

      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback) {
            liveEvents.push(evts[i]);
          }
        }
      }

      liveEvents.length ? e[name] = liveEvents : delete e[name];

      return this;
    }
  }]);

  return EventEmitter;
}();

var ListPlayer = function (_EventEmitter) {
  _inherits(ListPlayer, _EventEmitter);

  // eslint-disable-line

  function ListPlayer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ListPlayer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ListPlayer).call(this));

    _this.tracks = (options.tracks || []).map(function (t) {
      if (typeof t === 'string') return { src: t };
      return t;
    });
    _this.loopTracks = options.loopTracks || true;
    _this.el = _this._injectAudioElement();
    _this.index = 0;
    _this._loadTrack();
    if (_this.advanced) _this._loadAudioContext();
    return _this;
  }

  _createClass(ListPlayer, [{
    key: 'play',
    value: function play() {
      this.emit('play');
      this._loadTrack();
      return this.el.play();
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.emit('pause');
      return this.el.pause();
    }
  }, {
    key: 'next',
    value: function next() {
      this.emit('next');
      this.index++;
      if (this.index >= this.tracks.length) {
        if (this.loopTracks) {
          this.index = 0;
        } else {
          this.index--;
          this.emit('error', 'you are on the last track');
        }
      }
      var _wasPlaying = this.playing();
      this._loadTrack();
      if (_wasPlaying) this.play();
    }
  }, {
    key: 'prev',
    value: function prev() {
      this.emit('prev');
      this.index--;
      if (this.index <= 0) {
        if (this.loopTracks) {
          this.index = this.tracks.length;
        } else {
          this.index++;
          this.emit('error', 'you are on the first track');
        }
      }
      var _wasPlaying = this.playing();
      this._loadTrack();
      if (_wasPlaying) this.play();
    }
  }, {
    key: 'playing',
    value: function playing() {
      return !this.el.paused;
    }
  }, {
    key: 'seek',
    value: function seek(time) {
      if (!time) return this.el.currentTime;
      this.emit('seek', time);
      this.el.currentTime = time;
    }

    /**
     * Injects an audio element to the body and hides it.
     * @private
     */

  }, {
    key: '_injectAudioElement',
    value: function _injectAudioElement() {
      var el = document.createElement('audio');
      document.body.appendChild(el);
      el.style.display = 'none';
      return el;
    }

    /**
     * Loads a track into the player
     * @private
     */

  }, {
    key: '_loadTrack',
    value: function _loadTrack() {
      if (this._loadedTrack === this.index) return;
      this.el.innerHTML = '';

      this.currentTrack = this.tracks[this.index];
      var source = document.createElement('source');
      source.src = this.currentTrack.src;
      source.type = 'audio/mp3';

      this.el.appendChild(source);
      this.el.load();
      this._loadedTrack = this.index;
    }
  }, {
    key: '_loadAudioContext',
    value: function _loadAudioContext() {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return this.emit('error', 'web audio api unsupported');
      this.ctx = new AudioContext();
      this.src = this.ctx.createMediaElementSource(this.el);
    }
  }]);

  return ListPlayer;
}(EventEmitter);
return ListPlayer;

}));
