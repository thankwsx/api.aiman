# 构建本地镜像
docker build -t thankwsx/api.aiman:1.0 .

# 启动本地镜像

docker run -it -p 80:8080 thankwsx/api.aiman:1.0