import argparse
import signal
import sys
import time
import platform
from typing import NoReturn, List, Optional

from .main import LazyB


def parse_args(args: Optional[List[str]] = None) -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Keep Slack/Teams active by simulating shift key presses at regular intervals."
    )

    parser.add_argument(
        "-i",
        "--interval",
        type=int,
        default=1,
        help="Interval between key presses in seconds (default: 1)",
    )

    parser.add_argument(
        "-q", "--quiet", action="store_true", help="Run in quiet mode (no output)"
    )

    if platform.system() == "Darwin":
        parser.add_argument(
            "-f",
            "--foreground",
            action="store_true",
            help="Run in foreground mode (by default, runs in background with no dock icon)",
        )

    return parser.parse_args(args)


def hide_dock_icon():
    """Hide the dock icon on macOS."""
    if platform.system() != "Darwin":
        return

    try:
        from AppKit import NSApplication

        app = NSApplication.sharedApplication()
        # NSApplicationActivationPolicyAccessory = 1
        # This prevents the app from showing in the dock
        app.setActivationPolicy_(1)
    except ImportError:
        pass


def main(args: Optional[List[str]] = None) -> NoReturn:
    """Main entry point for the CLI."""
    parsed_args = parse_args(args)

    os_name = platform.system()
    is_macos = os_name == "Darwin"

    if is_macos and hasattr(parsed_args, "foreground") and not parsed_args.foreground:
        hide_dock_icon()

    lazy_b = LazyB(interval=parsed_args.interval)

    def signal_handler(sig, frame) -> None:
        """Handle Ctrl+C to gracefully shut down."""
        if not parsed_args.quiet:
            print("\nShutting down LazyB...")
        lazy_b.stop()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    def print_status(message: str) -> None:
        """Print status messages if not in quiet mode."""
        if not parsed_args.quiet:
            print(message)

    lazy_b.start(callback=print_status)

    print_status(f"LazyB is keeping you active (press Ctrl+C to stop)")
    print_status(f"Pressing Shift key every {parsed_args.interval} seconds")

    if is_macos and hasattr(parsed_args, "foreground") and not parsed_args.foreground:
        print("Running in background mode. You can close this terminal window.")
    else:
        print(
            f"Running on {os_name}. Keep this window open for the program to continue running."
        )

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        signal_handler(signal.SIGINT, None)

    return sys.exit(0)


if __name__ == "__main__":
    main()
