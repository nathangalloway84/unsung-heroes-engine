FROM node:20-alpine
WORKDIR /usr/src/app

# Cloud Run Monorepo Build Optimization
# Copy root configurations and workspace manifests first for caching
COPY package.json ./
COPY ui/package.json ./ui/
COPY api/package.json ./api/

RUN npm install

# Copy all workspace source code
COPY . .

EXPOSE 4000
# Run Node start command from the targeted workspace
CMD ["npm", "run", "start", "-w", "api"]
