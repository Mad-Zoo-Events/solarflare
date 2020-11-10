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
	conn, err := websocket.Upgrade(c.Writer, c.Request, nil, 131072, 131072) // 128 Kb
	if err != nil {
		sferror.New(sferror.SocketOpen, "Error upgrading connection to websocket", err)
		c.JSON(http.StatusInternalServerError, sferror.Get(err))
		return
	}

	manager.RegisterSocket(conn)
}
