package main

import (
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// PresetMutationHandler handles requests to create a new preset
func PresetMutationHandler(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		err = sferror.New(sferror.Encoding, "Error reading preset request body", err)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	id, err := controller.UpsertPresetAPI(c.Param("effectType"), body)
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.InvalidEffectType:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}
		return
	}

	c.String(http.StatusCreated, *id)
}

// PresetFormHandler handles requests from the UI to create a new preset
func PresetFormHandler(c *gin.Context) {
	err := c.Request.ParseForm()
	if err != nil {
		err = sferror.New(sferror.Encoding, "Error parsing form from UI", err)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	_, err = controller.UpsertPresetUI(c.Param("effectType"), c.Request.PostForm)
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.InvalidEffectType:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}
		return
	}

	c.Redirect(http.StatusFound, "/controlpanel/presets")
}

// PresetDeletionHandler deletes a preset
func PresetDeletionHandler(c *gin.Context) {
	err := controller.DeletePreset(c.Param("effectType"), c.Param("id"))
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.DatabaseNotFound:
			c.JSON(http.StatusNotFound, sferror.Get(err))
		case sferror.InvalidEffectType:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}
		return
	}

	c.Status(http.StatusNoContent)
}

// PresetDuplicationHandler duplicates a preset
func PresetDuplicationHandler(c *gin.Context) {

	err := controller.DuplicatePreset(c.Param("effectType"), c.Param("id"))
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.DatabaseNotFound:
			c.JSON(http.StatusNotFound, sferror.Get(err))
		case sferror.InvalidEffectType:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}
		return
	}

	c.Status(http.StatusCreated)
}

// PresetFormTestTestHandler handles requests from the UI to test a preset
func PresetFormTestTestHandler(c *gin.Context) {
	err := c.Request.ParseForm()
	if err != nil {
		err = sferror.New(sferror.Encoding, "Error parsing form from UI", err)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	err = controller.TestPreset(c.Param("effectType"), c.Request.PostForm)
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.InvalidEffectType:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}
		return
	}
}
