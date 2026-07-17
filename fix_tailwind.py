import os
import re

directory = r'h:\ARGPK'

def fix_head(html):
    # Move js/main.js before tailwind cdn and remove defer
    # Or just extract the tailwind config into an inline script before the CDN.
    # The simplest is to replace the script tags.
    
    # We want:
    # <script src="js/main.js"></script>
    # <script src="https://cdn.tailwindcss.com"></script>
    
    # Remove existing js/main.js
    html = re.sub(r'<script src="js/main.js"[^>]*></script>', '', html)
    
    # Insert js/main.js right before tailwindcdn
    html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', 
                        '<script src="js/main.js"></script>\n    <script src="https://cdn.tailwindcss.com"></script>')
                        
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
