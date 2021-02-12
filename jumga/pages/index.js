import React from 'react';
import Header from '../components/Header';
import {Box, Container, Flex, Input, InputGroup, InputLeftElement, Stack} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import ShopCard from '../components/ShopCard';
import {Query} from '@apollo/client/react/components';
import {gql} from '@apollo/client';
import Head from 'next/head';

const GET_HOME = gql`
    query{
		category{
            id
			name,
			slug
        }
        shops(where:{
			approved: {_eq: true}
        }){
            id
			name
			logo
        }
        products(where:{
			public: {_eq: true},
			shop: {
				approved: {_eq: true}
			}
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
// export { getServerSideProps } from '../utils/authenticated';

export default function Home() {

	// console.log('country:', country)
	
	return (

		<>
			<Header />
			<Head>
				<title>Jumga</title>
			</Head>
			<Box my={20}>
				<Container maxW="4xl" centerContent>
					<Flex
						justify="center"
						align="center"
						width="100%"
					>
						<form action="/search" method="GET" className="w-full">
							<InputGroup>
								<InputLeftElement
									pointerEvents="none"
									height="100%"
									children={<SearchIcon color="gray.300" />}
								/>
								<Input name="q" width="100%" placeholder="Search Jumga" size="lg" />
							</InputGroup>
						</form>
					</Flex>
				</Container>
			</Box>
			<Query
				query={GET_HOME}
				variables={{
					// country
				}}
				fetchPolicy="network-only"
			>
				{({loading, data, refetch, error}) => {

					console.log(error);

					const _products = (!loading && data && data.products ? data.products: []);
					const _shops = (!loading && data && data.shops ? data.shops: []);

					return (
						<>
							<Container maxW="6xl">
								<Box
									color="gray.800"
									fontWeight="bold"
									letterSpacing="wide"
									fontSize="xl"
									textTransform="uppercase"
									ml="3"
								>
									Categories
								</Box>
								<Box px={-3} py={-3}>
									<Flex wrap="wrap">
										{(!loading && data && data.category ? data.category: []).map((c) => {

											return (
												<CategoryCard
													key={c.id}
													name={c.name}
													id={c.id}
													slug={c.slug}
													width="25%"
													px={3}
													py={3}
												/>
											)

										})}
									</Flex>
								</Box>
							</Container>
							<Container maxW="6xl" my={20}>
								<Box
									color="gray.800"
									fontWeight="bold"
									letterSpacing="wide"
									fontSize="xl"
									textTransform="uppercase"
									ml="3"
								>
									Best Selling Products
								</Box>
								<Box px={-3} py={-3}>
									{!loading && !_products.length ? <Flex px={3} justifyContent="center" alignItems="center" my={10}>
										<Box>
											No products found.
										</Box>
									</Flex> :<Flex wrap="wrap">
										{_products.map((p) => {

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
									</Flex>}
								</Box>
							</Container>
							<Container maxW="6xl" my={20}>
								<Box
									color="gray.800"
									fontWeight="bold"
									letterSpacing="wide"
									fontSize="xl"
									textTransform="uppercase"
									ml="3"
								>
									Top Sellers
								</Box>
								<Box px={-3} py={-3}>
									<Flex wrap="wrap">
										{_shops.map((s) => {

											return (
												<ShopCard
													key={s.id}
													name={s.name}
													approved={s.approved}
													logo={s.logo}
													id={s.id}
													width="25%"
													px={3}
													py={3}
												/>
											)

										})}
									</Flex>
								</Box>
							</Container>

						</>
					);

				}}
			</Query>
		</>

	);

}
