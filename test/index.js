const test = require('ava')
const dom = require('jsdom')
const path = require('path')

const fixtures = path.join(__dirname, 'fixtures')

test.cb('constructor', (t) => {
  dom.env({
    file: path.join(fixtures, 'basic.html'),
    scripts: [path.join(__dirname, '../dist/listplayer.js')],
    virtualConsole: dom.createVirtualConsole().sendTo(console),
    done: (err, w) => {
      if (err) return t.end(err)
      t.truthy(w.ListPlayer)
      new w.ListPlayer() // eslint-disable-line
      t.truthy(w.document.querySelector('audio'))
      t.end()
    }
  })
})
