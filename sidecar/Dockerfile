FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod ./
# COPY go.sum ./
# RUN go mod download

COPY . .
RUN go build -o rift-sidecar main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/rift-sidecar .

EXPOSE 8081
CMD ["./rift-sidecar"]
