#!/usr/bin/env python3
"""
NovaSight Solutions - Simple HTTP Server
Author: Sadeek Khan
Version: 1.0

Run this script to start the development server.
No additional dependencies required.
"""

import http.server
import socketserver
import os
import sys
import socket
import webbrowser
from datetime import datetime

# Configuration
PORT = 8000

class NovaSightHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for NovaSight website"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Handle GET requests"""
        # Serve index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()
    
    def log_message(self, format, *args):
        """Custom log message with timestamp"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {args[0]} {args[1]} {args[2]}")

def get_local_ip():
    """Get local IP address for network access"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "localhost"

def main():
    """Start the server"""
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level to project root
    project_root = os.path.dirname(script_dir)
    
    # Change to project root directory
    try:
        os.chdir(project_root)
    except Exception as e:
        print(f"❌ Error: Cannot access project directory: {e}")
        sys.exit(1)
    
    # Check if index.html exists
    if not os.path.exists('index.html'):
        print(f"❌ Error: index.html not found in {project_root}")
        print("   Please make sure you're in the correct directory.")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("  🚀 NovaSight Solutions - Development Server")
    print("="*60)
    print(f"  📁 Serving from: {project_root}")
    print(f"  🌐 Local URL:    http://localhost:{PORT}")
    print(f"  📱 Network URL:  http://{get_local_ip()}:{PORT}")
    print(f"  🔧 Admin Panel:  http://localhost:{PORT}/admin/")
    print(f"  \n  Press Ctrl+C to stop the server")
    print("="*60 + "\n")
    
    # Open browser automatically
    try:
        webbrowser.open(f'http://localhost:{PORT}')
    except:
        pass
    
    try:
        handler = NovaSightHandler
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n  👋 Server stopped. Goodbye!\n")
        sys.exit(0)
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"  ❌ Error: Port {PORT} is already in use!")
            print(f"     Try: python -m http.server 8001")
            print(f"     Or:  python server.py 8001")
        else:
            print(f"  ❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Allow custom port from command line
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print(f"  ❌ Error: Invalid port number. Using default port {PORT}.")
    
    main()