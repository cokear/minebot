# api.py
# Cloudflare Bypass Service API

import os
from flask import Flask, request, jsonify
from bypass import bypass_cloudflare, setup_display

app = Flask(__name__)

# Global display (for Linux)
display = None



from bypass_seleniumbase import bypass_and_get_cookies

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "cloudflare-bypass"})

@app.route('/bypass', methods=['POST'])
def bypass():
    data = request.json
    if not data or 'url' not in data:
        return jsonify({"success": False, "error": "Missing 'url' parameter"}), 400
    
    url = data.get('url')
    proxy = data.get('proxy') # Optional
    timeout = data.get('timeout', 60.0)
    mode = data.get('mode', 'default') # default, seleniumbase
    
    print(f"[API] Request bypass ({mode}) for: {url} (Proxy: {proxy})")
    
    try:
        # Select engine based on mode
        if mode == 'seleniumbase':
            # Use the class-based implementation
            result = bypass_and_get_cookies(
                url=url,
                proxy=proxy,
                session_name=f"api_{int(timeout)}",
                headless=True # Force headless for API
            )
        else:
            # Use the default implementation (function-based)
            result = bypass_cloudflare(
                url=url,
                proxy=proxy,
                timeout=timeout,
                save_cookies=False
            )
            
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    # Initialize display on startup
    display = setup_display()
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
