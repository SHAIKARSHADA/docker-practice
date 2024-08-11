FROM  node:16-alpine

WORKDIR /app

COPY . .

run npm install
run npm run build
run npx prisma generate

expose 3000

cmd ["node","dist/index.js"]