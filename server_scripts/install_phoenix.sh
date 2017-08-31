#!/bin/bash

#install erlang
wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb
sudo dpkg -i erlang-solutions_1.0_all.deb

#install our deps
sudo apt-get update
sudo apt-get install -y language-pack-en esl-erlang nodejs-legacy elixir npm
rm erlang-solutions_1.0_all.deb

#install phoenix
mix archive.install --force https://github.com/phoenixframework/archives/raw/master/phoenix_new.ez
mix local.hex --force
mix local.rebar --force

#fix locale issues
locale-gen "en_US.UTF-8"
dpkg-reconfigure locales

#make new phoenix project
rm -rf hello_phoenix
echo "y" | mix phoenix.new hello_phoenix
cd hello_phoenix
mix phoenix.server
