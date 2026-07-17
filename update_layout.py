import os
import re

def get_block(content, start_marker, end_marker):
    start = content.find(start_marker)
    if start == -1: return None
    end = content.find(end_marker, start)
    if end == -1: return None
    return content[start:end+len(end_marker)]

def main():
    directory = r'h:\ARGPK'
    
    # Read index.html to get the new blocks
    with open(os.path.join(directory, 'index.html'), 'r', encoding='utf-8') as f:
        index_content = f.read()
        
    new_header = get_block(index_content, '<!-- Header -->', '</header>')
    
    # The mobile menu block might end differently, let's use regex or a robust search
    start_mobile = index_content.find('<!-- Menu Mobile -->')
    end_mobile_div = index_content.find('</div>', index_content.find('mt-auto', start_mobile))
    end_mobile_div = index_content.find('</div>', end_mobile_div + 1)
    new_mobile = index_content[start_mobile:end_mobile_div+6]
    
    new_footer = get_block(index_content, '<!-- Footer -->', '</footer>')
    
    if not (new_header and new_footer):
        print("Error extracting blocks from index.html")
        return
        
    # Replace in all html files
    for filename in os.listdir(directory):
        if filename.endswith('.html') and filename != 'index.html':
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            old_header = get_block(content, '<!-- Header -->', '</header>')
            if old_header: content = content.replace(old_header, new_header)
            
            old_mobile_start = content.find('<!-- Menu Mobile -->')
            if old_mobile_start != -1:
                old_mobile_end = content.find('<!--', old_mobile_start + 20)
                if old_mobile_end == -1:
                    old_mobile_end = content.find('</body', old_mobile_start)
                else:
                    # if there is another comment, like <!-- Hero Section -->
                    pass
                # just a simple replace for now if we can grab it precisely, but wait, the mobile menu is usually followed by some other section.
                # let's just do it manually with a regex
                content = re.sub(r'<!-- Menu Mobile -->.*?</div>\s*</div>\s*</div>', new_mobile, content, flags=re.DOTALL)
                
            old_footer = get_block(content, '<!-- Footer -->', '</footer>')
            if old_footer: content = content.replace(old_footer, new_footer)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filename}")

if __name__ == '__main__':
    main()
