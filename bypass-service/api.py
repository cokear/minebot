# api.py
# Cloudflare Bypass Service API

import os
from flask import Flask, request, jsonify
from bypass import bypass_cloudflare, setup_display

app = Flask(__name__)

# Global display (for Linux)
display = None



from simple_bypass import bypass_cloudflare as bypass_seleniumbase_impl

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
            # Use simple_bypass implementation which is self-contained
            result = bypass_seleniumbase_impl(
                url=url,
                proxy=proxy,
                timeout=timeout,
                save_cookies=False,
                wait_time=8.0 # Give it a bit more time
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


@app.route('/renew', methods=['POST'])
def renew():
    data = request.json
    url = data.get('url')
    username = data.get('username')
    password = data.get('password')
    proxy = data.get('proxy')
    selectors = data.get('selectors', {})
    
    if not url or not username or not password:
        return jsonify({"success": False, "error": "Missing url, username or password"}), 400
        
    print(f"[*] 收到续期请求: {url} ({username})")
    
    # 导入 RenewalHandler (延迟导入避免循环依赖)
    from renewal import RenewalHandler
    
    handler = RenewalHandler()
    result = handler.run_renewal(url, username, password, proxy, selectors)
    
    return jsonify(result)

if __name__ == '__main__':
    # Initialize display on startup
    display = setup_display()
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
