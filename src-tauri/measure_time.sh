#!/bin/bash

LOGFILE="/Users/eddie/Desktop/cortexcode/startup-time-rust.log"

{
  echo "Starting Rust signaling server"

  # Start the Rust server and measure its time
  /usr/bin/time -v bash -c 'cd /Users/eddie/Desktop/cortexcode/rs-signalling && cargo run' &
  RUST_PID=$!
  
  # Wait for the Rust server to start
  sleep 5

  # Start the Tauri app and measure its time
  /usr/bin/time -v bash -c 'cd /Users/eddie/Desktop/cortexcode/src/frontend && npm run start' &
  TAURI_PID=$!
  
  # Wait for the Tauri app to be fully running
  sleep 10

  wait $RUST_PID
  wait $TAURI_PID

  echo "Tauri app is fully running"
} 2>> $LOGFILE
