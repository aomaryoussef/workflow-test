package events

import "fmt"

type Handler interface {
	Handle(m Event) error
}

type defaultHandler struct {
}

func NewDefaultHandler() Handler {
	return &defaultHandler{}
}

func (h *defaultHandler) Handle(e Event) error {
	return fmt.Errorf("undefined message %+v\n", e)
}
