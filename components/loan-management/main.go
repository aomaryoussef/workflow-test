package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/cmd"
	"github.com/btechlabs/lms/pkg/contextx"
	"sync"
	"time"
)

var (
	once sync.Once
)

func main() {
	ctx := context.Background()

	ctx = context.WithValue(ctx, contextx.ContextKeyRequestId, "start-up-trace")
	ctx = context.WithValue(ctx, contextx.ContextKeyUserId, "self")
	ctx = context.WithValue(ctx, contextx.ContextKeyCallingSystemId, "self")

	_init(ctx)

	cmd.ExecuteWithContext(ctx)
}

func _init(_ context.Context) {
	once.Do(func() {
		cairoTZ, err := time.LoadLocation("Africa/Cairo")
		if err != nil {
			panic(errors.Join(errors.New("failed to load Africa/Cairo timezone"), err))
		}
		time.Local = cairoTZ
		fmt.Println("time.Local set to Africa/Cairo timezone")
	})
}
