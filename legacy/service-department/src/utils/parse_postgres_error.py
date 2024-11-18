import re


def parse_error_message(error_message: str):
    # Regular expressions for extracting field name and error type
    unique_constraint_re = re.compile(
        r'duplicate key value violates unique constraint "(?P<table>\w+?)_(?P<field>\w+?)_key"'
    )
    not_null_constraint_re = re.compile(r'null value in column "(?P<column>.+)" violates not-null constraint')

    # Check for unique constraint violation
    match = unique_constraint_re.search(error_message)
    if match:
        field_name = match.group("field")  # Assuming constraint name starts with field name
        return field_name, "unique constraint violation"

    # Check for not-null constraint violation
    match = not_null_constraint_re.search(error_message)
    if match:
        field_name = match.group("column")
        return field_name, "not-null constraint violation"

    # Default case if no known error pattern is matched
    return None, "unknown error"
