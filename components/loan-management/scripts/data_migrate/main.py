import sys

from financial_product.migrate import run as migrate_financial_products
from loans.migrate import run as migrate_loans

if __name__ == "__main__":
    args = sys.argv
    if len(args) < 2:
        args.append("help")

    if args[1] == "fp":
        migrate_financial_products()
    elif args[1] == "loans":
        migrate_loans()
    elif args[1] == "help":
        print("Usage: python main.py fp|loans")
    else:
        print("Invalid argument")
        sys.exit(1)
