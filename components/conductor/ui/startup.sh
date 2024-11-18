#!/usr/bin/env sh
set -eu

envsubst '$CONDUCTOR_UI_DNS_ROOT' < /etc/config/oathkeeper/oathkeeper-access-rules.yml.tmpl > /etc/config/oathkeeper/oathkeeper-access-rules.yml

echo "Starting Oathkeeper"
/usr/local/bin/oathkeeper serve --config /etc/config/oathkeeper/oathkeeper.yml 2>&1 &

echo "Starting Nginx"
nginx -g 'daemon off;'