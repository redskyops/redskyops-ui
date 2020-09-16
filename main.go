package main

import (
	"github.com/redskyops/redskyops-ui/v2/ui"
	"log"
	"net/http"
	"net/http/httputil"
)

func main() {
	http.Handle("/ui/", http.StripPrefix("/ui/", http.FileServer(ui.Assets)))
	http.Handle("/health", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {}))
	http.Handle("/v1/", &httputil.ReverseProxy{
		Director: func(req *http.Request) {
			req.Header.Set("X-Forwarded-Proto", "http")
			req.Header.Set("X-Forwarded-Host", req.Host)
			req.Host = ""
			req.URL.Scheme = "http"
			req.URL.Host = "localhost:8888"
		},
	})
	log.Fatal(http.ListenAndServe(":80", nil))
}
