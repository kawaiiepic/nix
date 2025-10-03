#!/usr/bin/env python3
import sys, socket, json

mode = sys.argv[1] if len(sys.argv) > 1 else "dark"

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(("127.0.0.1", 8765))
s.send(json.dumps({"command": mode}).encode())
resp = s.recv(1024)
print("Response:", resp.decode())
s.close()
