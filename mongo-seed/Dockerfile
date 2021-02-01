FROM mongo

COPY products.csv /products.csv

CMD mongoimport \
  --host=${MONGODB_HOST} \
  --db=${MONGODB_DATABASE} \
  --username=${MONGODB_USERNAME} \
  --password=${MONGODB_PASSWORD} \
  --authenticationDatabase admin \
  --collection=products \
  --type=csv \
  --file=/products.csv \
  --headerline
