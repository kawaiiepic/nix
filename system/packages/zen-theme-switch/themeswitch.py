#!/usr/bin/env python3

from asyncio import SendfileNotAvailableError
import sys, struct, json, socket, threading

def read_message():
    # First 4 bytes = message length
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        return None
    message_length = struct.unpack("<I", raw_length)[0]
    # Read the message data
    message = sys.stdin.buffer.read(message_length).decode("utf-8")
    return json.loads(message)

def send_message(msg):
    encoded = json.dumps(msg).encode("utf-8")
    sys.stdout.buffer.write(struct.pack("<I", len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.flush()

def handle_client(client):
    try:
        data = client.recv(1024)  # keep CLI messages very small
        if not data:
            return
        msg = json.loads(data.decode())
        send_message(msg)
        client.send(json.dumps({"status": "ok"}).encode())
    except Exception as e:
        send_message({"status": "error", "msg": str(e)})
    finally:
        client.close()
        
def socket_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("127.0.0.1", 8765))
    server.listen(5)
    while True:
        client, _ = server.accept()
        threading.Thread(target=handle_client, args=(client,)).start()

threading.Thread(target=socket_server, daemon=True).start()

if __name__ == "__main__":
    while True:
        msg = read_message()
        if msg is None:
            break
        # Echo it back
        send_message({"command": "theme"})