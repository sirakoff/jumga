import Header from "../../../components/Header";
import ProductCard from "../../../components/ProductCard";
import {Query} from '@apollo/client/react/components';
import {gql} from '@apollo/client';
import {
    Box,
    Flex,
    Heading,
    Container,
    Spinner,
    Badge,
    
} from '@chakra-ui/react';
import Head from 'next/head';

const GET_SHOP = gql`
    query(
        $id: bigint!
    ){
        shop: shops_by_pk(id: $id){
            id
            name
            country
            location
            description
            approved
            logo
            products(where:{
                public: {_eq: true}
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
                    dispatch{
                        id
                        rate_gh
                        rate_ke
                        rate_ng
                        rate_uk
                    }
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
    }
`;

export const getServerSideProps = async (context) => {

    return {
        props: {
            id: context.params.id
        }
    }


}

export default (props) => {

    return (
        <>
            <Header />
            <Head>
                <title>Jumga</title>
            </Head>
            <Query
                query={GET_SHOP}
                variables={{
                    id: props.id
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

                    const shop = data.shop;



                    return (
                        !shop ? <Box w={500} p={4} mx="auto" my={16}>
                            <Heading textAlign="center" as="h6" size="lg" mb="16">
                                Not Found
                            </Heading>
                        </Box>: <Container maxW="6xl" my={16}>
                            <Head>
                                <title>{shop.name}</title>
                            </Head>
                            <Flex direction="column" justifyContent="center" alignItems="center" pb="16" mb={10} className="border-b">
                                <div className="mx-auto my-10 rounded-full bg-gray-200 w-28 h-28 flex items-center justify-center overflow-hidden">
                                    {shop.logo ? <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{
                                        backgroundImage: `url(${shop.logo})`
                                    }}></div>:<svg className="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>}
                                </div>
                                <Heading textAlign="center" as="h6" size="3xl">
                                    {shop.name}
                                </Heading>
                                <Box my={4}>
                                    {shop.approved ? <Badge colorScheme="green">APPROVED</Badge> :<Badge>NOT APPROVED</Badge>}
                                </Box>
                                <Box my={4}>
                                    <Box
                                        color="gray.400"
                                        // fontWeight="semibold"
                                        fontSize="sm"
                                        lineHeight="tight"
                                        isTruncated
                                    >
                                        {shop.description}
                                    </Box>
                                    <Flex
                                        my={4}
                                        color="gray.400"
                                        // fontWeight="semibold"
                                        fontSize="sm"
                                        lineHeight="tight"
                                        isTruncated
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Box mr={2}>
                                            <svg className="w-5 h-f text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </Box>
                                        <Box>
                                            {shop.location}
                                        </Box>
                                    </Flex>
                                </Box>
                            </Flex>
                            <Flex wrap="wrap">
                                {shop.products.map((p) => {

                                    return (

                                        
                                            <ProductCard
                                                key={p.id}
                                                name={p.name}
                                                shopId={p.shop.id}
                                                shop={p.shop}
                                                category={p.category.name}
                                                prices={p.prices}
                                                createdAt={p.created_at}
                                                image={p.image}
                                                availableQty={p.qty}
                                                isEdit={false}
                                                id={p.id}
                                                width="25%"
                                                px={3}
                                                py={3}
                                            />

                                    )

                                })}
                            </Flex>
                        </Container>
                    )

                }}
            </Query>
        </>
    );

}