# Docker uses platform specific configs during build
# https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope
ARG BUILD_PLATFORM="linux/amd64"
FROM --platform=${BUILD_PLATFORM} openjdk:17-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssh git
RUN git clone --depth 1 \
    --branch v1.1.12 \
    https://github.com/orkes-io/orkes-conductor-community.git \
    conductor

WORKDIR /app/conductor
RUN ./gradlew clean build -x test

# Docker uses platform specific configs during build
# https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope
ARG BUILD_PLATFORM="linux/amd64"
FROM --platform=${BUILD_PLATFORM} openjdk:17-alpine AS runner

RUN mkdir -p /app/config /app/logs /app/libs /app/info

# Startup script(s)
COPY startup.sh /app/startup.sh
COPY config.properties /app/config/config.properties

COPY --from=builder /app/conductor/server/build/libs/orkes-conductor-server-boot.jar /app/libs/server.jar

HEALTHCHECK --interval=60s --timeout=30s --retries=10 CMD curl -I -XGET http://localhost:8080/health || exit 1

EXPOSE 8080

CMD ["/app/startup.sh"]
ENTRYPOINT ["/bin/sh"]
