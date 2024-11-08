package main

import (
	"context"
	"github.com/btechlabs/mylo-workflow-orchestrator/cmd"
)

func main() {
	ctx := context.Background()
	cmd.ExecuteWithContext(ctx)
}
