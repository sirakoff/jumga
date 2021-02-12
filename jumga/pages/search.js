import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import {Query} from '@apollo/client/react/components';
import {gql} from '@apollo/client';
import {
    Box,
    Flex,
    Heading,
    Container,
    Spinner,
    InputGroup,
    InputLeftElement,
    Input
    
} from '@chakra-ui/react';
import Head from 'next/head';
import {useState} from 'react';
import {SearchIcon} from '@chakra-ui/icons';

const GET_CATEGORY = gql`
    query(
        $q: String!
    ){
        products(where:{
            name: {_ilike: $q},
            description: {_ilike: $q},
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
`;

export const getServerSideProps = async (context) => {

    // console.log(context);

    return {
        props: {
            query: context?.query?.q || ''
            // ...props,
        }
    }


}

export default (props) => {

    const [q, setQ] = useState(props.query || '');

    return (
        <>
            <Header />
            <Head>
				<title>Search</title>
			</Head>
            <Box mt={24}>
                <Container maxW="4xl" centerContent>
                    <Heading textAlign="center" as="h6" size="3xl" mb={10}>
                        Search Jumga
                    </Heading>
                    <Flex
                        justify="center"
                        align="center"
                        width="100%"
                    >
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents="none"
                                height="100%"
                                children={<SearchIcon color="gray.300" />}
                            />
                            <Input
                                width="100%"
                                placeholder="Search Jumga"
                                size="lg"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </InputGroup>
                    </Flex>
                </Container>
            </Box>
            <Query
                query={GET_CATEGORY}
                variables={{
                    q: `%${q}%`
                }}
                skip={!q}
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

                    const products = data && data.products ? data.products: [];



                    return (
                        <Container maxW="6xl" my={24}>
                            {q ? <Heading textAlign="center" as="h6" size="sm" mb={10}>
                                {!products.length ? `No products found for '${q}'` :`Search results for '${q}'`}
                            </Heading>: null}
                            <Flex wrap="wrap">
                                {products.map((p) => {

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