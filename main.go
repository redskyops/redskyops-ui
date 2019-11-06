package main

import (
	"github.com/redskyops/redskyops-ui/ui"
	"log"
	"net/http"
	"net/http/httputil"
)

func main() {
	http.Handle("/ui/", http.StripPrefix("/ui/", http.FileServer(ui.Assets)))
	http.Handle("/api/", &httputil.ReverseProxy{
		Director: func(req *http.Request) {
			req.Host = ""
			req.URL.Scheme = "http"
			req.URL.Host = "localhost:8888"
		},
	})
	log.Fatal(http.ListenAndServe(":80", nil))
}
