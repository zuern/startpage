package main

import (
	"flag"
	"io/ioutil"
	"os"
	"strconv"

	log "github.com/sirupsen/logrus"

	"gitlab.com/zuern/startpage/pkg"
	yaml "gopkg.in/yaml.v2"
)

// Environment variables
const (
	PORT   = "STARTPAGE_PORT"
	LEVEL  = "STARTPAGE_LEVEL"
	CONFIG = "STARTPAGE_CONFIG"
)

// Defaults
var (
	port    = 3000
	level   = "error"
	cfgPath = "config.yml"
	config  pkg.Config
)

func init() {
	if p := os.Getenv(PORT); p != "" {
		var err error
		if port, err = strconv.Atoi(p); err != nil {
			log.Fatalf("invalid port: %s", p)
		}
	}
	if env := os.Getenv(LEVEL); env != "" {
		level = env
	}
	if env := os.Getenv(CONFIG); env != "" {
		cfgPath = env
	}

	p := flag.Int("p", port, "port")
	lvl := flag.String("level", level, "log level: debug, info, warn, error, fatal")
	flag.Parse()

	if cfg := flag.Arg(0); cfg != "" {
		cfgPath = cfg
	}

	port = *p

	level = *lvl
	setLevel(level)
	log.SetFormatter(&log.TextFormatter{FullTimestamp: true})

	var cfgBytes []byte
	var err error
	if cfgBytes, err = ioutil.ReadFile(cfgPath); err == nil {
		if err = yaml.Unmarshal(cfgBytes, &config); err == nil {
			err = config.Check()
		}
	}
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	s := pkg.NewServer(port, &config)
	if err := s.Start(); err != nil {
		log.Fatal(err)
	}
}

func setLevel(lvl string) {
	var l log.Level
	switch lvl {
	case "debug":
		l = log.DebugLevel
	case "info":
		l = log.InfoLevel
	case "warn":
		l = log.WarnLevel
	case "error":
		l = log.ErrorLevel
	case "fatal":
		l = log.FatalLevel
	default:
		log.Fatalln("unknown log level")
	}
	log.SetLevel(l)
}
