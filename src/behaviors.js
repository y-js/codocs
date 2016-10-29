
(function () {
  var connectorUrl
  if (window.location.hostname === "codocs.github.io") {
    connectorUrl = 'https://codocs.herokuapp.com'
  } else {
    connectorUrl = 'localhost:1234'
  }
  window.AppBehaviors = {
    RoomIdentity: {
      properties: {
        connectorUrl: {
          type: String,
          value: connectorUrl
        }
      },
      /*
      We encode a room name
      */
      getRoomName: function (roomId) {
        if (roomId != null) {
          return btoa(JSON.stringify({
            type: 'room',
            roomId: roomId
          }))
        } else {
          return null
        }
      },
      getRoomLink: function (roomId, secret) {
        return window.location.origin + '/#' + btoa(JSON.stringify({
          roomId: roomId,
          secret: secret || null
        }))
      },
      parseRoomLink: function (link) {
        var p = JSON.parse(atob(link))
        return {
          roomName: btoa(JSON.stringify({ type: 'room', roomId: p.roomId })),
          secret: p.secret
        }
      }
    }
  }
})()
