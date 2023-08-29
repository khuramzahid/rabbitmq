rabbitmq": "docker pull rabbitmq:3-management

docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3-management 

google-chrome --new-tab http://localhost:15672
default username (guest) and password (guest) 