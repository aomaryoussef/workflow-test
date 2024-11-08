package internal

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path"

	"github.com/conductor-sdk/conductor-go/sdk/model"
)

const (
	ProcessDefinitionFileName = "process.json"
	TaskDefinitionFileName    = "tasks.json"
)

type workflowDefinition struct {
	ProcessDef model.WorkflowDef
	TaskDefs   *[]model.TaskDef
}

func Migrate(ctx context.Context, configDir string, envConfig EnvConfig) {
	var err error
	logger := InitLogger(envConfig.LogConfig.Level, envConfig.AppConfig.Env)
	processDir := path.Join(configDir, ProcessDefinitionDirName)
	entries, err := os.ReadDir(processDir)
	if err != nil {
		panicOnError(err)
	}

	conductor := NewConductorClient(envConfig)

	for _, entry := range entries {
		if entry.IsDir() {
			logger.Info(fmt.Sprintf("found dir: %s", entry.Name()))

			currentWorkflowDir := path.Join(processDir, entry.Name())
			definitions, err := loadFullDefinitions(currentWorkflowDir)

			if err != nil && definitions == nil {
				logger.Error(fmt.Sprintf("could not load definitions for process: %s error reason: %s", entry.Name(), err.Error()))
				continue
			}

			if err == nil && definitions.TaskDefs == nil {
				logger.Warn(fmt.Sprintf("no task definitions were loaded for the process: %s, are you sure this is expected", entry.Name()))
			}

			if definitions.TaskDefs != nil {
				err = conductor.createTasks(ctx, *definitions.TaskDefs)
				if err != nil {
					logger.Error(fmt.Sprintf("could not create/update tasks for process: %s error reason: %s", entry.Name(), err.Error()))
					continue
				}
				logger.Info(fmt.Sprintf("successfully updated %d tasks for process: %s", len(*definitions.TaskDefs), entry.Name()))
			}

			currentWorkflowVersion, err := conductor.getWorkflowLatestVersion(ctx, entry.Name())
			if err != nil {
				logger.Error(fmt.Sprintf("could not fetch latest version of process: %s error reason: %s", entry.Name(), err.Error()))
				continue
			}

			if definitions.ProcessDef.Version <= currentWorkflowVersion {
				logger.Info(fmt.Sprintf("current upstream workflow version is same as the defined version for process: %s, will skip", entry.Name()))
				continue
			}

			err = conductor.createWorkflow(ctx, definitions.ProcessDef)
			if err != nil {
				logger.Error(fmt.Sprintf("could not create/update process: %s error reason: %s", currentWorkflowDir, err.Error()))
				continue
			}
		}
	}
}

func loadFullDefinitions(basedir string) (*workflowDefinition, error) {

	workflowDef := &workflowDefinition{}

	processJsonPath := path.Join(basedir, ProcessDefinitionFileName)
	b, err := os.ReadFile(processJsonPath)
	if err != nil {
		return nil, err
	}

	workflow := model.WorkflowDef{}
	err = json.Unmarshal(b, &workflow)
	if err != nil {
		return nil, err
	}
	workflowDef.ProcessDef = workflow

	tasksJsonPath := path.Join(basedir, TaskDefinitionFileName)
	b, err = os.ReadFile(tasksJsonPath)
	if err != nil {
		return workflowDef, err
	}
	taskDefs := make([]model.TaskDef, 0)
	err = json.Unmarshal(b, &taskDefs)
	if err != nil {
		return workflowDef, err
	}
	workflowDef.TaskDefs = &taskDefs

	return workflowDef, nil
}

func panicOnError(err error) {
	if err != nil {
		panic(err)
	}
}
