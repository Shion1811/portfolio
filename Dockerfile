FROM node:24
WORKDIR /app/next-app

copy next-app .
RUN npm install
CMD ["npm", "run", "dev"]
EXPOSE 3000