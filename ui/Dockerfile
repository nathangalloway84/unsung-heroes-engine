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

# Execute Workspace specific build output
RUN npm run build -w ui

EXPOSE 3000
# Run Next.js start command from the targeted workspace
CMD ["npm", "run", "start", "-w", "ui"]
