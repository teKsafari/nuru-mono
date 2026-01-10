// quick go server that serves the main.wasm binary

package main

import (
	"log"
	"net/http"
	"strings"
)

const dir = "."

func main() {
	serve()
}

func serve() {
	fs := http.FileServer(http.Dir(dir))
	log.Print("Serving " + dir + " on http://localhost:7070")

	http.ListenAndServe(":7070", http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
		resp.Header().Add("Cache-Control", "no-cache")
		resp.Header().Set("Access-Control-Allow-Origin", "*")
		if strings.HasSuffix(req.URL.Path, ".wasm") {
			resp.Header().Set("content-type", "application/wasm")
		}
		fs.ServeHTTP(resp, req)
	}))
}
