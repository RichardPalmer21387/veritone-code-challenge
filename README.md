# Veritone full-stack code challenge submission.

This is a submission for the veritone interview code challenge.  

## Requirements

This project includes an express backend with node-postgres to interact with an existing postgres database. You will need to create this database and supply the needed credentials.

### PostgreSQL DB

The database and table will need to be setup locally with the correct structure and a set of environment variables will need to be set before running the app.

#### Environment variables

`PGUSER`, `PGPASSWORD`, and `PGDATABASE` environment variables will need to be setup before running this app.


**windows power shell:**
| action | command |
|--------|---------|
|add env variables command template|`$env:PGUSER="[user with read/write]"; $env:PGPASSWORD="[password for user]"; $env:PGDATABASE="[your database name]"`|
|remove env variables command|`Remove-Item Env:\PGUSER; Remove-Item Env:\PGPASSWORD; Remove-Item Env:\PGDATABASE;`|

**mac terminal:**
| action | command |
|--------|---------|
|prepend env variables to the start command.|`PGUSER=[user with read/write];PGPASSWORD=[password for user];PGDATABASE=[your database name];npm start`|

#### Table structure

```
                                       Table "public.shoppinglistitems"
   Column    |           Type           | Collation | Nullable |                    Default
-------------+--------------------------+-----------+----------+-----------------------------------------------
 id          | integer                  |           | not null | nextval('shoppinglistitems_id_seq'::regclass)
 modified    | timestamp with time zone |           |          |
 name        | character varying(30)    |           |          |
 description | character varying(256)   |           |          |
 quantity    | smallint                 |           |          |
 purchased   | boolean                  |           |          |
 deleted     | boolean                  |           |          |
Indexes:
    "shoppinglistitems_pkey" PRIMARY KEY, btree (id)
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Todo

1. Fix indexeddb sync with postgres.  Currently actions like post new item await a response from the backend code to get the id to add to the indexed db.  This means if a user doesn't have an internet connection, that call to the backend will never complete and the item will never be added.
    - [ ] Change sync to not be so dependent on id.
    - [ ] Change actions to be offline first.
2. Need to write up some info on my react only minimal redux like state management with `prepareContext`.
