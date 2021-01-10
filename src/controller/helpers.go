package controller

import (
	"github.com/go-playground/form/v4"
)

var decoder *form.Decoder

func init() {
	decoder = form.NewDecoder()
}

func contains(arr []string, str string) bool {
	for _, e := range arr {
		if e == str {
			return true
		}
	}
	return false
}
