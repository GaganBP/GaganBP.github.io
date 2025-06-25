#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Set performance headers
        if self.path.endswith(('.css', '.js')):
            self.send_header('Cache-Control', 'public, max-age=31536000')  # 1 year for static assets
        elif self.path.endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif')):
            self.send_header('Cache-Control', 'public, max-age=31536000')  # 1 year for images
        else:
            self.send_header('Cache-Control', 'public, max-age=3600')  # 1 hour for HTML
        
        # Performance headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
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
