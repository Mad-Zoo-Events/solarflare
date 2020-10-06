package main

import (
	"net/http"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// CommandHandler handles requests to run a console command
func CommandHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			err = sferror.New(sferror.Encoding, "Error parsing the command request", err)
			writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			return
		}

		err = controller.RunSingleCommand(r.PostForm)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.Encoding:
				writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
			}

			return
		}

		writeResponse(w, http.StatusNoContent, nil)
	}
}
