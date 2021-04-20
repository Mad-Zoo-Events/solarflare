package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// SocketHandler handles websocket requests for UI updates
func SocketHandler(c *gin.Context) {
	upgrader := websocket.Upgrader{
		WriteBufferSize: 131072, // 128 Kb
	}
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		sferror.New(sferror.SocketOpen, "Error upgrading connection to websocket", err)
		c.JSON(http.StatusInternalServerError, sferror.Get(err))
		return
	}

	manager.RegisterSocket(conn)
}
