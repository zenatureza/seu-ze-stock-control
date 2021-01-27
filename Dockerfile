FROM node:12.14.0-alpine3.11

RUN apk add --no-cache bash git

RUN touch /home/node/.bashrc | echo "PS1='\w\$ '" >> /home/node/.bashrc

USER node

ENV DIR=/home/node/express

WORKDIR ${DIR}

COPY ./.docker/entrypoint.sh ${DIR}/entrypoint.sh

# RUN ls ${DIR}

# RUN chmod +x ${DIR}/entrypoint.sh
# RUN ["chmod", "+x", "entrypoint.sh"]

