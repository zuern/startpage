package pkg

import "fmt"

// Config for the application
type Config struct {
	Nav           []NavLink  `yaml:"nav" json:"nav"`
	DarkskyAPIKey string     `yaml:"darkskyKey" json:"darkskyKey"`
	Locations     []Location `yaml:"locations" json:"locations"`
}

// Location on Earth.
type Location struct {
	Label string  `yaml:"label" json:"label"`
	Lat   float64 `yaml:"lat" json:"lat"`
	Long  float64 `yaml:"long" json:"long"`
}

// NavLink is a navigation link
type NavLink struct {
	Label string `yaml:"label" json:"label"`
	Class string `yaml:"class" json:"class"`
	URL   string `yaml:"url" json:"url"`
}

// Check the configuration
func (c *Config) Check() error {
	var errMsg, m string
	errMsg = "invalid config: %s"
	switch {
	case len(c.Nav) == 0:
		m = "nav has no links"
	case c.DarkskyAPIKey == "" && len(c.Locations) > 0:
		m = "darkskyKey not set"
	}
	if m != "" {
		return fmt.Errorf(errMsg, m)
	}
	for i, n := range c.Nav {
		switch {
		case n.Class == "":
			m = "class"
		case n.Label == "":
			m = "label"
		case n.URL == "":
			m = "url"
		}
		if m != "" {
			m = fmt.Sprintf("nav[%d]: %s not set", i, m)
			return fmt.Errorf(errMsg, m)
		}
	}
	for i, n := range c.Locations {
		switch {
		case n.Lat == 0:
			m = "lat"
		case n.Long == 0:
			m = "long"
		case n.Label == "":
			m = "label"
		}
		if m != "" {
			m = fmt.Sprintf("locations[%d]: %s not set", i, m)
			return fmt.Errorf(errMsg, m)
		}
	}
	return nil
}
