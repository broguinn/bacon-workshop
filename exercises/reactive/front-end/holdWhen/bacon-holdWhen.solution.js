$(function(){
  var messagesContainer = $('#hold-when .messages')
  var messageInput = $('#hold-when .message-input')
  var valveContainer = $('#hold-when .valve-indicator')

  var messageStream = messageInput.asEventStream('keypress')
  .filter(isEnter)
  .map(extractValue)
  .map(addTime)
  .map(makeAlert)
  .scan('', concat)
  .toEventStream()
  var valve = openCloseValve(3000)

  valve.map(makeIndicator)
  .onValue(updateValve(valveContainer))

  messageStream.onValue(emptyInput(messageInput))

  messageStream.holdWhen(valve)
  .onValue(updateContent(messagesContainer))

  function openCloseValve(freq){
    return Bacon.fromPoll(freq, alwaysOne)
    .scan(0, zeroOrOne)
    .map(Boolean)
  }
  function alwaysOne(){ return Bacon.Next(1) }
  function zeroOrOne(prev){ return (prev + 1) % 2 }

  function isEnter(e){
    return e.keyCode === 13
  }

  function extractValue(e){
    return e.target.value
  }

  function addTime(message){
    var d = new Date(),
    hours = d.getHours(),
    minutes = d.getMinutes(),
    seconds = d.getSeconds()
    return hours + ':' + minutes + ':' + seconds + ' - ' + message
  }

  function makeAlert(message){
    return '<div class="alert alert-info">' + message + '</div>'
  }

  function makeIndicator(isClosed){
    if (isClosed) return '<span class="label label-danger">the valve is closed</span>'
    else return '<span class="label label-success">the valve is open</span>'
  }

  function updateContent(el){
    return function(content){
      el.html(content)
      return content
    }
  }

  function updateValve(el){
    return function(content){
      el.html(content)
    }
  }

  function emptyInput(input){
    return function(){
      input.val('')
    }
  }

  function concat(str1, str2){
    return str1 + str2
  }
})
