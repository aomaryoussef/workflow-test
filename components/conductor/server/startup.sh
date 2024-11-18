#!/bin/sh

envsubst '$CONDUCTOR_API_DNS_ROOT' < /etc/config/oathkeeper/oathkeeper-access-rules.yml.tmpl > /etc/config/oathkeeper/oathkeeper-access-rules.yml

echo "Starting Oathkeeper"
/usr/local/bin/oathkeeper serve --config /etc/config/oathkeeper/oathkeeper.yml 2>&1 &

echo "Starting Conductor Server"
export LOG_FILE=/app/logs/server.log
java -Xms512M -Xmx750M -jar /app/libs/server.jar