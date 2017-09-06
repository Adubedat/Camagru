<?php

include 'database.php';

try {
    $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ));

    $sql = '
      CREATE DATABASE IF NOT EXISTS camagru;
      USE camagru;
      CREATE TABLE users(
        ID int PRIMARY KEY NOT NULL AUTO_INCREMENT,
        login VARCHAR(16),
        password TEXT,
        email TEXT,
        activation_id TEXT,
        reset_id TEXT,
        is_activated BOOLEAN
      );

      CREATE TABLE pictures(
        picture_location VARCHAR(40),
        creation_date DATETIME,
        author VARCHAR(16)
      );

      CREATE TABLE likes(
        picture_name VARCHAR(40),
        author_login VARCHAR(16)
      );

      CREATE TABLE comments(
        picture_name VARCHAR(40),
        author_login VARCHAR(16),
        comment TEXT
      )';

      $db->exec($sql);
}catch(PDOException $e){
  echo $e->getMessage();
}
