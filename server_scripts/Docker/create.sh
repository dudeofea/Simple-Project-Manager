docker build -t test .
docker run --name daemon -d test /bin/sh -c "while true; do sleep 3; done"
