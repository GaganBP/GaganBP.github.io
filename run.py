from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import mimetypes

class OptimizedRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        # Performance headers
        self.send_header('Cache-Control', 'public, max-age=31536000' if self.is_static_resource() else 'public, max-age=3600')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')

        # Compression hint
        if self.path.endswith(('.css', '.js', '.html')):
            self.send_header('Content-Encoding', 'identity')

        super().end_headers()

    def is_static_resource(self):
        return self.path.endswith(('.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.woff', '.woff2'))

    def guess_type(self, path):
        """Enhanced MIME type detection"""
        base, ext = os.path.splitext(path)
        if ext in ('.webp',):
            return 'image/webp'
        return super().guess_type(path)

def run_server():
    port = int(os.environ.get("PORT", 3000))
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, OptimizedRequestHandler)
    print(f"Portfolio server running on http://localhost:{port}")
    print("Serving professional data analyst portfolio...")
    print("Performance optimizations enabled")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
