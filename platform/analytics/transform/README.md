# Data Build Pipeline for Analytics

This repository provides scripts that allows to configure analytical views on
mylo Reporting Database "READ" replica.

All visualisation tools MUST use the views created by this repo to showcase
business success metrics.

## What this contains

1. `./sql` folder contains all the Materialised Views on PG
2. `./cron.sql` contains the script to schedule a CRON job on PG which refreshes
the materialised views every X hours. (Currently its configured to 3)

## How to deploy changes

The current version is manual where the views and cron is created by DevOps team.
Once the CRON is there, data refresh is automated.

If you decide to change the views, please follow the process:

1. Create a PR and mark DevOps team as reviewer
2. Once the PR is merged, work together with the DevOps team to deploy the changes

> Why is this manual ?
>
> Just because there is not a huge set of various views for now, and manual just works.
> Later there will be proper Data Build Tooling and Pipeline, e.g. dbt

## Adding new views

Once you add a new view in `./sql/`, ensure to add a specific CRON job in `cron.sql` 