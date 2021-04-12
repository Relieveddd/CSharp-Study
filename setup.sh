image_version=`date +%Y%m%d%H%M`; 
echo $image_version; 
# cd vue2docker 
# git pull --rebase origin master; 
docker stop  frontend_ipms_pc; 
docker rm  frontend_ipms_pc; 
docker rmi $(docker images | grep " frontend_ipms_pc" | awk '{print $3}') 
docker build -t  frontend_ipms_pc:$image_version .; 
docker images; 
docker run -p 101:80 -d --name frontend_ipms_pc  frontend_ipms_pc:$image_version;
