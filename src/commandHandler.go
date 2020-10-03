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
			writeResponse(w, 400, sferror.GetErrorResponse(err))
			return
		}

		err = controller.RunCommand(r.PostForm)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.Encoding:
				writeResponse(w, 400, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, 500, sferror.GetErrorResponse(err))
			}

			return
		}

		writeResponse(w, 204, nil)
	}
}
