import {Query} from '@apollo/client/react/components';
import {gql} from '@apollo/client';

import { useAuth } from '../../../utils/auth';
import {
    Box,
    Flex,
    Heading,
    Container,
    Spinner,
    Button,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from '@chakra-ui/react';
import Header from '../../../components/Header';

const GET_SHOP = gql`
    query(
        $id: bigint!
        $admin_id: bigint!
    ){
        shops(where:{
            id: {_eq: $id},
            admin_id: {_eq: $admin_id}
        }){
            id
            name
            logo
            email
            phone
            account_number
            bank_code
            country
            location
            description
            approved
        }
    }
`;
import Head from 'next/head';
import { getServerSideProps as mainGetServerSideProps } from '../../../utils/authenticated';
import ShopUpdate from '../../../components/ShopUpdate';

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
            query={GET_SHOP}
            variables={{
                id: props.id,
                admin_id: user.id
            }}
            fetchPolicy="network-only"
        >
            {({loading, data, refetch, error}) => {

                // console.log(loading, data);

                return (

                    <Box>
                        <Head>
                            <title>Edit Shop</title>
                        </Head>
                        <Header />
                        
                        {!loading && data.shops && data.shops.length ? <Container maxW="6xl" my={20}>
                            <Breadcrumb mb={8}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/shops">Your Shops</BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem isCurrentPage>
                                    <BreadcrumbLink href="#">{data.shops[0].name}</BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <ShopUpdate
                                shop={data.shops[0]}
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
                        </Flex>}
                    </Box>

                )

            }}
        </Query>: null
    );

}