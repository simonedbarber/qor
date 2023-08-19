package utils

import (
	"reflect"
	"sync"

	"gorm.io/gorm/schema"
)

var (
	syncMap = &sync.Map{}
	ns      = schema.NamingStrategy{}
)

func NewScope(value interface{}) *schema.Schema {
	scope, _ := schema.Parse(value, syncMap, ns)
	return scope
}

func PrimaryField(scope *schema.Schema) *schema.Field {
	if primaryFields := scope.PrimaryFields; len(primaryFields) > 0 {
		if len(primaryFields) > 1 {
			if field, ok := scope.FieldsByDBName["id"]; ok {
				return field
			}
		}
		return scope.PrimaryFields[0]
	}
	return nil
}

func isBlank(value reflect.Value) bool {
	switch value.Kind() {
	case reflect.String:
		return value.Len() == 0
	case reflect.Bool:
		return !value.Bool()
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return value.Int() == 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		return value.Uint() == 0
	case reflect.Float32, reflect.Float64:
		return value.Float() == 0
	case reflect.Interface, reflect.Ptr:
		return value.IsNil()
	}

	return reflect.DeepEqual(value.Interface(), reflect.Zero(value.Type()).Interface())
}

func PrimaryKeyZero(result interface{}) bool {
	scope := NewScope(result)
	field := PrimaryField(scope)
	return field == nil || isBlank(reflect.Indirect(reflect.ValueOf(result)).FieldByName(field.Name))
}

func typeName(typ reflect.Type) string {
	for typ.Kind() == reflect.Slice || typ.Kind() == reflect.Ptr {
		typ = typ.Elem()
	}

	return typ.Name()
}

func FieldByName(scope *schema.Schema, name string) (field *schema.Field, ok bool) {
	var (
		dbName           = ns.ColumnName("", name)
		mostMatchedField *schema.Field
	)

	for _, field := range scope.Fields {
		if field.Name == name || field.DBName == name {
			return field, true
		}
		if field.DBName == dbName {
			mostMatchedField = field
		}
	}
	return mostMatchedField, mostMatchedField != nil
}
