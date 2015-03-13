package l10n

import (
	"reflect"
	"strings"

	"github.com/jinzhu/gorm"
)

func isLocalizable(scope *gorm.Scope) (isLocalizable bool) {
	_, isLocalizable = reflect.New(scope.GetModelStruct().ModelType).Interface().(Interface)
	return
}

func isLocaleCreateable(scope *gorm.Scope) (ok bool) {
	_, ok = reflect.New(scope.GetModelStruct().ModelType).Interface().(interface {
		LocaleCreateable()
	})
	return
}

func setLocale(scope *gorm.Scope, locale string) {
	method := func(value interface{}) {
		if model, ok := value.(Interface); ok {
			model.SetLocale(locale)
		}
	}

	if values := scope.IndirectValue(); values.Kind() == reflect.Slice {
		for i := 0; i < values.Len(); i++ {
			method(values.Index(i).Addr().Interface())
		}
	} else {
		method(scope.Value)
	}
}

type User struct {
	Name string `l10n:sync`
}

func parseTagOption(str string) map[string]string {
	tags := strings.Split(str, ";")
	setting := map[string]string{}
	for _, value := range tags {
		v := strings.Split(value, ":")
		k := strings.TrimSpace(strings.ToUpper(v[0]))
		if len(v) == 2 {
			setting[k] = v[1]
		} else {
			setting[k] = k
		}
	}
	return setting
}

func isSyncField(field *gorm.StructField) bool {
	if _, ok := parseTagOption(field.Tag.Get("l10n"))["SYNC"]; ok {
		return true
	}
	return false
}

func syncColumns(scope *gorm.Scope) (columns []string) {
	for _, field := range scope.GetModelStruct().StructFields {
		if isSyncField(field) {
			columns = append(columns, field.DBName)
		}
	}
	return
}