import Header from "../../../components/Header";
import {Query} from '@apollo/client/react/components';
import {gql} from '@apollo/client';
import {
    Box,
    Flex,
    Heading,
    Container,
    Spinner,
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    Button,
    Table, Thead, Tbody, Tr, Th, Td, TableCaption
} from '@chakra-ui/react';
import Head from 'next/head';

import { getServerSideProps as mainGetServerSideProps } from '../../../utils/authenticated';
import { useAuth } from "../../../utils/auth";
import { sumBy, fromPairs, toPairs, groupBy } from "lodash";
import currencyFormat from "mout/number/currencyFormat";
import { useContext } from "react";
import { CountryContext } from "../../../utils/contexts/Country";
import { CurrencyContext } from "../../../utils/contexts/Currency";
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {

    const {props} = await mainGetServerSideProps(context);

    return {
        props: {
            ...props,
            id: context.params.id
        }
    }


}

const GET_ORDERS = gql`
    query(
        $shop_id: bigint!
    ){
        shop: shops_by_pk(id: $shop_id){
            id
            name
            logo
            approved
            country
        }
        items: order_items(where: {product: {shop_id: {_eq: $shop_id}}}, order_by: {created_at: desc}){
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
            order{
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
                query={GET_ORDERS}
                variables={{
                    shop_id: props.id
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

                    const items =  data && data.items ? data.items: [];
                    const shop =  data && data.shop ? data.shop: null;

                    return (
                        <Container maxW="6xl" my={16}>
                            
                            <Flex direction="column" justifyContent="center" alignItems="center" pb="16" mb={10}>
                                {/* <div className="mx-auto my-10 rounded-full bg-gray-200 w-28 h-28 flex items-center justify-center">
                                    {svgs[category.slug] || <svg className="text-gray-500 w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>}
                                </div> */}
                                <Head>
                                    <title>{shop.name}'s Orders</title>
                                </Head>
                                <Breadcrumb mb={8}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/shops">Your Shops</BreadcrumbLink>
                                    </BreadcrumbItem>

                                    <BreadcrumbItem isCurrentPage>
                                        <BreadcrumbLink href={`/shops/${shop.id}/orders`}>{shop.name}'s Orders</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </Breadcrumb>
                                <Heading textAlign="center" as="h6" size="3xl">
                                    {shop.name}'s Orders
                                </Heading>
                            </Flex>
                            <Table variant="simple">
                                {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                                <Thead>
                                    <Tr>
                                        <Th>Order ID</Th>
                                        <Th>Product</Th>
                                        <Th>Customer</Th>
                                        <Th>Currency</Th>
                                        <Th>Qty</Th>
                                        <Th>Price</Th>
                                        <Th>Date</Th>
                                        <Th>Payment</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {items.map((p) => {

                                        return (

                                            <Tr>
                                                <Td>
                                                    {p.order.id}
                                                </Td>
                                                <Td>{p.product.name}</Td>
                                                <Td>{p.order.customer_name}</Td>
                                                <Td>{p.order.currency}</Td>
                                                <Td>{p.qty}</Td>
                                                <Td>{currencyFormat(p.price)}</Td>
                                                
                                                <Td>{moment(p.order.created_at).fromNow()}</Td>
                                                <Td>
                                                    {p.order.payment_id ? <Badge colorScheme="green">Paid</Badge> :<Badge>Pending Payment</Badge>}
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