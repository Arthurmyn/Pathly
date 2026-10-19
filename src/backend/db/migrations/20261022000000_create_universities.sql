-- migrate:up
CREATE TABLE universities (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT NOT NULL CHECK (btrim(name) <> ''),
    country     TEXT NOT NULL CHECK (btrim(country) <> ''),
    website_url TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (name, country)
);

-- migrate:down
DROP TABLE universities;
