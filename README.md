This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 1.Install

### npm

```
npm i
or
npm i --legacy-peer-deps
```

### yarn

```
yarn install
```

## 2.Start
Create file **_.env_** with following content then copy to root folder **_`ism_client`_**
```shell
GENERATE_SOURCEMAP=false
PORT=3000
# APOLLO
REACT_APP_APOLLO_HTTP_ENDPOINT=http://localhost:4000/graphql
REACT_APP_SUBSCRIPTION_ENDPOINT=ws://localhost:4000/subscriptions
````
```sh
npm start
or
yarn start
```

## 3.Build

```sh
npm run build or yarn build
```

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.

## User Guide

You can find detailed instructions on using Create React App and many tips in [its documentation](https://facebook.github.io/create-react-app/).
