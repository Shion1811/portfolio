FROM node:24
WORKDIR /app/next-app

COPY next-app/package*.json ./
RUN npm install
COPY next-app .
CMD ["npm", "run", "dev"]
EXPOSE 3000