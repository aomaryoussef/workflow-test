package main

import (
	"context"
	
	"github.com/btechlabs/lms-lite/cmd"
)

func main() {
	ctx := context.Background()
	cmd.ExecuteWithContext(ctx)
}
