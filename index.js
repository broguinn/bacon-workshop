const app = require('express')()
const rw = require('random-word')
const sse = require('tiny-sse')
const $ = require('baconjs')
const _ = require('lodash')

app.use('/events',
  (req, res, next) => {
    res.setHeader(
        'Access-Control-Allow-Origin', '*'
    )
    return next(null)
  },
  sse.head(),
  sse.ticker({seconds: 15}),
  (req, res) => {
    $.interval(parseInt(req.query.interval)||1000)
      .onValue(value => sse.send({
        event: 'new object',
        data: makeData()
      })(req, res));
  })

app.get('/ping', (req, res, next) => {
  res.send('Ok')
})

app.listen(9000)

function makeData() {
  // 0-3 times do
  // create an array of 1 - 5 unique words
  // join into a string
  // push into an array
  return JSON.stringify({
    comments: _.times(_.random(3),
                i => _.times(_.random(1, 5), rw).join(' '))
  })
}
