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
        is_activated BOOLEAN
      );';

      $db->exec($sql);
}catch(PDOException $e){
  echo $e->getMessage();
}
