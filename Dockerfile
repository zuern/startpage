# Run make docker-build to create an image

FROM alpine
MAINTAINER Kevin Zuern

COPY bin /app

ENV STARTPAGE_PORT "80"
EXPOSE 80

WORKDIR /app
ENTRYPOINT ["/app/startpage"]
