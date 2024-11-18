import datetime
import time

INFO = "INFO"
WARNING = "WARN"
ERROR = "ERROR"

def info(msg: str):
    __print_msg(msg, INFO)

def error(msg: str):
    __print_msg(msg, ERROR)


def __print_msg(msg: str, level: str):
    time_now = datetime.datetime.now().isoformat(" ", "seconds")
    print(f"{time_now} - [{level}]\t{msg}")