![Screenshot](https://github.com/sirakoff/jumga/blob/master/screenshot.png?raw=true)


# Jumga Marketplace

Flutterwave 2021 Challenge


An online marketplace for african merchants in `GH`, `KE` & `NG`. Built with `Next.js`, `Hasura (GraphQL)`, `Firebase (Auth & Storage)`, `Chakra UI` & `TailwindCSS`

# Setup

### Firebase
This project requires you to create a firebase project and download the service account key file saved as `jumga/secrets.json` for firebase admin. You'll also have to enable `Email/Password authentication` as well as `storage`

### Docker & Hasura GraphQL Engine


```
docker-compose up -d
```

### Hasura CLI

```
yarn global add hasura-cli
cd hasura
hasura migrate apply
hasura metadata apply
hasura seeds apply
```


### Next.js

```
cd jumga
yarn install
yarn dev
```


### Flutterwave Account
Don't forget to setup `localtunnel` or `ngrok` to mirror the webhooks and update the settings on flutterwave to point to the tunnel url.



# `jumga/.env.local`

Be sure to update the env file with the appropriate keys from flutterwave and firebase.


```
  FLUTTERWAVE_SECRET_KEY=
  NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=
  NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://127.0.0.1:8085/v1/graphql
  NEXT_PUBLIC_API_ENDPOINT=http://127.0.0.1:3000/api
  FLUTTERWAVE_API_ENDPOINT=https://api.flutterwave.com/v3
  FIREBASE_DB_URL=https://<firebase-project-id>.firebaseio.com
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<firebase-project-id>.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=<firebase-project-id>
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<firebase-project-id>.appspot.com
  NEXT_PUBLIC_FIREBASE_APP_ID=
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```
