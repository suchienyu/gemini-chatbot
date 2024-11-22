docker buildx build --platform linux/amd64 -t chiennn/chatbotapi-chatbotfront:latest --load .
docker tag chatbotapi-chatbotfront chiennn/chatbotapi-chatbotfront:latest
docker push chiennn/chatbotapi-chatbotfront:latest