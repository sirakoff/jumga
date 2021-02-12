import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import {svgs} from "../../components/CategoryCard";
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

const GET_CATEGORY = gql`
    query(
        $id: bigint!
    ){
        category: category_by_pk(id: $id){
            id
            name
            slug
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
            <Query
                query={GET_CATEGORY}
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

                    const category = data.category;



                    return (
                        !category ? <Box w={500} p={4} mx="auto" my={16}>
                            <Heading textAlign="center" as="h6" size="lg" mb="16">
                                Not Found
                            </Heading>
                        </Box>: <Container maxW="6xl" my={16}>
                            <Flex direction="column" justifyContent="center" alignItems="center" pb="16" mb={10} className="border-b">
                                <div className="mx-auto my-10 rounded-full bg-gray-200 w-28 h-28 flex items-center justify-center">
                                    {svgs[category.slug] || <svg className="text-gray-500 w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>}
                                </div>
                                <Head>
                                    <title>{category.name}</title>
                                </Head>
                                <Heading textAlign="center" as="h6" size="3xl">
                                    {category.name}
                                </Heading>
                                
                            </Flex>
                            <Flex wrap="wrap">
                                {category.products.map((p) => {

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