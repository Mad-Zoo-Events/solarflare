package main

import (
	"io/ioutil"
	"net/http"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/utils/sferror"
	"github.com/gin-gonic/gin"
)

// CommandHandler handles requests to run a console command
func CommandHandler(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)

	err = controller.RunSingleCommand(body)
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
