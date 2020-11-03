Startpage
-----------
> Everyone needs a homepage

A basic dark-themed homepage that has a customizable nav, weather forecasts, and
displays the latest XCKD comic..

## USAGE
`startpage [-p <port>] [-level <loglevel>] [config_file]`

Startpage has sensible defaults. If a config file is not provided it looks in
the current directory by default. See `config-sample.yml` for a sample
configuration.

## ENVIRONMENT
Startpage can be fully configured via environment variables:
- `STARTPAGE_PORT`: Port to serve on.
- `STARTPAGE_LEVEL`: Log level.
- `STARTPAGE_CONFIG`: Path to config file.

## Building/Running
Everything is done via make:
- `make` Compile everything and put it in `bin`
- `make lint` Lint the code
- `make dev` Watch for changes to source code and auto-compile
- `make run` Watch for changes to source code and re-start the app.
- `make docker-build` package the app as a docker image

## Attributions:
- Weather forecasts are [powered by Darksky](https://darksky.net/poweredby/).
- Icons for weather from [@adamwhitcroft](http://adamwhitcroft.com/climacons/)
