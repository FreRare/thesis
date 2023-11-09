
DROP TABLE IF EXISTS haveAquarium;
DROP TABLE IF EXISTS configs;
DROP TABLE IF EXISTS sensorSamples;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS aquariums;


CREATE TABLE IF NOT EXISTS users(
    email VARCHAR(255) NOT NULL UNIQUE,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    deviceToken VARCHAR(255) NOT NULL,
    authToken VARCHAR(23) NOT NULL,

    PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS aquariums(
    id BIGINT NOT NULL UNIQUE AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    length INT NOT NULL,
    height INT NOT NULL,
    depth INT NOT NULL,
    fishCount INT,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS haveAquarium(
    email VARCHAR(255) NOT NULL,
    id BIGINT NOT NULL,

    PRIMARY KEY (email, id),

    FOREIGN KEY(email)
    REFERENCES users(email)
    ON DELETE CASCADE ON UPDATE CASCADE,

    FOREIGN KEY(id)
    REFERENCES aquariums(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS configs(
    id BIGINT NOT NULL,
    minTemp FLOAT(2, 2) NOT NULL,
    maxTemp FLOAT(2, 2) NOT NULL,
    minPh FLOAT(2, 2) NOT NULL,
    maxPh FLOAT(2, 2) NOT NULL,
    OnOutlet1 INT NOT NULL,
    OffOutlet1 INT NOT NULL,
    OnOutlet2 INT NOT NULL,
    OffOutlet2 INT NOT NULL,
    OnOutlet3 INT NOT NULL,
    OffOutlet3 INT NOT NULL,
    waterLvlAlert INT NOT NULL,
    prefLight INT NOT NULL,
    feedingTime INT NOT NULL,
    foodPortions INT NOT NULL,
    filterClean INT NOT NULL,
    waterChange INT NOT NULL,
    samplePeriod INT NOT NULL,
    lastModifiedDate DATETIME NOT NULL,

    FOREIGN KEY (id)
    REFERENCES aquariums(id)
    ON DELETE CASCADE ON UPDATE CASCADE 
);

CREATE TABLE IF NOT EXISTS sensorSamples(
    id BIGINT NOT NULL,
    sampleTime DATETIME NOT NULL,
    temp FLOAT(2, 2) NOT NULL,
    ph FLOAT(2, 2) NOT NULL,
    waterLvl INT NOT NULL,
    lightAmount INT NOT NULL,

    PRIMARY KEY (id, sampleTime),

    FOREIGN KEY(id)
    REFERENCES aquariums(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);