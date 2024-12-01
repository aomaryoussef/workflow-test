import re

# Define the regex pattern for a valid cron expression
cron_pattern = r'^((\*|([0-5]?[0-9]))\s+(\*|([01]?[0-9]|2[0-3]))\s+(\*|([12]?[0-9]|3[01]))\s+(\*|([1-9]|1[0-2]))\s+(\*|([0-6](?:,[0-6])*(?:,[0-6])*)|([0-6]))\s*)$'

def validate_cron_expression(cron_expression):
    """
    Validates the provided cron expression.

    Args:
    cron_expression (str): The cron expression to validate.

    Returns:
    bool: True if the cron expression is valid, otherwise False.
    """
    # Check if the cron expression matches the defined pattern
    if re.match(cron_pattern, cron_expression.strip()):
        return True
    return False

if __name__ == '__main__':
    cron_expression = input("Enter a cron expression to validate: ").strip()

    if validate_cron_expression(cron_expression):
        print(f"The cron expression '{cron_expression}' is valid.")
    else:
        print(f"The cron expression '{cron_expression}' is invalid.")
