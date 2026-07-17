import os
import re

directory = r'h:\ARGPK'

def optimize_images(html):
    # Add loading="lazy" to <img> tags that don't have it, and aren't logos or hero images
    def repl_img(m):
        img_tag = m.group(0)
        
        # Don't lazy load logos
        if 'logo' in img_tag.lower():
            return img_tag
            
        # Don't lazy load if it already has loading="lazy"
        if 'loading="lazy"' in img_tag:
            return img_tag
            
        # Add loading="lazy" before the closing bracket
        return img_tag.replace('>', ' loading="lazy">')

    html = re.sub(r'<img\s+[^>]+>', repl_img, html)
    return html

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = optimize_images(content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Optimized images in {filename}")
