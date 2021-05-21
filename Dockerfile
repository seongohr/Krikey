FROM node
WORKDIR /usr/src/krikey
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD npm run initial && npm run start
