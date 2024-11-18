CREATE TABLE event_log(
    id                  VARCHAR NOT NULL PRIMARY KEY,
    event_type          VARCHAR NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by          VARCHAR NOT NULL,
    aggregate_id        VARCHAR NOT NULL,
    aggregate_type      VARCHAR NOT NULL,
    aggregate_version   BIGINT NOT NULL,
    source_system_id    VARCHAR NOT NULL,
    source_trace_id     VARCHAR NOT NULL,
    payload             BYTEA NOT NULL
);

CREATE INDEX idx_event_log__aggregate_id ON event_log USING btree (aggregate_id);
CREATE INDEX idx_event_log__aggregate_type ON event_log USING btree (aggregate_type);
CREATE INDEX idx_event_log__event_type ON event_log USING btree (event_type);
CREATE INDEX idx_event_log__created_at ON event_log USING btree (created_at);