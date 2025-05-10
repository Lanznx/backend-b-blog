# lazy-b

Keep Slack, Microsoft Teams, or other similar applications from showing you as "away" or "inactive" by simulating key presses at regular intervals.

## Installation

Install directly from PyPI using pip or uv:

```bash
# Using pip
pip install lazy-b

# Using uv
uv pip install lazy-b

# For macOS users (to enable dock icon hiding)
pip install "lazy-b[macos]"
# or with uv
uv pip install "lazy-b[macos]"
```

## Usage

### Command Line

Run `lazy-b` from the command line:

```bash
# Basic usage (will press Shift key every 1 second)
# Runs in background mode by default (no dock icon)
lazy-b

# Customize the interval (e.g., every 30 seconds)
lazy-b --interval 30

# Run in quiet mode (no console output)
lazy-b --quiet

# Run in foreground mode (shows dock icon)
lazy-b --foreground
```

By default, lazy-b runs in background mode with no dock icon (on macOS). You can close the terminal window after starting it, and it will continue to run.

To stop lazy-b, you can press Ctrl+C in the terminal window if it's still open, or find and kill the process:

```bash
# Find the process
ps aux | grep lazy-b

# Kill it using the PID
kill <PID>
```

### Python API

You can also use the Python API directly in your own scripts:

```python
from lazy_b import LazyB
import time

# Create an instance with a custom interval (in seconds)
lazy = LazyB(interval=45)

# Define a callback function to handle status messages (optional)
def status_callback(message):
    print(f"Status: {message}")

# Start the simulation
lazy.start(callback=status_callback)

try:
    # Keep your script running
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    # Stop on Ctrl+C
    lazy.stop()
```

## Features

- Prevents "away" or "inactive" status in messaging applications
- Customizable interval between key presses
- Simple command-line interface
- Runs in background with no dock icon by default
- Python API for integration into your own scripts
- Minimal resource usage

## Requirements

- Python 3.8 or higher
- PyAutoGUI
- PyObjC-Core (for macOS dock icon hiding, optional)

## License

MIT

## Disclaimer

This tool is meant for legitimate use cases like preventing timeouts during presentations or when you're actively reading but not typing. Please use responsibly and in accordance with your organization's policies.
