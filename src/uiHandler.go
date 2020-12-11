package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// ControlPanelHandler builds the control panel from templates
func ControlPanelHandler(c *gin.Context) {
	err := controller.RenderControlPanel(c.Writer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, sferror.Get(err))
	}
}
