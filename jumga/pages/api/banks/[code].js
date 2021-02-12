import {apiGETRequest} from '../../../utils/flutterwave';

import Cors from 'cors'
import initMiddleware from '../../../utils/middleware';
import { verifyIdToken } from '../../../utils/firebase/admin';

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

    const token = req.headers['authorization']?.split(' ');

    if (!token) {

      res.statusCode = 400;

      res.end();

    } else {

      await verifyIdToken(token[1]);
      
      return apiGETRequest(
          res,
          `https://api.flutterwave.com/v3/banks/${req.query.code}`
      );

    }

}  