# 构建本地镜像
docker build -t thankwsx/api.aiman:2.0 .

# 启动本地镜像

docker run -it -p 80:8080 thankwsx/api.aiman:1.0

# 参考文档

https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-5-modifying-the-web-server-configuration-and-service-definition

# 重启服务
```
docker compose down
docker compose up -d
```