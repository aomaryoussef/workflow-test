#!/bin/bash

# Define the cron expression pattern using Perl-compatible regular expressions
cron_pattern="^(\*|([0-5]?[0-9])) (\*|([01]?[0-9]|2[0-3])) (\*|([12]?[0-9]|3[01])) (\*|([1-9]|1[0-2])) (\*|([0-6](?:,[0-6])*(?:,[0-6])*)|([0-6]))$"

# Function to validate cron expression using grep with Perl-compatible regex
validate_cron_expression() {
    local cron_expression="$1"
    
    # Use grep with -P for Perl-compatible regex and -q to suppress output
    echo "$cron_expression" | grep -Pq "$cron_pattern"
    if [ $? -eq 0 ]; then
        echo "The cron expression '$cron_expression' is valid."
    else
        echo "The cron expression '$cron_expression' is invalid."
    fi
}

# Read user input
echo "Enter a cron expression to validate:"
read cron_expression

# Validate the cron expression
validate_cron_expression "$cron_expression"
