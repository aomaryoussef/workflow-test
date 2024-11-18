package template

import (
	"github.com/stretchr/testify/assert"
	"os"
	"path"
	"testing"
)

func createGolangTempl(dir string, filename string, content string) (string, error) {
	absolutFilePath := path.Join(dir, filename)
	var file, err = os.Create(absolutFilePath)
	if err != nil {
		return "", err
	}

	// Write content
	_, err = file.WriteString(content)
	if err != nil {
		return "", err
	}

	return absolutFilePath, nil
}

func TestNewTemplateStore_WithAllFilesPresent(t *testing.T) {
	// 1. Create a template in temp dir
	tempDir := t.TempDir()
	file, err := createGolangTempl(tempDir, "example_templ.tmpl", "send [{{ .CurrencyCode }}/{{ .CurrencyDecimal }} {{ .PrincipalAmount }}] (\n  source = @user:{{ .UserId }}:account_loan_principal_{{ .LoanId }} allowing unbounded overdraft\n  destination = @merchant:{{ .MerchantId }}:account_payable\n)")
	if err != nil {
		t.Fail()
	}
	templateStore := NewTemplateStore(file)
	assert.NotNil(t, templateStore)
	assert.True(t, templateStore.IsAllLoaded())
	assert.Equal(t, 0, len(templateStore.ShowAllErrors()))
}

func TestNewTemplateStore_WithNoFilePresent(t *testing.T) {
	// 1. Create a template in temp dir
	tempDir := t.TempDir()
	file := path.Join(tempDir, "non_existing.tmpl")
	templateStore := NewTemplateStore(file)
	assert.NotNil(t, templateStore)
	assert.False(t, templateStore.IsAllLoaded())
	assert.Equal(t, 1, len(templateStore.ShowAllErrors()))
}
