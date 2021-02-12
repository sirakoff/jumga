import {Query} from '@apollo/client/react/components';
import {gql} from '@apollo/client';
import Header from '../../../components/Header';

import { useAuth } from '../../../utils/auth';
import {
    Box,
    Heading,
    Container,
    Flex,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink
} from '@chakra-ui/react';

import { getServerSideProps as mainGetServerSideProps } from '../../../utils/authenticated';
import ProductCard from '../../../components/ProductCard';
import Link from 'next/link';
import Head from 'next/head';

const GET_PRODUCTS = gql`
    query(
        $id: bigint!,
        $admin_id: bigint!
    ){
        shops(where:{
            id: {_eq: $id},
            admin_id: {_eq: $admin_id}
        }){
            id
            name
        }
        products(where:{
            shop_id: {_eq: $id},
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
                default
                currency
            }
            created_at
        }
    }
`;

export const getServerSideProps = async (context) => {

    const {props} = await mainGetServerSideProps(context);

    return {
        props: {
            ...props,
            id: context.params.id
        }
    }


}

export default (props) => {

    const {user} = useAuth();

    return (
        user && user.id ? <Query
            query={GET_PRODUCTS}
            variables={{
                id: props.id,
                admin_id: user.id
            }}
            fetchPolicy="network-only"
        >
            {({loading, data, refetch}) => {

                // console.log(loading, data);

                const shop = !loading && data && data.shops && data.shops.length ? data.shops[0]: null;

                return (
                    <Box>
                        <Header />
                        
                        {shop ? <Container maxW="6xl" my={20}>
                            {/* <Box
                                color="gray.800"
                                fontWeight="bold"
                                letterSpacing="wide"
                                fontSize="xl"
                                textTransform="uppercase"
                                ml="3"
                            >
                                Top Sellers
                            </Box> */}
                            <Head>
                                <title>{shop.name}'s Products</title>
                            </Head>
                            <Breadcrumb mb={8}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/shops">Your Shops</BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem isCurrentPage>
                                    <BreadcrumbLink href={`/shops/${shop.id}/products`}>{shop.name}'s Products</BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <Heading textAlign="center" size="xl" mb={8}>
                                {shop.name}'s Products
                            </Heading>
                            <Box px={-3} py={-3}>
                                
                                <Flex wrap="wrap">
                                    {(!loading && data && data.products ? data.products: []).map((p) => {

                                        return (

                                            
                                                <ProductCard
                                                    key={p.id}
                                                    name={p.name}
                                                    shopId={props.id}
                                                    category={p.category.name}
                                                    prices={p.prices}
                                                    createdAt={p.created_at}
                                                    image={p.image}
                                                    isEdit={true}
                                                    shop={p.shop}
                                                    id={p.id}
                                                    width="25%"
                                                    px={3}
                                                    py={3}
                                                />

                                        )

                                    }).concat([
                                        <Link href={`/shops/${props.id}/product/create`}>
                                            <Box width={'25%'} px={3} py={3} cursor="pointer">
                                                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" className="h-84">
                                                    <Flex direction="column" justifyContent="center" alignItems="center" h="full" px={4}>
                                                        <svg className="text-black w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        <Box mt={4}>
                                                            Create a new product
                                                        </Box>
                                                    </Flex>
                                                </Box>
                                            </Box>
                                        </Link>
                                    ])}
                                </Flex>
                            </Box>
                        </Container>: null}
                    </Box>
                )

            }}
        </Query>: null

    );

}