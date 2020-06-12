package utils

import (
	"errors"
	"log"
)

// HandleError writes a complete error log and returns a new error with
// the consumer-friendly message passed as 'msg'
func HandleError(msg string, err error) error {
	log.Printf("%s: %s", msg, err.Error())
	return errors.New(msg)
}
