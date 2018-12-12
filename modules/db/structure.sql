CREATE DOMAIN uint16 AS INT
CHECK (
    VALUE >= 0 AND VALUE < 65536
);

CREATE TYPE mm_chip_code AS ENUM (
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z', '*'
);

CREATE TYPE mm_chip_type AS ENUM (
    'STANDARD', 'MEGA', 'GIGA'
);

CREATE TYPE mm_chip_rarity AS ENUM (
    '0', '1', '2', '3', '4', '5'
);

CREATE TABLE mm_elements (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(16) UNIQUE NOT NULL
);

CREATE TABLE mm_navi_styles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(16) UNIQUE NOT NULL
);

CREATE TABLE mm_chips (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(16) UNIQUE NOT NULL,
    damage      uint16 NOT NULL,
    memory      uint16 NOT NULL,
    description VARCHAR(32),
    filename    VARCHAR(256),
    rarity      mm_chip_rarity NOT NULL,
    element     INT REFERENCES mm_elements (id),
    chiptype    mm_chip_type NOT NULL
);

CREATE TABLE mm_players (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(32) UNIQUE NOT NULL,
    password    VARCHAR(256) NOT NULL,
    bugfrags    uint16 NOT NULL,
    hp          uint16 NOT NULL,
    zenny       uint16 NOT NULL,
    regmem      uint16 NOT NULL,
    style       INT REFERENCES mm_navi_styles (id),
    element     INT REFERENCES mm_elements (id)
);

CREATE TABLE mm_chip_code_links (
    id          SERIAL PRIMARY KEY,
    chip        INT REFERENCES mm_chips (id) NOT NULL,
    code        mm_chip_code NOT NULL
);

CREATE TABLE mm_player_chip_links (
    id          SERIAL PRIMARY KEY,
    player      INT REFERENCES mm_players (id) NOT NULL,
    chip        INT REFERENCES mm_chip_code_links (id) NOT NULL
);
