# Docker uses platform specific configs during build
# https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope
ARG BUILD_PLATFORM="linux/amd64"
ARG ORKES_VERSION="v1.1.12"
# ARG COMMIT_VERSION="004d605db5d851ad99ffe84bbad961a97517b061"
FROM --platform=${BUILD_PLATFORM} openjdk:17-ea-slim-buster AS builder

WORKDIR /app
RUN apt update \
    && apt --no-install-recommends install -y git curl \
    && apt clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN git clone \
    --depth 1 \
    --branch v1.1.12 \
    https://github.com/orkes-io/orkes-conductor-community.git conductor
# RUN cd conductor && git checkout ${COMMIT_VERSION} && cd ../

WORKDIR /app/conductor
RUN ./gradlew clean build -x test

WORKDIR /app/oathkeeper
RUN curl --proto "=https" --tlsv1.2 -sSf -L https://github.com/ory/oathkeeper/releases/download/v0.40.7/oathkeeper_0.40.7-linux_arm64.tar.gz > oathkeeper_0.40.7-linux_arm64.tar.gz
RUN tar -xvf oathkeeper_0.40.7-linux_arm64.tar.gz

# Docker uses platform specific configs during build
# https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope
ARG BUILD_PLATFORM="linux/amd64"
FROM --platform=${BUILD_PLATFORM} openjdk:17-ea-slim-buster AS runner
RUN groupadd nonroot && adduser appuser && usermod -aG nonroot appuser

RUN apt update \
    && apt upgrade -y \
    && apt --no-install-recommends install -y gettext \
    && apt clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN mkdir -p /app/config /app/logs /app/libs /app/info /etc/config/oathkeeper

# Startup script(s)
COPY startup.sh /app
COPY oathkeeper.yml /etc/config/oathkeeper
COPY oathkeeper-access-rules.yml.tmpl /etc/config/oathkeeper

COPY --from=builder /app/conductor/server/build/libs/orkes-conductor-server-boot.jar /app/libs/server.jar
COPY --from=builder /app/oathkeeper/oathkeeper /usr/local/bin/oathkeeper
RUN chmod +x /usr/local/bin/oathkeeper
RUN chown -R appuser:nonroot /etc/config/oathkeeper
RUN chown -R appuser:nonroot /app

EXPOSE 7071

USER appuser

CMD ["/app/startup.sh"]
ENTRYPOINT ["/bin/sh"]