#!/bin/bash

#TODO: install only if needed, make a random root password and don't remember it
DATABASE_PASS=cats
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password password $DATABASE_PASS"
sudo debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $DATABASE_PASS"

#install our deps
sudo apt-get update
sudo apt-get install -y apache2 php libapache2-mod-php php-mcrypt php-mysql mysql-server

#start services
sudo service apache2 start
sudo service mysql start

#mysql security fixes
mysql -u root -p"$DATABASE_PASS" -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1')"
mysql -u root -p"$DATABASE_PASS" -e "DELETE FROM mysql.user WHERE User=''"
mysql -u root -p"$DATABASE_PASS" -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\_%'"
mysql -u root -p"$DATABASE_PASS" -e "FLUSH PRIVILEGES"

#TODO: add hostname to apache config file (ServerName)
