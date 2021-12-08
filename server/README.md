# Public Market Mobile App Server

This express server is written on NodeJS. It uses PostgreSQL for database and Prisma for ORM.

To setup the server. Do the following

1. Open CLI with the root of server as its directory.
2. Run `npm i` to install dependencies.
3. Run `npx prisma generate` to generate the PostgreSQL database.
4. There are two ways to run the app. Via developer mode `npm run start:dev` or by building production with `npm run build` and then using `npm start` to run it.
5. The app is now running successfully.
