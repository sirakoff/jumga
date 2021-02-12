import {apiPUTRequest} from '../../../../utils/flutterwave';
import graphql from '../../../../utils/graphql';

import Cors from 'cors'
import initMiddleware from '../../../../utils/middleware';

import admin from '../../../../utils/firebase/admin';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)


export default async (req, res) => {

    await cors(req, res);

    const {event: {data: {new: user}}} = req.body;


    const customClaims = {
        "https://hasura.io/jwt/claims": {
          "x-hasura-default-role": user.role,
          "x-hasura-allowed-roles": ["user", "merchant", "anonymous", "dispatch"],
          "x-hasura-user-id": user.firebase_id
        }
    };
    
    await admin.auth().setCustomUserClaims(user.firebase_id, customClaims).then(() => {
    
          // Update real-time database to notify client to force refresh.
          const metadataRef = admin.database().ref("metadata/" + user.firebase_id);
          // Set the refresh time to the current UTC timestamp.
          // This will be captured on the client to force a token refresh.
          return metadataRef.set({ refreshTime: new Date().getTime() });
    
    });

    res.statusCode = 200;

    res.end();
    


};