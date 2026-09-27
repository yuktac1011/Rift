package main

import (
	"fmt"
	"log"
	"net/http"
)

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, `{"status": "ok"}`)
}

func ingestHandler(w http.ResponseWriter, r *http.Request) {
	// Sidecar proxy logic: intercept agent egress, optionally validate, then forward to Kafka
	log.Println("Received agent event via sidecar proxy")
	w.WriteHeader(http.StatusAccepted)
	fmt.Fprint(w, `{"status": "accepted"}`)
}

func main() {
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/ingest", ingestHandler)

	port := ":8081"
	log.Printf("Starting Rift Sidecar on port %s", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
