def continue_yes_no(msg: str):
    while input(f"\n{msg}? [y/n]  ") == "n":
        print("\nYou selected not to continue, exiting ...")
        exit(0)
