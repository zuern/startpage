APP_NAME=$(shell basename `pwd`)
VERSION=$(shell git describe --tags --always --dirty)

TARGET_LINT_VERSION=1.22.2
LINTER=$(GOPATH)/bin/golangci-lint

_dummy := $(shell mkdir -p bin)

all: bin/$(APP_NAME) bin/config.yml bin/template bin/static

bin/$(APP_NAME): *.go
	@CGO_ENABLED=0 GOOS=linux go build -installsuffix cgo -o bin ./...

bin/static: static
	@cp -r static bin/static

bin/template: template
	@cp -r template bin/template

bin/config.yml: config.yml
	@cp config.yml bin/config.yml

###
# Phony targets
###

lint: $(LINTER) *.go
ifneq '$(TARGET_LINT_VERSION)' '$(shell golangci-lint --version | cut -d " " -f 4 -)'
	@echo Getting golangci-lint v$(TARGET_LINT_VERSION)
	@curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(GOPATH)/bin v$(TARGET_LINT_VERSION)
	@golangci-lint run ./...
else
	@golangci-lint run ./...
endif

clean:
	@rm -r bin

dev:
	@find . -name "*.go" | entr -s 'clear && make'

run:
	@find . -name "*.go" | entr -s 'clear && go run main.go -level debug'

docker-build: lint all
	@docker build --tag $(APP_NAME):$(VERSION) .
