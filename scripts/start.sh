#!/bin/bash
# Start different instances of the server.
# Usage: ./start.sh [server]
#
# Example:
# ./start.sh 2

if [ "$1" = "2" ]; then
  HTTP_PORT=3001 P2P_PORT=5001 PEERS=ws://localhost:5000 yarn start:dev
elif [ "$1" = "3" ]; then
  HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5000,ws://localhost:5001 yarn start:dev
else
  HTTP_PORT=3000 P2P_PORT=5000 yarn start:dev
fi
