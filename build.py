import os
import re
import shutil
import subprocess
import webbrowser
import json
import sys

VERSION_FILE = 'version.json'
SRC_DIR = 'src'
DIST_DIR = 'docs' # Root folder as requested

def get_version():
    if not os.path.exists(VERSION_FILE):
        return {"major": 0, "minor": 1, "patch": 0}
    with open(VERSION_FILE, 'r') as f:
        return json.load(f)

def save_version(version):
    with open(VERSION_FILE, 'w') as f:
        json.dump(version, f, indent=4)

def minify_html(content):
    # Remove comments
    content = re.sub(r'<!--(.*?)-->', '', content, flags=re.DOTALL)
    # Remove whitespace between tags
    content = re.sub(r'>\s+<', '><', content)
    # Remove extra spaces
    content = re.sub(r'\s+', ' ', content)
    return content.strip()

def minify_css(content):
    # Remove comments
    content = re.sub(r'/\*(.*?)\*/', '', content, flags=re.DOTALL)
    # Remove whitespace
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r'\s*{\s*', '{', content)
    content = re.sub(r'\s*}\s*', '}', content)
    content = re.sub(r'\s*;\s*', ';', content)
    content = re.sub(r'\s*:\s*', ':', content)
    content = re.sub(r'\s*,\s*', ',', content)
    return content.strip()

def needs_rebuild():
    """Checks if any file in SRC_DIR is newer than its counterpart in DIST_DIR."""
    if not os.path.exists(SRC_DIR):
        return False
        
    for root, _, files in os.walk(SRC_DIR):
        for filename in files:
            src_path = os.path.join(root, filename)
            rel_path = os.path.relpath(src_path, SRC_DIR)
            dest_path = os.path.join(DIST_DIR, rel_path)
            
            # If destination doesn't exist or source is newer, we need to rebuild
            if not os.path.exists(dest_path):
                return True
            if os.path.getmtime(src_path) > os.path.getmtime(dest_path):
                return True
    return False

def build():
    if not needs_rebuild():
        print("✨ Build is already up to date. Skipping...")
        return True

    print("🚀 Building project...")
    
    # Process all files in src directory
    if not os.path.exists(SRC_DIR):
        print(f"❌ Error: {SRC_DIR} directory not found.")
        return

    for root, dirs, files in os.walk(SRC_DIR):
        for filename in files:
            src_path = os.path.join(root, filename)
            rel_path = os.path.relpath(src_path, SRC_DIR)
            dest_path = os.path.join(DIST_DIR, rel_path)
            
            # Create destination subdirectories if they don't exist
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)

            if filename.endswith(('.html', '.css')):
                with open(src_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if filename.endswith('.html'):
                    print(f"📦 Minifying HTML: {rel_path}")
                    processed_content = minify_html(content)
                else: # .css
                    print(f"🎨 Minifying CSS: {rel_path}")
                    processed_content = minify_css(content)
                    
                with open(dest_path, 'w', encoding='utf-8') as f:
                    f.write(processed_content)
            else:
                print(f"📄 Copying file: {rel_path}")
                shutil.copy2(src_path, dest_path)
                
            print(f"✅ Processed: {rel_path}")

    print("✨ Build complete! Project is ready in the root directory.")
    return True

def publish():
    version = get_version()
    print(f"Current version: {version['major']}.{version['minor']}.{version['patch']}")
    
    bump = input("Bump version? (major/minor/patch/none): ").lower()
    if bump in version:
        version[bump] += 1
        # Reset smaller units
        if bump == 'major':
            version['minor'] = 0
            version['patch'] = 0
        elif bump == 'minor':
            version['patch'] = 0
    
    new_version_str = f"{version['major']}.{version['minor']}.{version['patch']}"
    save_version(version)
    print(f"✅ Version updated to {new_version_str}")
    
    commit_msg = input("Enter commit message: ")
    if not commit_msg:
        commit_msg = f"Update version to {new_version_str}"
        
    try:
        subprocess.run(['git', 'add', '.'], check=True)
        subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
        subprocess.run(['git', 'push'], check=True)
        print("🚀 Published successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Git error: {e}")

def preview():
    print("🌐 Opening preview...")
    src_index = os.path.abspath('index.html')
    webbrowser.open(f"file://{src_index}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python build.py [build|publish|preview]")
        return

    command = sys.argv[1].lower()
    if command == 'build':
        build()
    elif command == 'publish':
        build() and publish()
    elif command == 'preview':
        build() and preview()
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()
