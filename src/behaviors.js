

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
    }
  }
}