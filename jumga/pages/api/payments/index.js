import graphql from '../../../utils/graphql';
import {apiPOST} from '../../../utils/flutterwave';

export default async (req, res) => {

    const {event, data} = req.body;
    const {tx_ref} = data;

    // console.log(event, data);

    switch (event) {
        case 'charge.completed':

            const paymentData = await graphql.request(`
                mutation(
                    $data: jsonb!
                ){
                    payment: insert_payments_one(object: {data: $data}) {
                        id
                    }
                }
            
            `, {
                data
            });

            const isShopApproval = tx_ref.includes('shop_approval');
            const isOrder = tx_ref.includes('order');
            const idSplit = tx_ref.split('_');


            const id = idSplit[idSplit.length - 1];

            if (isShopApproval) {

                const dispatchData = await graphql.request(`
                    query(
                        $id: bigint!
                    ){
                        users: dispatch{
                            id
                            name
                        }
                        shop: shops_by_pk(id: $id){
                            id
                            name
                            phone
                            email
                            account_number
                            bank_code
                            country
                            location
                            description
                            approved
                        }
                    }
                
                `, {
                    id
                });

                const randomIndex = Math.floor(Math.random() * dispatchData.users.length);


                const {data} = await apiPOST(
                    `${process.env.FLUTTERWAVE_API_ENDPOINT}/subaccounts`,
                    {
                        "account_bank": dispatchData.shop.bank_code,
                        "account_number": dispatchData.shop.account_number,
                        "business_name": dispatchData.shop.name,
                        "business_email": dispatchData.shop.email,
                        "business_contact": "Anonymous",
                        "business_contact_mobile": dispatchData.shop.phone,
                        "business_mobile": dispatchData.shop.phone,
                        "country": dispatchData.shop.country,
                        "split_type": "percentage",
                        "split_value": 0.025
                    }
                );


                await graphql.request(`
                    mutation(
                        $id: bigint!,
                        $payment_id: bigint!,
                        $dispatch_id: bigint!,
                        $subaccount_id: String!,
                        $account_id: String!
                    ){
                        update_shops_by_pk(pk_columns: {
                            id: $id
                        }, _set: {
                            dispatch_id: $dispatch_id,
                            approved: true,
                            payment_id: $payment_id,
                            subaccount_id: $subaccount_id,
                            account_id: $account_id
                        }) {
                            id
                        }
                    }
                
                `, {
                    id,
                    payment_id: paymentData.payment.id,
                    dispatch_id: dispatchData.users[randomIndex].id,
                    account_id: `${data.data.id}`,
                    subaccount_id: `${data.data.subaccount_id}`
                });
                

            } else if (isOrder) {

                await graphql.request(`
                    mutation(
                        $id: bigint!,
                        $payment_id: bigint!,
                    ){
                        update_orders_by_pk(pk_columns: {
                            id: $id
                        }, _set: {
                            payment_id: $payment_id
                        }) {
                            id
                        }
                    }
                
                `, {
                    id,
                    payment_id: paymentData.payment.id
                });

            }


            
            break;
    
        default:
            break;
    }
    
    res.statusCode = 200
    res.end();

}  