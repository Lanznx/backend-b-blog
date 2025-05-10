#!/usr/bin/env python3
"""
A simple script version of lazy-b that can be run directly.
This script won't show a Python icon in the dock when run.

Usage:
    python direct_script.py
"""

import pyautogui
import time
import argparse


def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(
        description="Keep Slack/Teams active by simulating key presses. Simple version with no dock icon."
    )
    parser.add_argument(
        "-i",
        "--interval",
        type=int,
        default=60,
        help="Interval between key presses in seconds (default: 60)",
    )
    parser.add_argument(
        "-k", "--key", type=str, default="shift", help="Key to press (default: shift)"
    )
    parser.add_argument(
        "-q", "--quiet", action="store_true", help="Run in quiet mode (no output)"
    )

    args = parser.parse_args()

    # Disable the fail-safe feature (prevents script failure when mouse is in top-left corner)
    pyautogui.FAILSAFE = False

    # Number of presses each time
    presses = 1

    try:
        # Infinite loop
        while True:
            # Press the specified key
            pyautogui.press(keys=args.key, presses=presses)

            # Print status if not in quiet mode
            if not args.quiet:
                print(f"{args.key.title()} was pressed at {time.strftime('%H:%M:%S')}")

            # Wait for the specified interval
            time.sleep(args.interval)
    except KeyboardInterrupt:
        # Handle Ctrl+C gracefully
        if not args.quiet:
            print("\nShutting down...")


if __name__ == "__main__":
    main()
