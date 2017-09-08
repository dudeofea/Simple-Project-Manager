FROM ubuntu:16.04

RUN apt-get update && apt-get install -y \
    wget \
    sudo \
	curl \
	git

RUN mkdir /root/.ssh
ADD id_rsa /root/.ssh/id_rsa

WORKDIR /root
EXPOSE 80
EXPOSE 4000
