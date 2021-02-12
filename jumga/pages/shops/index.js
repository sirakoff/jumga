import {Query} from '@apollo/client/react/components';
import {gql} from '@apollo/client';

import { useAuth } from '../../utils/auth';
import {Box, Heading, Container, Flex, Button} from '@chakra-ui/react';
import Header from '../../components/Header';
import ShopCard from '../../components/ShopCard';
import { useRouter } from 'next/router';
import Head from 'next/head';

const GET_SHOPS = gql`
    query(
        $admin_id: bigint!
    ){
        shops(where:{
            admin_id: {_eq: $admin_id}
        }){
            id
            name
            logo
            approved
            country
        }
    }
`;

export { getServerSideProps } from '../../utils/authenticated';

export default () => {

    const {user} = useAuth();

    const router = useRouter();

    return (
        user && user.id ? <Query
            query={GET_SHOPS}
            variables={{
                admin_id: user.id
            }}
            fetchPolicy="network-only"
        >
            {({loading, data, refetch}) => {

                console.log(loading, data);

                return (

                    <Box>
                        <Head>
                            <title>Your Shops</title>
                        </Head>
                        <Header />
                        
                        <Container maxW="6xl" my={20}>
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
                            <Flex justifyContent="space-between" alignItems="center" mb={8}>
                                <Heading textAlign="center" size="xl">
                                    Your Shops
                                </Heading>
                                <Box>
                                    <Button colorScheme="teal" onClick={() => router.push('/shops/create')}>
                                        Create a shop
                                    </Button>    
                                </Box>
                            </Flex>
                            
                            <Box px={-3} py={-3}>
                                
                                {!loading && data && data.shops && data.shops.length ? <Flex wrap="wrap">
                                    {data.shops.map((s) => {

                                        return (

                                            <ShopCard
                                                key={s.id}
                                                name={s.name}
                                                approved={s.approved}
                                                logo={s.logo}
                                                isEdit={true}
                                                id={s.id}
                                                country={s.country}
                                                width="25%"
                                                px={3}
                                                py={3}
                                            />

                                        )

                                    })}
                                </Flex>: <Flex direction="column" justifyContent="center" alignItems="center" my={6}>
                                    <Box>
                                        <Button colorScheme="teal" onClick={() => router.push('/shops/create')}>
                                            Create a shop
                                        </Button>    
                                    </Box>
                                </Flex>}
                            </Box>
                        </Container>
                    </Box>

                )

            }}
        </Query>: null
    );

}