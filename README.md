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
 name        | character varying(256)   |           |          |
 description | character varying(256)   |           |          |
 quantity    | smallint                 |           |          |
 purchased   | boolean                  |           |          |
 deleted     | boolean                  |           |          |
Indexes:
    "shoppinglistitems_pkey" PRIMARY KEY, btree (id)
```

## Recommended Dev stack used

1. React 17+
3. React Router
4. Material UI
5. JSS
6. Node
7. Express
8. Postgres

## Other Dev stack used

1. Typescript
2. Express promise router
3. XO
4. lodash
5. nodemon
6. loglevel
7. classnames
8. indexeddb
9. my custom `prepareContext` tool

### Typescript

I'm a big champion of Typescript and strict typing in general.  The benefit you get from the extra IDE helpers when using Typescript, I find result in a ultimate reduction of development time on a project, espically when you use strict typing and avoid the evil `any`.  I would honestly probably still be debugging this code challenge without it.

### Express promise router

A simple wrapper for Express 4's Router that allows middleware to return promises. This package makes it simpler to write route handlers for Express when dealing with promises by reducing duplicate code.

### XO

Opinionated but configurable ESLint wrapper with lots of goodies included. Enforces strict and readable code. I find that using an opinionated linter thats default configuration is managed by a community helps me to keep my code practices at their absolute best.

### lodash

A modern JavaScript utility library delivering modularity, performance & extras.  Lots of tools designed in a functional format that are immensly useful when working with react functional components and hooks.

### nodemon

nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected. Used to run the backend express app and watch that directory for changes while react dev server serves the local app and proxies `/api` requests to the express server.

### loglevel

Minimal lightweight simple logging for JavaScript. loglevel replaces console.log() and friends with level-based logging and filtering, with none of console's downsides.

### classnames

A simple JavaScript utility for conditionally joining classNames together.

### indexeddb

I decided to go a offline first route with this.  As it said I should act as the product owner, I figured lots of shopping centers are blocking celular data plans in their stores so if this was going to be a useful app to checkoff items as you purchased them as the mockup inplies, I would need to enable this app to continue to function offline and sync its actions with the server once a connection was restored.

### prepareContext

So a couple of years back at my current position we made the switch to using typescript as a required part of our dev stack.  As it turns out, this createad a lot of headaches when working with redux.  Redux's typing just wouldn't stay consistent expically with thier `connect()` method. We also found that the philosophy of redux's design patterns led us to the unfortunate practice of having one giant monlithic app state instead of useing several more usage specific providers. It caused our team constant headaches.  So in the architectue meeting for our next big product we discussed what we could do to solve these issues and decided that with React's new context and reducer hooks, we could liekly recreate the core parts of redux that we liked in our own more typescript friendly way and cut out the redux dependency entirely.  And thats where prepareContext comes from.  It with our custom logger reproduces the core parts of redux with a typescript first mentality in a minimalistic way using react hooks.  Check out any of the context files to see what I mean.


## Recommended tools

This is the set of dev tools I used during development and will really make the project shine if you go poking around with it.

1. vscode
2. XO vscode plugin by Sam Verschueren
3. enable `XO -fix` as formatter in workspace settings.

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

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Todo

- Fix indexeddb sync with postgres.  Currently actions like post new item await a response from the backend code to get the id to add to the indexed db.  This means if a user doesn't have an internet connection, that call to the backend will never complete and the item will never be added.
    - [ ] ~~Change sync to not be so dependent on id.~~
	- [x] Setup recovery loop if user goes offline. (sync interval every 30s and before any new calls?)
    - [x] Change actions to be offline first.
- [x] Need to write up some info on my react only minimal redux like state management with `prepareContext`.
- [x] Double check styles are matching demo at 1280 screen width per provided demo.
- [x] Change all styles to css is jsx

# Questions?
- Was that "Add Task" button intentional?
- Prototype shows a select dropdown for the quantity.  I would like to change that to a type="number" input field.
- Was the intention for the quantity functionality to append multiple items to the list?  Seems more likely we would want to display the quantity value in the list item somewhere?
