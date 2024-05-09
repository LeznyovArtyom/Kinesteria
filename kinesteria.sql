-- -----------------------------------------------------
-- Schema Kinesteria
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Kinesteria` DEFAULT CHARACTER SET utf8 ;
USE `Kinesteria` ;

-- -----------------------------------------------------
-- Table `Kinesteria`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Kinesteria`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `login` VARCHAR(24) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `about_me` TEXT(1000) NULL,
  `avatar` BLOB NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_role_idx` (`role_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `login_UNIQUE` (`login` ASC) VISIBLE,
  CONSTRAINT `fk_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `Kinesteria`.`role` (`id`)
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Kinesteria`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `description` TEXT(1000) NULL,
  `original_name` VARCHAR(255) NULL,
  `director` VARCHAR(100) NULL,
  `actors` TEXT(200) NULL,
  `release_year` INT NULL,
  `rating` DECIMAL(3,1) NULL,
  `image` BLOB NULL,
  `type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_type_idx` (`type_id` ASC) VISIBLE,
  CONSTRAINT `fk_type`
    FOREIGN KEY (`type_id`)
    REFERENCES `Kinesteria`.`type` (`id`)
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`social_media`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`social_media` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `vkontakte` VARCHAR(45) NULL,
  `instagram` VARCHAR(45) NULL,
  `telegram` VARCHAR(45) NULL,
  `whatsapp` VARCHAR(45) NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_social_media_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_social_media_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `Kinesteria`.`user` (`id`)
    ON DELETE CASCADE
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`genre` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Kinesteria`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`country` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Kinesteria`.`subtitles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`subtitles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Kinesteria`.`quality`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`quality` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Kinesteria`.`voice_acting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`voice_acting` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `Kinesteria`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` TEXT(1000) NULL,
  `date` DATETIME NULL,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_product_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `Kinesteria`.`user` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_product6`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` TEXT(1000) NULL,
  `date` DATETIME NULL,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_reviews_user1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_product_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_product7`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `Kinesteria`.`user` (`id`)
    ON DELETE CASCADE
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`series`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`series` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_series_product1_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_series_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`episode`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`episode` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `episode_number` INT NULL,
  `season_number` INT NULL,
  `video_file` BLOB NULL,
  `series_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_series_idx` (`series_id` ASC) VISIBLE,
  CONSTRAINT `fk_series`
    FOREIGN KEY (`series_id`)
    REFERENCES `Kinesteria`.`series` (`id`)
    ON DELETE CASCADE
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`movies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`movies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `video_file` BLOB NULL,
  `product_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_movies_and_cartoons_product1_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_movies_and_cartoons_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`product_genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`product_genre` (
  `product_id` INT NOT NULL,
  `genre_id` INT NOT NULL,
  INDEX `fk_product_idx` (`product_id` ASC) VISIBLE,
  INDEX `fk_genre_idx` (`genre_id` ASC) VISIBLE,
  CONSTRAINT `fk_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_genre`
    FOREIGN KEY (`genre_id`)
    REFERENCES `Kinesteria`.`genre` (`id`)
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`product_country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`product_country` (
  `product_id` INT NOT NULL,
  `country_id` INT NOT NULL,
  INDEX `fk_product_idx` (`product_id` ASC) VISIBLE,
  INDEX `fk_country_idx` (`country_id` ASC) VISIBLE,
  CONSTRAINT `fk_product2`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_country`
    FOREIGN KEY (`country_id`)
    REFERENCES `Kinesteria`.`country` (`id`)
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`product_subtitles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`product_subtitles` (
  `product_id` INT NOT NULL,
  `subtitles_id` INT NOT NULL,
  INDEX `fk_product_idx` (`product_id` ASC) VISIBLE,
  INDEX `fk_subtitles_idx` (`subtitles_id` ASC) VISIBLE,
  CONSTRAINT `fk_product3`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_subtitles`
    FOREIGN KEY (`subtitles_id`)
    REFERENCES `Kinesteria`.`subtitles` (`id`)
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`product_quality`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`product_quality` (
  `product_id` INT NOT NULL,
  `quality_id` INT NOT NULL,
  INDEX `fk_product_idx` (`product_id` ASC) VISIBLE,
  INDEX `fk_quality_idx` (`quality_id` ASC) VISIBLE,
  CONSTRAINT `fk_product4`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_quality`
    FOREIGN KEY (`quality_id`)
    REFERENCES `Kinesteria`.`quality` (`id`)
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`product_voice_acting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`product_voice_acting` (
  `product_id` INT NOT NULL,
  `voice_acting_id` INT NOT NULL,
  INDEX `fk_product_idx` (`product_id` ASC) VISIBLE,
  INDEX `fk_voice_acting_idx` (`voice_acting_id` ASC) VISIBLE,
  CONSTRAINT `fk_product5`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_voice_acting`
    FOREIGN KEY (`voice_acting_id`)
    REFERENCES `Kinesteria`.`voice_acting` (`id`)
  );


-- -----------------------------------------------------
-- Table `Kinesteria`.`cartoons`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Kinesteria`.`cartoons` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `video_file` BLOB NULL,
  `product_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_cartoons_product1_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_cartoons_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `Kinesteria`.`product` (`id`)
    ON DELETE CASCADE
  );


USE `Kinesteria`;

DELIMITER $$
CREATE DEFINER = CURRENT_USER TRIGGER `Kinesteria`.`user_AFTER_INSERT` AFTER INSERT ON `user` FOR EACH ROW
BEGIN
	INSERT INTO `social_media` (user_id) VALUES (NEW.id);
END$$

DELIMITER ;