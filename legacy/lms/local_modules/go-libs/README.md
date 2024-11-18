`go-libs` is a collection of Golang utilities for various operations to be
standardised across all projects and modules.

## Installing

Use `go get` to install the latest version of the utility library

```shell
go get -u github.com/btechlabs/go-libs@latest
```

Next, include `go-libs` in your Golang module:

```go
import github.com/btechlabs/go-libs
```

## Release and Semantic Versioning

`go-libs` uses Semantic Versioning when releasing new features. Every utility
function is backwards compatible and a window will be given with a deprecation 
notice to consuming teams.