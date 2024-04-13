<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Event Microservice

## Installation

```bash
# clone this repository
$ git clone https://github.com/Juudini/flutter_event_qr

# move to project directory
$ cd flutter_event_qr/backend/event_microservice

# install dependencies
$ npm install
```

## Running the app as Dev mode

```bash
$ docker compose up -d

$ npx prisma db push

# up Nats server
$ docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats

# watch mode
$ npm run start:dev

```

Make sure you have the `.env` file in the root folder.

## 🔗 Links

<a href="https://www.linkedin.com/in/juandebandi/"><img alt="LinkedIn" title="LinkedIn" src="https://custom-icon-badges.demolab.com/badge/-LinkedIn-231b2e?style=for-the-badge&logoColor=F8D866&logo=LinkedIn"/></a>
<a href="https://juandebandi.dev/"><img alt="Portfolio" title="Portfolio" src="https://custom-icon-badges.demolab.com/badge/-|Portfolio-1F222E?style=for-the-badge&logoColor=F8D866&logo=link-external"/></a>
<a href="mailto:juudinidev@gmail.com">
<img src="https://custom-icon-badges.demolab.com/badge/-Email-231b2e?style=for-the-badge&logoColor=F8D866&logo=gmail" alt="Email">
</a>
