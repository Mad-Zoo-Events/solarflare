package manager

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

var conns = make(map[uuid.UUID]*websocket.Conn, 0)

// AddSocket adds a new socket to the pool
func AddSocket(conn *websocket.Conn) {
	conns[uuid.New()] = conn
}

// SendUIUpdate sends an update to the UI through each web socket
func SendUIUpdate(update model.UIUpdate) {
	for id := range conns {
		err := conns[id].WriteJSON(update)
		if err != nil {
			sferror.New(sferror.SocketSendUpdate, "Error sending an update through the web socket - Closing", err)
			closeSocket(id)
		}
	}
}

func closeSocket(id uuid.UUID) {
	conns[id].Close()
	delete(conns, id)
}
