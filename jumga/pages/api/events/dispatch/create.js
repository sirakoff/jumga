import {apiPOST} from '../../../../utils/flutterwave';
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

    // if (!dispatch.account_id) {


    const {data: account} = await apiPOST(
        `${process.env.FLUTTERWAVE_API_ENDPOINT}/subaccounts`,
        {
            "account_bank": dispatch.bank_code,
            "account_number": dispatch.account_number,
            "business_name": dispatch.name,
            "business_email": dispatch.email,
            "business_contact": "Anonymous",
            "business_contact_mobile": dispatch.contact,
            "business_mobile": dispatch.contact,
            "country": dispatch.country,
            "split_type": "percentage",
            "split_value": 0.2
        }
    );

    console.log(account);

    await graphql.request(`
        mutation(
            $id: bigint!,
            $subaccount_id: String!,
            $account_id: String!
        ){
            update_dispatch_by_pk(pk_columns: {
                id: $id
            }, _set: {
                subaccount_id: $subaccount_id,
                account_id: $account_id
            }) {
                id
            }
        }
    
    `, {
        id: dispatch.id,
        account_id: `${account.data.id}`,
        subaccount_id: `${account.data.subaccount_id}`
    });

    res.statusCode = 200;

    res.end();

    
    
    

}  