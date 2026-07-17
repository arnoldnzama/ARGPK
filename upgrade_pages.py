import os
import re

directory = r'h:\ARGPK'

def enhance_content(html):
    # Make Hero sections premium
    # Find all <section class="hero-...
    def repl_hero(m):
        cls = m.group(1)
        inner = m.group(2)
        # add premium classes to hero
        new_cls = cls.replace('pt-24', 'pt-32').replace('min-h-[500px]', 'min-h-[60vh]').replace('flex items-center', 'flex items-center relative overflow-hidden bg-primary/90 bg-blend-overlay')
        
        # We can add an overlay div
        return f'<section class="{new_cls}"><div class="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-0"></div><div class="absolute inset-0 bg-[url(\'assets/images/pattern.svg\')] opacity-10 mix-blend-overlay"></div><div class="relative z-10 w-full">{inner}</div></section>'

    html = re.sub(r'<section class="(hero-[^"]+)">(.*?)</section>', repl_hero, html, flags=re.DOTALL)
    
    # Enhance general sections (padding and background)
    html = re.sub(r'<section class="py-16 bg-white">', r'<section class="py-24 bg-white relative">', html)
    html = re.sub(r'<section class="py-16 bg-gray-50">', r'<section class="py-24 bg-neutral-50 relative">', html)
    html = re.sub(r'<section class="py-16 bg-light">', r'<section class="py-24 bg-neutral-50 relative">', html)
    
    # Enhance standard containers
    html = html.replace('container mx-auto px-4', 'container mx-auto px-6')
    
    # Enhance headings
    html = html.replace('font-playfair', 'font-serif')
    html = html.replace('text-gray-700', 'text-neutral-700 leading-relaxed')
    html = html.replace('text-gray-600', 'text-neutral-600 leading-relaxed')
    
    # Enhance cards
    html = html.replace('rounded-lg shadow-md hover:shadow-lg', 'rounded-2xl shadow-sm border border-neutral-100 hover:shadow-premium hover:-translate-y-2')
    html = html.replace('rounded-lg shadow-xl', 'rounded-2xl shadow-premium')
    html = html.replace('bg-white p-8', 'bg-white p-10')
    html = html.replace('bg-white p-6', 'bg-white p-8')
    
    # Buttons
    html = html.replace('rounded-button', 'rounded-xl shadow-sm hover:shadow-md')
    
    return html

for filename in os.listdir(directory):
    if filename.endswith('.html') and filename != 'index.html':
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = enhance_content(content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Enhanced {filename}")
