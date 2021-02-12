import React, { useState, useEffect, Fragment } from "react";
import gql from "graphql-tag";
import { useAuth } from "../../../../utils/auth";
import {Query} from '@apollo/client/react/components'
import { useRouter } from "next/router";

import {
    Box,
    Flex,
    Heading,
    Container,
    Spinner,
    Button
} from '@chakra-ui/react';

import { getServerSideProps as mainGetServerSideProps } from '../../../../utils/authenticated';

import ProductPage from './create';
import Head from 'next/head';

export const getServerSideProps = async (context) => {

    const {props} = await mainGetServerSideProps(context);

    return {
        props: {
            ...props,
            id: context.params.id,
            product: context.params.product
        }
    }


}



const GET_PRODUCT = gql`
    query(
        $id: bigint!
        $shop_id: bigint!,
        $admin_id: bigint!
    ){
        products(where:{
            id: {_eq: $id},
            shop_id: {_eq: $shop_id},
            created_by: {_eq: $admin_id}
        }){
            id
            name
            description
            public
            image
            qty
            shop{
                id
                name
            }
            category{
                id
                name
            }
            prices{
                id
                price
                currency
                default
            }
            created_at
        }
    }
`;

export default (props) => {

    const {user} = useAuth();

    const router = useRouter();

    return (
        user && user.id ? <Query
            query={GET_PRODUCT}
            variables={{
                id: props.product,
                shop_id: props.id,
                admin_id: user.id
            }}
            fetchPolicy="network-only"
        >
            {({loading, data, refetch}) => {

                // console.log(loading, data);

                return (
                    !loading && data.products && data.products.length ? <Container maxW="6xl">
                        <Head>
                            <title>Update Product</title>
                        </Head>
                        <ProductPage
                            {...props}
                            product={{
                                id: data.products[0].id,
                                name: data.products[0].name,
                                description: data.products[0].description,
                                category_id: data.products[0].category.id,
                                prices: data.products[0].prices,
                                image: data.products[0].image,
                                qty: data.products[0].qty || 0,
                                public: data.products[0].public
                            }}
                        />
                    </Container>: loading ? <Spinner />: <Flex>
                        <Box w={500} p={4} mx="auto">
                            <Heading textAlign="center" as="h6" size="lg" mb="16">
                                {error ? 'An error occurred' :'Not Found'}
                            </Heading>
                            {error ? <Button onClick={() =>refetch()}>
                                Retry
                            </Button> :null}
                        </Box>
                    </Flex>
                )

            }}
        </Query>: null
    );

}