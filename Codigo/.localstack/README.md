docker exec -it localstack_sec 
aws --endpoint-url=http://localhost:4566 s3 mb s3://sec-hardz
aws --endpoint-url=http://localhost:4566 s3api put-bucket-acl --bucket sec-hardz --acl public-read