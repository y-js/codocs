
(function () {
  var connectorUrl
  if (window.location.hostname !== 'localhost') {
    connectorUrl = 'codocs.dmonad.io'
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
      // this is only used when creating a yjs instance in order to get the connector.room
      getContentRoom: function (roomId) {
        if (roomId != null) {
          return btoa(JSON.stringify({
            type: 'room',
            roomId: roomId
          }))
        } else {
          return null
        }
      },
      // this is only used when creating a yjs instance in order to get the connector.room
      getTitleRoom: function (roomId) {
        if (roomId != null) {
          return btoa(JSON.stringify({
            type: 'room',
            roomId: roomId,
            title: true
          }))
        } else {
          return null
        }
      },
      createDocumentRoom: function (docType) {
        var arr = new Uint8Array(20)
        window.crypto.getRandomValues(arr)
        var roomSecret = Array.from(arr).map(function (dec) {
          return dec.toString(16)
        }).join('')
        var roomId = md5(roomSecret)
        return { docType: docType, roomId: roomId, secret: roomSecret }
      },
      // set secret = null for read link only
      // returns an absolute url
      createRoomLink: function (docType, roomId, secret) {
        return window.location.origin + '/#' + btoa(JSON.stringify({
          roomId: roomId,
          secret: secret || null,
          docType: docType
        }))
      },
      // parse, given location.hash
      // returns room definition
      parseRoomLink: function (link) {
        var p = JSON.parse(atob(link))
        return {
          roomId: p.roomId,
          secret: p.secret,
          docType: p.docType
        }
      }
    }
  }
})()
