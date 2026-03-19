import sys
import os
import json
import glob

agent_configs = {
    "1": {
        "name": "Fundamentals & Layout",
        "dirs": ["simple-runtime-ui", "relative-and-absolute-position", "wrap-content-inside-scrollview", "simple-ui-toolkit-workflow"],
        "out": "01_fundamentals_layout.md"
    },
    "2": {
        "name": "Data Binding",
        "dirs": ["bind-with-binding-path", "bind-without-binding-path", "bind-with-uxml-csharp", "get-started-runtime-binding", "runtime-data-binding-multiple-properties", "bind-custom-data-type", "bind-nested-properties"],
        "out": "02_data_binding.md"
    },
    "3": {
        "name": "Lists & Collections",
        "dirs": ["create-listview-runtime-ui", "create-listviews-treeviews", "runtime-binding-listview", "bind-to-list", "bind-to-list-without-listview", "ListViewExample"],
        "out": "03_lists_collections.md"
    },
    "4": {
        "name": "Custom Controls",
        "dirs": ["create-bindable-custom-control", "create-custom-control-with-custom-attributes", "create-custom-style-custom-control", "slide-toggle", "pie-chart", "radial-progress", "radial-progress-vector-api"],
        "out": "04_custom_controls.md"
    },
    "5": {
        "name": "Navigation & Interaction",
        "dirs": ["create-a-tabbed-menu-for-runtime", "move-elements-at-runtime", "create-a-popup-window", "create-a-drag-and-drop-window-inside-a-custom-editor-window", "drag-and-drop-across-window"],
        "out": "05_navigation_interaction.md"
    },
    "6": {
        "name": "Styling & Animation",
        "dirs": ["create-a-transition", "transition-events-example", "loop-transition-example", "text-animation-example", "link-tag-example", "create-a-custom-swirl-filter"],
        "out": "06_styling_animation.md"
    }
}

agent_id = sys.argv[1]
base_path = "Portfolio_Unity/Assets/UIToolkit-Manual-Examples"
out_dir = "Portfolio_Unity/UIToolkit-Study-Outputs"

if agent_id == "7":
    # Special handling for agent 7 - ALL USS files
    print("Collecting all USS files for Agent 7...")
    all_uss_files = glob.glob(os.path.join(base_path, "**/*.uss"), recursive=True)
    content = ""
    for f in all_uss_files:
        with open(f, 'r') as file:
            content += f"--- {os.path.basename(f)} ---\n{file.read()}\n\n"
    out_path = os.path.join(out_dir, "07_design_system_raw.txt")
    with open(out_path, 'w') as file:
        file.write(content)
    print(f"Wrote all USS content to {out_path}")
    sys.exit(0)

config = agent_configs.get(agent_id)
if not config:
    print("Invalid agent id")
    sys.exit(1)

out_path = os.path.join(out_dir, config["out"].replace(".md", "_raw.txt"))
content = f"Raw files for {config['name']}\n\n"

for d in config["dirs"]:
    d_path = os.path.join(base_path, d)
    if not os.path.exists(d_path):
        print(f"Warning: Directory {d_path} does not exist")
        continue
    for root, dirs, files in os.walk(d_path):
        for file in files:
            if file.endswith(".meta"):
                continue
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content += f"--- {os.path.relpath(file_path, base_path)} ---\n{f.read()}\n\n"

with open(out_path, 'w') as f:
    f.write(content)
print(f"Wrote {config['name']} raw content to {out_path}")
