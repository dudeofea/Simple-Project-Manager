docker exec daemon rm -rf /root/script.sh
docker cp $1 daemon:/root/script.sh
docker exec daemon /root/script.sh
docker exec daemon rm -rf /root/script.sh
