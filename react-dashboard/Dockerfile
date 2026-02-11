FROM node:20

WORKDIR /app

COPY dist /app

RUN npm install
RUN npm install --include=optional sharp
RUN chmod +x start-addon.sh
CMD ["./start-addon.sh"]
