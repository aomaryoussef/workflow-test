package checkout

import (
	"testing"

	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/stretchr/testify/assert"
)

func TestTask(t *testing.T) {
	workerTask := NewLoadFinancialProductTask(app.Application{})
	f := workerTask.GetTaskFunction()
	assert.NotNil(t, f, "Function was empty")
}
