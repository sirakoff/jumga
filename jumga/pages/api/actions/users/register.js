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
);


export default async (req, res) => {


    try {

        await cors(req, res);

        const {input: {info: {name, email, password}}} = req.body;

        const user = await admin.auth().createUser({
            displayName: name,
            email,
            password
        });


        const customClaims = {
            "https://hasura.io/jwt/claims": {
                "x-hasura-default-role": "user",
                "x-hasura-allowed-roles": ["user", "merchant", "anonymous", "dispatch"],
                "x-hasura-user-id": user.uid
            }
        };

        const userData = await graphql.request(`

            mutation (
                $name: String!,
                $email: String!,
                $firebase_id: String!
            ){
                user: insert_users_one(object: {
                    name: $name,
                    email: $email,
                    firebase_id: $firebase_id,
                    role: "user"
                }) {
                    id
                    role
                }
            }

        `, {
            name,
            email,
            firebase_id: user.uid
        });
        
        await admin.auth().setCustomUserClaims(user.uid, customClaims);

        res.statusCode = 200;
        

        return res.json({
            id: userData.user.id
        });

    } catch(e) {

        console.log(e);

        res.statusCode = 400;
        
        return res.json({
            message: e.message,
            code: e.code
        });


    }
    


};