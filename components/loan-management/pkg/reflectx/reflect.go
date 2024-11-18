package reflectx

import (
	"reflect"
)

func IsOfType(source, destType interface{}) bool {
	return reflect.TypeOf(source).AssignableTo(reflect.TypeOf(destType))
}
