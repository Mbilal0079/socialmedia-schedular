FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY prisma ./prisma/

RUN npm install
RUN cd frontend && npm install

# Generate with the new output path
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . .

RUN cd frontend && npm run build

EXPOSE 3000

CMD ["npm", "start"]
