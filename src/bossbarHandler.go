package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// BossbarHandler handles requests to control the bossbar
func BossbarHandler(c *gin.Context) {
	err := c.Request.ParseForm()
	if err != nil {
		err = sferror.New(sferror.Encoding, "Error parsing the bossbar request", err)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	err = controller.SetBossbar(model.EffectAction(c.Param("action")), c.Request.PostForm)
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.ActionNotAllowed, sferror.InvalidEffectType, sferror.Encoding:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}

		return
	}

	c.Status(http.StatusNoContent)
}
