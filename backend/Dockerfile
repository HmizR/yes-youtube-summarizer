FROM node:20-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install ALL dependencies (including dev for nodemon)
RUN npm install

# Copy source code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]