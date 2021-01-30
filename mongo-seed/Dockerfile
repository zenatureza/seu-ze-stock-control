FROM mongo

COPY init.json /init.json

COPY wait-for.sh /wait-for.sh

# should i copy entrypoint?

# this command will convert products.csv -> init.json
# CMD python create-db-init.py

# CMD mongoimport --host mongodb --db reach-engine --collection products --type json --file /init.json --jsonArray
CMD mongoimport --host mongodb --db seuze --collection products --type json --file /init.json --jsonArray
