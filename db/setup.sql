CREATE TABLE prj2_chip_element (
      id            SERIAL PRIMARY KEY
    , name          VARCHAR(8)
);

CREATE TABLE prj2_chip (
      id            SERIAL PRIMARY KEY
    , name          VARCHAR(8) UNIQUE NOT NULL
    , description   VARCHAR(32) NOT NULL
    , damage        INT NOT NULL
    , element       INT REFERENCES prj2_chip_element (id) NOT NULL
    , memory        INT NOT NULL
    , imageUrl      VARCHAR(256)
);

CREATE TYPE prj2_chip_code AS ENUM (
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z'
);

CREATE TABLE prj2_chip_code_combo (
      id            SERIAL PRIMARY KEY
    , chip          INT REFERENCES prj2_chip (id) NOT NULL
    , code          prj2_chip_code NOT NULL
);

CREATE TABLE prj2_player_auth (
      id            SERIAL PRIMARY KEY
    , username      VARCHAR(32)
    , password      VARCHAR(256)
);

CREATE TABLE prj2_player_stats (
      id            INT REFERENCES prj2_player_auth (id) UNIQUE NOT NULL
    , bugfrags      INT NOT NULL
    , hp            INT NOT NULL
    , zenny         INT NOT NULL
);

CREATE TABLE prj2_player_to_chip (
      player        INT REFERENCES prj2_player_auth (id) NOT NULL
    , chipcodecombo INT REFERENCES prj2_chip_code_combo (id) NOT NULL
);
