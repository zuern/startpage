package pkg

import (
	"bytes"
	"fmt"
	"html/template"
	"net/http"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

const STATIC_DIR = "/static/"

// Server for site.
type Server struct {
	port int
	cfg  *Config
}

// NewServer creates a Server.
func NewServer(port int, cfg *Config) *Server {
	return &Server{
		port: port,
		cfg:  cfg,
	}
}

// Start the server. This will block.
func (s *Server) Start() error {
	r := mux.NewRouter().StrictSlash(true)
	r.Use(mux.MiddlewareFunc(logRequest))

	// Serve static files
	r.PathPrefix(STATIC_DIR).Handler(http.StripPrefix(STATIC_DIR, http.FileServer(http.Dir("."+STATIC_DIR))))
	r.HandleFunc("/", s.handleIndex)

	log.WithField("port", s.port).Info("Server listening")
	return http.ListenAndServe(fmt.Sprintf(":%d", s.port), r)
}

func logRequest(h http.Handler) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		log.Infof("%s %s", req.Method, req.RequestURI)
		h.ServeHTTP(res, req)
	})
}

func (s *Server) handleIndex(res http.ResponseWriter, req *http.Request) {
	var tmpl *template.Template
	var err error

	// if HTTP/2 is supported, use server push
	if pusher, ok := res.(http.Pusher); ok {
		_ = pusher.Push("/static/css/site.css", nil)
		_ = pusher.Push("/static/img/bg.png", nil)
	}

	if tmpl, err = template.ParseFiles("template/index.html"); err == nil {
		m := newIndexModel(s.cfg)
		buf := bytes.NewBuffer([]byte{})
		if err = tmpl.Execute(buf, m); err == nil {
			_, _ = buf.WriteTo(res)
		}
	}
	if err != nil {
		log.Error(err)
		res.WriteHeader(500)
	}
}
