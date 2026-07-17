import os
import re

directory = r'h:\ARGPK'

def fix_head(html):
    # We currently have:
    # <script src="js/main.js"></script>
    # <script src="https://cdn.tailwindcss.com"></script>
    
    # We want to swap them:
    
    old_str = '<script src="js/main.js"></script>\n    <script src="https://cdn.tailwindcss.com"></script>'
    new_str = '<script src="https://cdn.tailwindcss.com"></script>\n    <script src="js/main.js"></script>'
    
    if old_str in html:
        return html.replace(old_str, new_str)
    
    # Also catch other possible spacing:
    html = re.sub(r'<script src="js/main\.js"[^>]*></script>\s*<script src="https://cdn\.tailwindcss\.com"></script>', new_str, html)
    return html

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = fix_head(content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filename}")
