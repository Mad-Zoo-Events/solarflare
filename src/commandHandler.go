package main

import (
	"net/http"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/utils/sferror"
	"github.com/gin-gonic/gin"
)

// CommandHandler handles requests to run a console command
func CommandHandler(c *gin.Context) {
	err := c.Request.ParseForm()
	if err != nil {
		err = sferror.New(sferror.Encoding, "Error parsing the command request", err)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	err = controller.RunSingleCommand(c.Request.PostForm)
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.Encoding:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}

		return
	}

	c.Status(http.StatusNoContent)
}
