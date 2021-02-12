import {apiPUTRequest} from '../../../../utils/flutterwave';
import graphql from '../../../../utils/graphql';

import Cors from 'cors'
import initMiddleware from '../../../../utils/middleware';

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

    const {event: {data: {new: dispatch}}} = req.body;


    await apiPUTRequest(
        res,
        `${process.env.FLUTTERWAVE_API_ENDPOINT}/subaccounts/${dispatch.account_id}`,
        {
            "business_name": dispatch.name,
            "business_email": dispatch.email,
            "account_bank": dispatch.bank_code,
            "account_number": dispatch.account_number
        }
    );

    res.statusCode = 200;

    res.end();

    
    
    

}  