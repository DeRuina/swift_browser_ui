"""Module containing launchers for the different services."""

import swift_browser_ui.ui.shell
import swift_browser_ui.sharing.server
import swift_browser_ui.request.server
import swift_browser_ui.upload.server


def run_ui():
    """Run the UI."""
    swift_browser_ui.ui.shell.main()


def run_sharing():
    """Run swift-x-account-sharing service."""
    swift_browser_ui.sharing.server.main()


def run_request():
    """Run swift-sharing-request service."""
    swift_browser_ui.request.server.main()


def run_upload():
    """Run swiftui-upload-runner service."""
    swift_browser_ui.upload.server.main()


if __name__ == "__main__":
    swift_browser_ui.ui.shell.main()
