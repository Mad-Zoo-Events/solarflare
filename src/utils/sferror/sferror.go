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
	// StageNotFound | the stage to be selected does not exist
	StageNotFound = ErrorType{"StageNotFound", 14}

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

	// ClockInvalidBPM | invalid bpm value for the clock
	ClockInvalidBPM = ErrorType{"ClockInvalidBPM", 40}
	// ClockInvalidAction | invalid action for the clock
	ClockInvalidAction = ErrorType{"ClockInvalidAction", 41}
	// ClockInvalidRequestBody | invalid request body for a clock request
	ClockInvalidRequestBody = ErrorType{"ClockInvalidRequestBody", 42}

	// SocketOpen | error opening a new websocket
	SocketOpen = ErrorType{"SocketOpen", 50}
	// SocketSendUpdate | error when sending a UI update through a websocket
	SocketSendUpdate = ErrorType{"SocketSendUpdate", 51}

	// InstanceManagementError | error when appempting to perform an action on an instance
	InstanceManagementError = ErrorType{"InstanceManagementError", 60}

	// Internal | unknown internal error
	Internal = ErrorType{"Internal", 90}
	// Encoding | encoding error
	Encoding = ErrorType{"Encoding", 91}
	// Template | error when processing an html template
	Template = ErrorType{"Template", 92}

	// Unknown | someone raised a non-cs error
	Unknown = ErrorType{"Unknown", 99}
)

// SolarflareError is the error type to be used within the microservice
type SolarflareError struct {
	errType ErrorType
	message string
}

// Error returns the message of the error
func (e SolarflareError) Error() string {
	return e.message
}

// GetErrorResponse converts the sf error to an error response body
func GetErrorResponse(err error) []byte {
	var errResp model.Error
	// try to cast to cs error
	if csErr, ok := err.(SolarflareError); ok {
		errResp = model.Error{Message: csErr.message, Code: csErr.errType.code}
	} else {
		// this should never happen
		errResp = model.Error{Message: "INVALID ERROR TYPE -> Error: " + err.Error()}
	}

	respBody, _ := json.Marshal(errResp)
	return respBody
}

// Get converts the sf error to an error response object
func Get(err error) model.Error {
	var errResp model.Error
	// try to cast to cs error
	if csErr, ok := err.(SolarflareError); ok {
		errResp = model.Error{Message: csErr.message, Code: csErr.errType.code}
	} else {
		// this should never happen
		errResp = model.Error{Message: "INVALID ERROR TYPE -> Error: " + err.Error()}
	}

	return errResp
}

// GetErrorType returns the type of an cs error
func GetErrorType(err error) ErrorType {
	// try to cast to cs error
	if csErr, ok := err.(SolarflareError); ok {
		return csErr.errType
	}

	// this should never happen
	return Unknown
}

// New returns a new error based on the type
func New(errType ErrorType, message string, err error) SolarflareError {
	var msg bytes.Buffer
	msg.WriteString(errType.name)
	msg.WriteString(" | ")
	msg.WriteString(message)

	ee := SolarflareError{errType: errType, message: msg.String()}

	if err != nil {
		msg.WriteString(" | ")
		msg.WriteString(err.Error())
	}

	log.Printf("ERR %d: %s", errType.code, msg.String())
	return ee
}
