package sferror

import (
	"bytes"
	"encoding/json"
	"log"

	"github.com/eynorey/solarflare/src/model"
)

// ErrorType is the "enum" containing possible error types for the microservice
type ErrorType struct {
	name string
	code int64
}

var (
	// BadRequest | the request is invalid with the data provided
	BadRequest = ErrorType{"BadRequest", 10}
	// PresetNotFound | requested preset does not exist
	PresetNotFound = ErrorType{"PresetNotFound", 11}
	// ActionNotAllowed | requested action is not allowed for the effect type
	ActionNotAllowed = ErrorType{"ActionNotAllowed", 12}
	// InvalidEffectType | effect type does not exist
	InvalidEffectType = ErrorType{"InvalidEffectType", 13}

	// Aurora | received error response from Aurora
	Aurora = ErrorType{"Aurora", 20}
	// FailedOnAuroraAll | failed to execute request on all Aurora instances
	FailedOnAuroraAll = ErrorType{"FailedOnAuroraAll", 21}
	// FailedOnAuroraSome | failed to execute request on some Aurora instances
	FailedOnAuroraSome = ErrorType{"FailedOnAuroraSome", 22}

	// Database | unknown error from the database
	Database = ErrorType{"Database", 30}
	// DatabaseMarshal | failed to marshal data for the database
	DatabaseMarshal = ErrorType{"DatabaseMarshal", 31}
	// DatabaseUnmarshal | failed to unmarshal data from the database
	DatabaseUnmarshal = ErrorType{"DatabaseUnmarshal", 32}
	// DatabaseCRUD | error when tryping to read from or write to the database
	DatabaseCRUD = ErrorType{"DatabaseCRUD", 33}
	// DatabaseNotFound | the requested entry could not be found on the database
	DatabaseNotFound = ErrorType{"DatabaseNotFound", 34}

	// Internal | unknown internal error
	Internal = ErrorType{"Internal", 90}
	// Encoding | encoding error
	Encoding = ErrorType{"Encoding", 91}
	// Template | error when processing an html template
	Template = ErrorType{"Template", 92}

	// Unknown | someone raised a non-cs error
	Unknown = ErrorType{"Unknown", 99}
)

// CsError is the error type to be used within the microservice
type CsError struct {
	errType ErrorType
	message string
}

// Error returns the message of the error
func (e CsError) Error() string {
	return e.message
}

// GetErrorResponse converts the cs error to an error response body
func GetErrorResponse(err error) []byte {
	var errResp model.Error
	// try to cast to cs error
	if csErr, ok := err.(CsError); ok {
		errResp = model.Error{Message: csErr.message, Code: csErr.errType.code}
	} else {
		// this should never happen
		errResp = model.Error{Message: "INVALID ERROR TYPE -> Error: " + err.Error()}
	}

	respBody, _ := json.Marshal(errResp)
	return respBody
}

// GetErrorType returns the type of an cs error
func GetErrorType(err error) ErrorType {
	// try to cast to cs error
	if csErr, ok := err.(CsError); ok {
		return csErr.errType
	}

	// this should never happen
	return Unknown
}

// New returns a new error based on the type
func New(errType ErrorType, message string, err error) CsError {
	var msg bytes.Buffer
	msg.WriteString(errType.name)
	msg.WriteString(" | ")
	msg.WriteString(message)

	ee := CsError{errType: errType, message: msg.String()}

	if err != nil {
		msg.WriteString(" | ")
		msg.WriteString(err.Error())
	}

	log.Printf("ERR %d: %s", errType.code, msg.String())
	return ee
}
