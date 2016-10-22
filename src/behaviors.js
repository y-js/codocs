

window.AppBehaviors = {
  RoomIdentity: {
    /*
    We encode a room name
    */
    getRoomName: function (roomId) {
      if (roomId == null) {
        throw new Error('You must specify room name!')
      }
      return btoa(JSON.stringify({
        type: 'room',
        roomId: roomId
      }))
    },
    getRoomLink: function (roomId, secret) {
      return btoa(JSON.stringify({
        roomId: roomId,
        secret: secret
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