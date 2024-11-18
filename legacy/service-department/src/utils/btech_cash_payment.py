import os
import csv

# Define a dictionary to store the branch_code and payment_code
cash_payment_codes = {}

# Adjust the CSV file path
file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets", "btech-store-cash-codes.csv")

# Open the CSV file
with open(file_path, "r") as file:
    # Create a CSV reader
    reader = csv.reader(file)

    # Iterate over the rows
    for row in reader:
        # Each row is a list of strings
        # The first string is the branch_code, the second string is the payment_code
        branch_code, payment_code = row

        # Add the branch_code and payment_code to the dictionary
        cash_payment_codes[branch_code.lower()] = payment_code
