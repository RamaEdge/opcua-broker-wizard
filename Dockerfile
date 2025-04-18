
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install jq for potential configuration manipulation
RUN apk add --no-cache jq

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag to avoid compatibility issues
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration if needed
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
