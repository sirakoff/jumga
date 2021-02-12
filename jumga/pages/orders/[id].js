import Header from "../../components/Header";
import {Query} from '@apollo/client/react/components';
import {gql} from '@apollo/client';
import {
    Box,
    Flex,
    Heading,
    Container,
    Spinner,
    Badge,
    Button,
    Table, Thead, Tbody, Tr, Th, Td, TableCaption
} from '@chakra-ui/react';
import Head from 'next/head';

import { getServerSideProps as mainGetServerSideProps } from '../../utils/authenticated';
import { useAuth } from "../../utils/auth";
import { sumBy, fromPairs, toPairs, groupBy } from "lodash";
import currencyFormat from "mout/number/currencyFormat";
import { useContext } from "react";
import { CountryContext } from "../../utils/contexts/Country";
import { CurrencyContext } from "../../utils/contexts/Currency";
export const getServerSideProps = async (context) => {

    const {props} = await mainGetServerSideProps(context);

    return {
        props: {
            ...props,
            id: context.params.id
        }
    }


}

const GET_ORDER = gql`
    query(
        $id: bigint!,
        $user_id: bigint!
    ){
        orders(where:{
            user_id: {_eq: $user_id},
            id: {_eq: $id}
        }){
            currency
            customer_name
            customer_phone
            id
            subtotal
            payment_id
            total
            total_delivery
            total_qty
            country
            items {
                id
                price
                qty
                total
                product {
                    id
                    name
                    prices{
                        id
                        price
                        default
                        currency
                    }
                    shop{
                        id
                        name
                        subaccount_id
                        dispatch {
                            id
                            subaccount_id
                            country
                            rate_gh
                            rate_ke
                            rate_ng
                            rate_uk
                        }
                    }
                }
            }
        }
    }
`;

export default (props) => {

    const {user} = useAuth();
    const {country} = useContext(CountryContext);
    const {currency} = useContext(CurrencyContext);

    return (
        <>
            <Header />
            {user && user.id ? <Query
                query={GET_ORDER}
                variables={{
                    id: props.id,
                    user_id: user.id
                }}
                fetchPolicy="network-only"
            >
                {({loading, data, refetch, error}) => {

                    if (loading) {

                        return (
                            <Container maxW="2xl" my={16}>
                                <Flex justifyContent="center" alignItems="center" w="full">
                                    <Spinner size="lg" />
                                </Flex>
                            </Container>
                        )

                    }

                    if (error) {

                        console.log(error)

                        return (

                            <Container maxW="2xl">
                                <Flex justifyContent="center" alignItems="center" w="full">
                                    <Box w={500} p={4} mx="auto" my={16}>
                                        <Heading textAlign="center" as="h6" size="lg" mb="16">
                                            An error occurred
                                        </Heading>
                                    </Box>
                                </Flex>
                            </Container>

                        )

                    }

                    // console.log(data);

                    const order =  data && data.orders ? data.orders[0]: null;
                    const _products = order ? order.items: [];

                    let subtotalByShop = fromPairs(toPairs(groupBy(_products, (p) => p.product.shop.subaccount_id)).map((k) => {

                        return [
                            k[0],
                            sumBy(k[1], (p) => {
    
                                return p.price * p.qty;
            
                            })
                        ];
    
                    }).map((k) => {
    
                        return [
                            k[0],
                            {
                                value: k[1],
                                percentage: (k[1] / order.total) * 100
                            }
                        ]
    
                    }));
    
                    let totalDeliveryByShop = fromPairs(toPairs(groupBy(_products, (p) => p.product.shop.dispatch.subaccount_id)).map((k) => {
    
                        return [
                            k[0],
                            sumBy(k[1], (p) => {
    
                                return p.product.shop.dispatch[`rate_${country.toLowerCase()}`];
            
                            })
                        ];
    
                    }).map((k) => {
    
                        return [
                            k[0],
                            {
                                value: k[1],
                                percentage: (k[1] / order.total) * 100
                            }
                        ]
    
                    }));
    
    
                    // console.log(subtotalByShop, totalDeliveryByShop);
    
    
                    const subaccounts = toPairs({
                        ...subtotalByShop,
                        ...totalDeliveryByShop
                    }).map((k) => {
    
                        return {
                            id: k[0],
                            transaction_split_ratio: k[1].percentage / 10
                        };
    
                    });

                    console.log(subaccounts);

                    return (
                        !order ? <Box w={500} p={4} mx="auto" my={16}>
                            <Heading textAlign="center" as="h6" size="lg" mb="16">
                                Not Found
                            </Heading>
                        </Box>: <Container maxW="3xl" my={16}>
                            <Flex direction="column" justifyContent="center" alignItems="center" pb="16" mb={10}>
                                {/* <div className="mx-auto my-10 rounded-full bg-gray-200 w-28 h-28 flex items-center justify-center">
                                    {svgs[category.slug] || <svg className="text-gray-500 w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>}
                                </div> */}
                                <Head>
                                    <title>Invoice #{order.id}</title>
                                </Head>
                                <Heading textAlign="center" as="h6" size="3xl">
                                    Invoice #{order.id}
                                </Heading>
                                <Box my={4}>
                                    {order.payment_id ? <Badge colorScheme="green">Paid</Badge> :<Badge>Pending Payment</Badge>}
                                </Box>
                                {!order.payment_id ? <Button onClick={() => {

                                    window.FlutterwaveCheckout({
                                        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
                                        tx_ref: `order_${order.id}`,
                                        amount: order.total,
                                        currency,
                                        country,
                                        // payment_options: "card,ussd,barter",
                                        customer: {
                                            email: user.email,
                                            phonenumber: order.customer_phone,
                                            name: order.customer_name,
                                        },
                                        subaccounts: [],
                                        callback: function (data) {
                                        
                                            // console.log(data);

                                            // router.push(`/orders/${data.order.id}`);

                                            window.location.reload();



                                        },
                                        customizations: {
                                            title: "Jumga Inc.",
                                            description: "No. 1 Online Marketplace in Africa",
                                            logo: "",
                                        },
                                    });

                                }} colorScheme="teal" size="xs">
                                    Make Payment
                                </Button>: null}
                            </Flex>
                            <Table variant="simple">
                                {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                                <Thead>
                                    <Tr>
                                        <Th>Product Name</Th>
                                        <Th>Vendor</Th>
                                        <Th isNumeric>Price</Th>
                                        <Th>Qty</Th>
                                        <Th isNumeric>Total</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {order.items.map((p) => {

                                        return (

                                            <Tr>
                                                <Td>{p.product.name}</Td>
                                                <Td>{p.product.shop.name}</Td>
                                                <Td isNumeric>{currencyFormat(p.price)}</Td>
                                                <Td>{p.qty}</Td>
                                                <Td isNumeric>{currencyFormat(p.price * p.qty)}</Td>
                                            </Tr>
                                                

                                        )

                                    }).concat([
                                        (

                                            <Tr>
                                                <Td>Sub Total</Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td isNumeric></Td>
                                                <Td isNumeric>{currencyFormat(order.subtotal)}</Td>
                                            </Tr>
                                                

                                        ),
                                        (

                                            <Tr>
                                                <Td>Delivery Fee</Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td isNumeric></Td>
                                                <Td isNumeric>{currencyFormat(order.total_delivery)}</Td>
                                            </Tr>
                                                

                                        ),
                                        (

                                            <Tr>
                                                <Td>Total</Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td isNumeric></Td>
                                                <Td isNumeric>{currencyFormat(order.total)}</Td>
                                            </Tr>
                                                

                                        )
                                    ])}
                                </Tbody>
                            </Table>
                        </Container>
                    )

                }}
            </Query>: null}
        </>
    );

}