FROM node:20-alpine
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --production

# Copy API logic explicitly bridging Docker layers cleanly
COPY . .

EXPOSE 4000
CMD ["npm", "start"]
