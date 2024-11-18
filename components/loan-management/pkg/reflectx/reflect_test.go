package reflectx

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestIsOfType(t *testing.T) {
	type someType struct {
		id string
	}
	type someOtherType struct {
		id string
	}
	t.Run("assert true when type matches", func(t *testing.T) {
		assert.True(t, IsOfType(someType{id: "some-id"}, someType{}))
	})
	t.Run("assert false when type doe not match", func(t *testing.T) {
		assert.False(t, IsOfType(someType{id: "some-id"}, someOtherType{}))
	})

	t.Run("assert true when type matches - ptr", func(t *testing.T) {
		assert.True(t, IsOfType(someType{id: "some-id"}, someType{}))
	})
	t.Run("assert false when type doe not match - ptr", func(t *testing.T) {
		assert.False(t, IsOfType(someType{id: "some-id"}, someOtherType{}))
	})
}
