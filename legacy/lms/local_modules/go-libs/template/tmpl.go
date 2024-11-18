package template

import (
	"errors"
	"os"
	"path/filepath"
	"text/template"
)

var (
	ErrNoTemplateDefinedByName = errors.New("no template defined by name")
)

type LoadedTemplate struct {
	name     string
	template *template.Template
}

// TemplateStore In-Memory store with all the Golang based templates.
// The store encapsulates the *template.Template native implementation
// and only allows for exposed / needed methods.
//
// The components needing the use of templates must always
// ensure to load the store on their process level.
//
// The caller of the TemplateStore must validate if no errors were generated
// while loading all the the templates. Use the #IsAllLoaded method to check.
//
// The name of the templates are the base file names by default and cannot be
// altered.
type TemplateStore struct {
	totalTemplatesRequested int
	totalTemplatesLoaded    int
	errors                  []error
	templateMap             map[string]LoadedTemplate
}

func (tm *TemplateStore) IsAllLoaded() bool {
	return tm.totalTemplatesLoaded == tm.totalTemplatesRequested
}
func (tm *TemplateStore) ShowAllErrors() []error {
	return tm.errors
}
func (tm *TemplateStore) ExecuteTemplate(name string, data any) error {
	if loadedTmpl, ok := tm.templateMap[name]; ok {
		err := loadedTmpl.template.Execute(os.Stdout, data)
		return err
	} else {
		return ErrNoTemplateDefinedByName
	}
}

func NewTemplateStore(absolutepaths ...string) (tmplStore *TemplateStore) {
	tmplStore = &TemplateStore{
		totalTemplatesRequested: len(absolutepaths),
		totalTemplatesLoaded:    0,
		errors:                  make([]error, 0),
		templateMap:             make(map[string]LoadedTemplate),
	}

	for _, path := range absolutepaths {
		filename := filepath.Base(path)
		tmpl, err := template.New(filename).ParseFiles(path)
		if err != nil {
			tmplStore.errors = append(tmplStore.errors, err)
		} else {
			tmplStore.totalTemplatesLoaded += 1
			tmplStore.templateMap[filename] = LoadedTemplate{
				name:     filename,
				template: tmpl,
			}
		}
	}
	return
}
