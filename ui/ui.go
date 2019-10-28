// +build dev

package ui

import "net/http"

// Assets is the file system that contains the static (built) UI resources.
var Assets http.FileSystem = http.Dir("../build")
