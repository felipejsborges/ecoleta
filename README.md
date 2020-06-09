<div align="center">
	<h1>Ecoleta ♻️</h1>
	<br>
	<img src="/.github/introimg.png" alt="Intro" style="max-width:100%"/>
</div>

<br>

<h4 align="center">
	<a href="#intro-">Intro</a>	|    
	<a href="#api-">API</a>		|    
	<a href="#website-">Website</a>		|    
	<a href="#mobile-app-">Mobile app</a>
</h4>

<hr>

<div align="center">
	<h3>Intro 🚪</h3>
</div>

<h3>What is Ecoleta?</h3>

Ecoleta is a project that was developed during **Next Level Week**. An online event organized by [Rocketseat](https://rocketseat.com.br/) that aims to **up the career of developers** by challenging them to build a **complete application**. We built an API, a website and a mobile application. June 5th was also the **international environment day**. So we created a website where entities could register and inform what some **kind of material that can't be disposed in common garbage** that they are collecting, like batteries or cooking oil, for example. We also created an application where the user can access and **check on the map the points registered on the webiste** and locate where have one to discard some item they need.

<h3>What language was used?</h3>

We used [TypeScript](https://www.typescriptlang.org/docs/home.html), because it provides us a better autocomplete and reduces the chance of errors by comparing with simple JavaScript.

<h3>And the technologies?</h3>

- [Node.js](https://nodejs.org/en/docs/) for the API
- [ReactJS](https://reactjs.org/docs/getting-started.html) for the website
- [React Native](https://reactnative.dev/docs/getting-started) and [Expo](https://docs.expo.io/) for the mobile application

<hr>

<div align="center">
	<h3>API 📡</h3>
</div>

<h3>Routes</h3>

- [Download here](https://drive.google.com/file/d/1zpwo4oeFFc7hIjl6sJ_3sssnO63IPDjs/view?usp=sharing), and import it in [Insomnia](https://insomnia.rest/)

<h3>Main libs</h3>

- [Express](https://expressjs.com/) as web application framework
- [Sqlite3](https://www.sqlite.org/docs.html) for database
- [Knex](http://knexjs.org/) query builder to manage the database

<h3>How to run it on your computer</h3>

- Install [Node.js](https://nodejs.org/en/download/) and [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), then:

```
# clone this repo
$ git clone https://github.com/felipejsborges/ecoleta.git

# go to backend folder
$ cd backend

# install dependencies
$ npm install

# run migrations and seed
$ npm run knex:migrate
$ npm run knex:seed

# Change to your computer's IP on files ItemsController and PointsController on `backend/src/controllers/`

# run the server
$ npm run dev
```
<hr>

<div align="center">
	<h3>Website 💻</h3>
</div>

<h3>Features</h3>

- Create a collecting point

<div align="center">
	<img src="/.github/website.gif" alt="website" style="max-width:100%"/>
</div>
	
<h3>Responsivity</h3>

- It can be accessed using a smartphone

<div align="center">
	<img src="/.github/responsive.gif" alt="website" style="max-width:100%"/>
</div>

<h3>Main libs</h3>
 
- [Axios](https://github.com/axios/axios) to consume the API
- [React Leaflet](https://react-leaflet.js.org/docs/en/intro) for [Leaflet](https://leafletjs.com/reference-1.6.0.html) as a React component

<h3>How to run it on your computer</h3>
 
```
# clone this repo
$ git clone https://github.com/felipejsborges/ecoleta.git

# go to frontend folder
$ cd frontend

# install dependencies
$ npm install

# Change to your computer's IP on mobile/src/services/api.ts

# run the website
$ npm run start
```
<hr>

<div align="center">
	<h3>Mobile app 📱</h3>
</div>

<h3>Features</h3>

- Filter points by city
- Show points on map
- Filter points by items
- Show details of a specific point
- Allow to contact a point by e-mail or WhatsApp
- Open map to show directions to the point

<div align="center">
	<img src="/.github/mobile.gif" alt="mobile" style="max-width:100%"/>
</div>

<h3>Main libs</h3>

- [React Navigation](https://reactnavigation.org/docs/getting-started/) for routing and navigation
- [React Native Maps](https://github.com/react-native-community/react-native-maps) to create a map as a component of React Native

<h3>How to run it on your computer</h3>

```
# clone this repo
$ git clone https://github.com/felipejsborges/ecoleta.git

# go to mobile folder
$ cd mobile

# install dependencies
$ npm install

# Change to your computer's IP on mobile/src/services/api.ts

# run the application
$ npm run start
```

<hr>

<span>Feel free to contribute 💪</span>

by Felipe Borges<br>
[Linkedin](https://www.linkedin.com/in/felipejsborges) | [GitHub](https://github.com/felipejsborges)
