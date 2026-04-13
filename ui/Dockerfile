FROM node:20-alpine
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

# Copy Next.js logic explicitly bridging Docker layers cleanly
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
