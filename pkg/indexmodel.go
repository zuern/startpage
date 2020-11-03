package pkg

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"

	"github.com/shawntoffel/darksky"
	log "github.com/sirupsen/logrus"
)

const xkcd = "https://xkcd.com/info.0.json"

// Data model for startpage.
type IndexModel struct {
	NavLinks  []NavLink
	XKCD      map[string]interface{}
	Forecasts map[string]*darksky.ForecastResponse
}

func newIndexModel(cfg *Config) (m *IndexModel) {
	m = &IndexModel{
		NavLinks:  cfg.Nav,
		Forecasts: map[string]*darksky.ForecastResponse{},
	}
	errChan := make(chan error)
	numJobs := 1
	go m.getXKCD(errChan)
	lock := &sync.Mutex{}
	for _, loc := range cfg.Locations {
		go m.getForecast(cfg.DarkskyAPIKey, loc, lock, errChan)
		numJobs++
	}
	for i := 0; i < numJobs; i++ {
		if err := <-errChan; err != nil {
			log.Errorln(err)
		}
	}
	return
}

func (m *IndexModel) getXKCD(errChan chan error) {
	log.Debugln("getting newest xkcd")
	resp, err := http.Get(xkcd)
	if err != nil {
		errChan <- err
		return
	}
	if resp.StatusCode != 200 {
		errChan <- fmt.Errorf("xkcd status code %d", resp.StatusCode)
		return
	}
	defer func() { _ = resp.Body.Close() }()
	var bytes []byte
	if bytes, err = ioutil.ReadAll(resp.Body); err == nil {
		err = json.Unmarshal(bytes, &m.XKCD)
	}
	errChan <- err
}

func (m *IndexModel) getForecast(apikey string, loc Location, lock *sync.Mutex, errChan chan error) {
	log.WithField("location", loc.Label).Debugf("getting forecast")
	client := darksky.New(apikey)
	f, err := client.Forecast(darksky.ForecastRequest{
		Latitude:  darksky.Measurement(loc.Lat),
		Longitude: darksky.Measurement(loc.Long),
		Options:   darksky.ForecastRequestOptions{Exclude: "hourly,minutely", Units: "ca"},
	})
	if err == nil {
		lock.Lock()
		m.Forecasts[loc.Label] = &f
		lock.Unlock()
	}
	errChan <- err
}
