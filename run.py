#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    PORT = int(os.environ.get('PORT', 3000))

    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    with socketserver.TCPServer(("0.0.0.0", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"Portfolio server running on http://localhost:{PORT}")
        print("Serving professional data analyst portfolio...")
        httpd.serve_forever()
