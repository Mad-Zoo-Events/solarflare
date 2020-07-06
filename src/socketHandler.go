package main

import (
	"net/http"

	"github.com/gorilla/websocket"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// SocketHandler handles websocket requests for UI updates
func SocketHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Upgrade(w, r, nil, 1024, 1024)
		if err != nil {
			msg := "Error upgrading connection to websocket"
			sferror.New(sferror.SocketOpen, msg, err)
			writeResponse(w, 500, []byte(msg))
			return
		}

		manager.AddSocket(conn)

		writeResponse(w, 201, nil)
	}
}
