#!/bin/bash

# Get the active window ID
ACTIVE_WINDOW_ID=$(xdotool getactivewindow)

# Get the PID (Process ID) associated with the active window
PID=$(xdotool getwindowpid "$ACTIVE_WINDOW_ID")

# Use lsof to find the current directory associated with the PID
DIR=$(lsof -p "$PID" | grep cwd | awk '{print $NF}')

# Check if DIR is a valid directory
if [ -d "$DIR" ]; then
    notify-send "$ACTIVE_WINDOW_ID"
else
    notify-send "$DIR"
fi
