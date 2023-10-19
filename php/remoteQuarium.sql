USE DATABASE utazasco_remoteQuarium;

CREATE TABLE IF NOT EXISTS users{
    email VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
};

CREATE TABLE IF NOT EXISTS aquariums{
    id BIGINT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    length INT NOT NULL,
    height INT NOT NULL,
    depth INT NOT NULL
};

CREATE TABLE IF NOT EXISTS haveAquarium{
    email VARCHAR(255) NOT NULL,
    id BIGINT NOT NULL,

    FOREIGN KEY(email)
    REFERENCES usres(email)
    ON DELETE CASCADE ON UPDATE CASCADE,

    FOREIGN KEY(id)
    REFERENCES aquariums(id)
    ON DELETE CASCADE ON UPDATE CASCADE
};

CREATE TABLE IF NOT EXISTS condfigs{
    id BIGINT NOT NULL,
    minTemp INT NOT NULL,
    maxTemp INT NOT NULL,
    minPh INT NOT NULL,
    maxPh INT NOT NULL,
    lightOn INT NOT NULL,
    lightOff INT NOT NULL,
    filterOn INT NOT NULL,
    filterOff INT NOT NULL,
    airOn INT NOT NULL,
    airOff INT NOT NULL,
    waterLvlAlert INT NOT NULL,
    prefLight INT NOT NULL,
    feedingTime ONT NOT NULL,
    filterClean INT NOT NULL,
    waterChange INT NOT NULL,
    sampleTime INT NOT NULL,
    lasModifiedDate DATETIME NOT NULL,

    FOREIGN KEY (id)
    REFERENCES aquariums(id)
    ON DELETE CASCADE ON UPDATE CASCADE 
};

CREATE TABLE IF NOT EXISTS sensorSamples{
    id BIGINT NOT NULL,
    sampleTime DATETIME NOT NULL PRIMARY KEY,
    temp INT NOT NULL,
    ph INT NOT NULL,
    waterLvl INT NOT NULL,
    lightAmount INT NOT NULL

    FOREIGN KEY(id)
    REFERENCES aquariums(id)
    ON DELETE CASCADE ON UPDATE CASCADE
};