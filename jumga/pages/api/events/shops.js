import {apiPUTRequest} from '../../../utils/flutterwave';

import Cors from 'cors'
import initMiddleware from '../../../utils/middleware';

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

    const {event: {data: {new: shop}}} = req.body;

    if (shop.approved) {

        await apiPUTRequest(
            res,
            `${process.env.FLUTTERWAVE_API_ENDPOINT}/subaccounts/${shop.account_id}`,
            {
                "business_name": shop.name,
                "business_email": shop.email,
                "account_bank": shop.bank_code,
                "account_number": shop.account_number
            }
        );

        res.statusCode = 200;

        res.end();

    } else {

        res.statusCode = 200;

        res.end();

    }
    
    

}  