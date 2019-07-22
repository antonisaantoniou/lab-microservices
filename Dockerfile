FROM node:10

# create work dir
WORKDIR /usr/src/app

# copy the code in docker
COPY package*.json ./
COPY . .

# install dependencies
RUN npm i
RUN npm install -g concurrently
RUN npm install -g typescript
RUN tsc --build tsconfig.json

RUN ls

EXPOSE 3000
# run the code
CMD ["npm", "start"]