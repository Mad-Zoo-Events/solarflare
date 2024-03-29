package manager

import (
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const websocketTimeout = 30

type connection struct {
	conn *websocket.Conn
	mu   *sync.Mutex
}

var conns = make(map[uuid.UUID]*connection)

// RegisterSocket adds a new socket to the pool
func RegisterSocket(conn *websocket.Conn) {
	cfg := config.Get()
	log.Println("Registering socket connection with " + conn.RemoteAddr().String())
	id := uuid.New()
	conns[id] = &connection{
		conn: conn,
		mu:   &sync.Mutex{},
	}

	// Send initial batch of UI updates
	bpm, multiplier := GetClockSpeed()

	update := model.UIUpdate{
		ServerUpdate: &model.ServerUpdate{
			ActionPerformed: model.EnableServerAction,
			Servers:         cfg.Servers,
		},
		StageUpdate: &model.StageUpdate{
			Stages:        cfg.Stages,
			SelectedStage: cfg.SelectedStage,
		},
		ClockSpeedUpdate: &model.ClockSpeedUpdate{
			ClockSpeedBPM:        bpm,
			ClockSpeedMultiplier: multiplier,
		},
	}

	SendUIUpdate(update)

	go keepAlive(id)
}

// SendUIUpdate sends an update to the UI through each web socket
func SendUIUpdate(update model.UIUpdate) {
	for id := range conns {
		go sendUIUpdate(update, id)
	}
}

func sendUIUpdate(update model.UIUpdate, id uuid.UUID) bool {
	c := conns[id]

	c.mu.Lock()
	defer c.mu.Unlock()

	err := c.conn.WriteJSON(update)
	if err != nil {
		sferror.New(sferror.SocketSendUpdate, "Error sending an update through the web socket - Closing", err)
		return closeSocket(id)
	}
	return true
}

func keepAlive(id uuid.UUID) {
	c := conns[id]
	for {
		time.Sleep(websocketTimeout * time.Second)

		err := c.conn.WriteMessage(websocket.PingMessage, []byte{})
		if err != nil {
			closeSocket(id)
		}
	}
}

func closeSocket(id uuid.UUID) bool {
	if conns[id] != nil {
		if conns[id].conn != nil {
			conns[id].conn.Close()
		}
		delete(conns, id)
	}
	return true
}
