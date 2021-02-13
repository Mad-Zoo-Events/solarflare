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

	id, err := controller.UpsertPreset(c.Param("effectType"), body)
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

// PreserRetrievalHandler handles requests to retrieve presets
func PreserRetrievalHandler(c *gin.Context) {
	presets, err := controller.RetrievePresets(c.Param("effectType"))
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.InvalidEffectType:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}
		return
	}

	c.JSON(http.StatusOK, presets)
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

	newID, err := controller.DuplicatePreset(c.Param("effectType"), c.Param("id"))
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

	c.String(http.StatusCreated, *newID)
}

// PresetTestHandler handles requests to test a preset before saving it
func PresetTestHandler(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		err = sferror.New(sferror.Encoding, "Error reading preset request body", err)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	controller.TestPresetAPI(c.Param("effectType"), body)

	c.Status(http.StatusNoContent)
}
