Quiz App
=========
This is the week 5-6 group project submission for Lighthouse Labs. The tech stack used in this multi-page application includes jquery for dynamic client side rendering and Node Ejs for server side rendering. The backend is built on Node and Express with data persisted on a local PostgreSQL database.
This app allows users to create, complete, and delete quizzes and supports desktop and tablet resolutions.

---------------------------
### Contributors
- [Jimmy Chuk](https://github.com/ryjcm1)
- [Lea Ehar](https://github.com/leapehar)
- [Manseerat Kaur](https://github.com/SeeratSidhu)

<img src="./docs/quiz-app.gif" style="margin: 1em; " alt="Quiz App">

## Project Setup

For this app to run a local database called midterm should be created.


## Getting Started

1. Create the `.env` by using `.env.example` as a reference
2. Update the .env file with your correct local information 
3. To install dependencies run:
    ```
    npm install
    ```
4. To fix to binaries for sass run:
   ```
    npm rebuild node-sass
    ```
5. To reset database run:
    ```
    npm run db:reset
    ```
    Check the db folder to see what gets created and seeded in the SDB
6. To run the server
    ```
    npm run local
    ```
    (Note: nodemon is used, so you should not have to restart your server)
7. The app will be run on PORT 8080
    ```
    http://localhost:8080/
    ```



## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
