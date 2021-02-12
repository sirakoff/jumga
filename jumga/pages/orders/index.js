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
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {

    const {props} = await mainGetServerSideProps(context);

    return {
        props: {
            ...props
        }
    }


}

const GET_ORDER = gql`
    query(
        $user_id: bigint!
    ){
        orders(where:{
            user_id: {_eq: $user_id}
        }, order_by: {created_at: desc}){
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
            created_at
        }
    }
`;

export default (props) => {

    const {user} = useAuth();
    const {country} = useContext(CountryContext);
    const {currency} = useContext(CurrencyContext);

    const router = useRouter();

    return (
        <>
            <Header />
            {user && user.id ? <Query
                query={GET_ORDER}
                variables={{
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

                    const orders =  data && data.orders ? data.orders: [];

                    return (
                        <Container maxW="5xl" my={16}>
                            <Flex direction="column" justifyContent="center" alignItems="center" pb="16" mb={10}>
                                {/* <div className="mx-auto my-10 rounded-full bg-gray-200 w-28 h-28 flex items-center justify-center">
                                    {svgs[category.slug] || <svg className="text-gray-500 w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>}
                                </div> */}
                                <Head>
                                    <title>Your Orders</title>
                                </Head>
                                <Heading textAlign="center" as="h6" size="3xl">
                                    Your Orders
                                </Heading>
                            </Flex>
                            <Table variant="simple">
                                {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                                <Thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>Currency</Th>
                                        <Th>Total Qty</Th>
                                        <Th>Total Amount</Th>
                                        <Th>Date</Th>
                                        <Th>Payment</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {orders.map((o) => {

                                        return (

                                            <Tr>
                                                <Td>
                                                    {o.id}
                                                </Td>
                                                <Td>{o.currency}</Td>
                                                <Td>{o.total_qty}</Td>
                                                <Td>{currencyFormat(o.total)}</Td>
                                                
                                                <Td>{moment(o.created_at).fromNow()}</Td>
                                                <Td>
                                                    {o.payment_id ? <Badge colorScheme="green">Paid</Badge> :<Badge>Pending Payment</Badge>}
                                                </Td>
                                                <Td>
                                                    <Button variant="outline" onClick={() => router.push(`/orders/${o.id}`)} colorScheme="teal" size="xs">
                                                        View
                                                    </Button>
                                                </Td>
                                            </Tr>
                                                

                                        )

                                    })}
                                </Tbody>
                            </Table>
                        </Container>
                    )

                }}
            </Query>: null}
        </>
    );

}