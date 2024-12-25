import os
import sys
import json
import re

args = sys.argv

if len(args) != 2:
    print("Usage: fix-world-main-scripts.py <ext dir>")
    sys.exit(1)

ext_dir = args[1]

with open(ext_dir + "/manifest.json", "r") as manifestFile:
    manifest = json.load(manifestFile)
    content_scripts = manifest.get("content_scripts")

    for i in range(len(content_scripts)):
        content_script = content_scripts[i]

        if content_script.get("world") == "MAIN":
            loader_file_path = ext_dir + "/" + content_script.get("js")[0]

            with open(loader_file_path, "r") as loader_file:
                loader = loader_file.read()

                content_script_path_regex = r'chrome\.runtime\.getURL\("([^"]+)"\)'
                match = re.search(content_script_path_regex, loader)
                if not match:
                    print("Could not find content script path in loader file")
                    sys.exit(1)

                content_script_path = match.group(1)
                manifest["content_scripts"][i]["js"][0] = content_script_path
                os.remove(loader_file_path)
    with open(ext_dir + "/manifest.json", "w") as manifestFile:
        json.dump(manifest, manifestFile, indent=2)
