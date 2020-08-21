package manager

import (
	"log"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

type connection struct {
	conn *websocket.Conn
	mu   *sync.Mutex
}

var conns = make(map[uuid.UUID]*connection, 0)

// RegisterSocket adds a new socket to the pool
func RegisterSocket(conn *websocket.Conn) {
	log.Println("Registering socket connection with " + conn.RemoteAddr().String())
	conns[uuid.New()] = &connection{
		conn: conn,
		mu:   &sync.Mutex{},
	}

	// Send initial batch of UI updates
	bpm, multiplier := GetClockSpeed()
	cfg := config.Get()

	update := model.UIUpdate{
		StatusUpdate: &model.StatusUpdate{
			RegisteredServerCount: len(cfg.Servers),
		},
		ClockSpeedUpdate: &model.ClockSpeedUpdate{
			ClockSpeedBPM:        bpm,
			ClockSpeedMultiplier: multiplier,
		},
	}

	SendUIUpdate(update)
}

// SendUIUpdate sends an update to the UI through each web socket
func SendUIUpdate(update model.UIUpdate) {
	for id := range conns {
		c := conns[id]

		c.mu.Lock()
		defer c.mu.Unlock()

		err := c.conn.WriteJSON(update)
		if err != nil {
			sferror.New(sferror.SocketSendUpdate, "Error sending an update through the web socket - Closing", err)
			closeSocket(id)
		}
	}
}

func closeSocket(id uuid.UUID) {
	conns[id].conn.Close()
	delete(conns, id)
}
