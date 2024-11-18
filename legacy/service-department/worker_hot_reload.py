import signal
import subprocess
from watchdog.observers.polling import PollingObserver as Observer
from watchdog.events import FileSystemEventHandler


class ReloadHandler(FileSystemEventHandler):
    def __init__(self, process):
        self.process = process

    def on_modified(self, event):
        if event.src_path.endswith(".py"):
            print(f"{event.src_path} changed, reloading...")
            self.process.send_signal(signal.SIGINT)
            self.process.wait()
            self.process = subprocess.Popen(["python", "worker.py"])


if __name__ == "__main__":
    process = subprocess.Popen(["python", "worker.py"])
    event_handler = ReloadHandler(process)
    observer = Observer()
    observer.schedule(event_handler, path=".", recursive=True)
    observer.start()
    try:
        while True:
            pass
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
