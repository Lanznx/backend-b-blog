import time
import threading
import pyautogui
from typing import Optional, Callable


class LazyB:
    """
    A class to prevent detection of inactivity in applications like Slack or Teams
    by simulating key presses at regular intervals.
    """

    def __init__(self, interval: int = 1):
        """
        Initialize the LazyB instance.

        Args:
            interval: Time in seconds between key presses. Default is 1 second.
        """
        self.interval = interval
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._callback: Optional[Callable[[str], None]] = None

        pyautogui.FAILSAFE = False

    def _press_shift(self) -> None:
        """Simulate pressing the shift key."""
        pyautogui.press("shift")

        if self._callback:
            self._callback(f"Pressed shift at {time.strftime('%H:%M:%S')}")

    def _run(self) -> None:
        """Main loop that presses shift at regular intervals."""
        while self._running:
            self._press_shift()
            time.sleep(self.interval)

    def start(self, callback: Optional[Callable[[str], None]] = None) -> None:
        """
        Start simulating key presses.

        Args:
            callback: Optional function to call after each key press with a status message.
        """
        if self._running:
            return

        self._running = True
        self._callback = callback

        if self._callback:
            self._callback("LazyB started")

        self._thread = threading.Thread(target=self._run)
        self._thread.daemon = True
        self._thread.start()

    def stop(self) -> None:
        """Stop simulating key presses."""
        self._running = False

        if self._thread:
            self._thread.join(1.0)
            self._thread = None

        if self._callback:
            self._callback("LazyB stopped")

    def is_running(self) -> bool:
        """Return whether key simulation is currently running."""
        return self._running
