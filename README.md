# Hotswap by DOGS

A VS Code extension for jumping between projects in the same parent folder. Type a project's name, press Enter, and you're there.

Case, spaces and punctuation are ignored, so `Money 24` finds `money24` and `We Are Dogs` finds `wearedogs`.

## Requirements

- VS Code 1.90 or newer
- Node.js, only if you build from source

## Installation

### From the included package

1. Clone this repo:

       git clone https://github.com/YEAHDOGS/Hotswap-by-DOGS.git
       cd Hotswap-by-DOGS

2. Install the package:

       code --install-extension hotswap-0.2.1.vsix

3. Reload any open VS Code windows: press `Ctrl+Shift+P` and run **Developer: Reload Window**.

### Without the terminal

1. Download `hotswap-0.2.1.vsix` from this repo.
2. In VS Code, open the Extensions view with `Ctrl+Shift+X`.
3. Click the `...` menu at the top of the view and choose **Install from VSIX...**.
4. Select the file, then reload any open windows.

### From source

    git clone https://github.com/YEAHDOGS/Hotswap-by-DOGS.git
    cd Hotswap-by-DOGS
    npm test
    npm run package
    code --install-extension hotswap-0.2.1.vsix

The filename follows the `version` in `package.json`. To update, pull the latest changes and repeat the install step with `--force` added.

### Uninstall

    code --uninstall-extension brando.hotswap

## Usage

Open the project picker in any of these ways:

- Click the swap icon on the Explorer header row, next to New File. It appears when you hover over or focus the Explorer.
- Click the project name in the status bar.
- Press `Ctrl+Alt+P`.

Then type a name and press Enter.

## Settings

Open Settings with `Ctrl+,` and search for `hotswap`, or add these to `settings.json`:

| Setting | Values | Default |
| --- | --- | --- |
| `hotswap.windowMode` | `new` keeps one window per project, so running terminals keep running. `same` replaces the current window and stops its terminals. | `new` |
| `hotswap.projectsRoot` | Folder containing your projects. Leave empty to use the parent of the current folder. | empty |

In `new` mode, Hotswap jumps to a project's window if it's already open. It never closes windows, and closing a window stops anything running in its terminals.
