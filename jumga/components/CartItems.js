import gql from "graphql-tag"
import {Query, Mutation} from '@apollo/client/react/components';
import {
    Box,
    Flex,
    DrawerBody,
    DrawerFooter,
    ButtonGroup,
    Button,
    IconButton,
    FormControl,
    FormLabel,
    Input,
    useToast
} from '@chakra-ui/react';
import {
    ChevronLeftIcon
} from '@chakra-ui/icons'

import {MinusIcon, AddIcon} from '@chakra-ui/icons';

import { useSelector, useDispatch } from 'react-redux'

import {useContext, useState} from 'react';
import {CurrencyContext} from '../utils/contexts/Currency';
import {CountryContext} from '../utils/contexts/Country';

import { symbols } from '../pages/shops/[id]/product/create';
import currencyFormat from 'mout/number/currencyFormat';
import { sumBy, groupBy, fromPairs, toPairs, sum, values } from "lodash";
import { useAuth } from "../utils/auth";
import { useRouter } from "next/router";
import Login from "../pages/login";

const CartItem = ({
    item
}) => {


    const {currency} = useContext(CurrencyContext)

    const defaultPrice = item.prices.filter((p) => {
        
        return p.currency === currency;
    
    
    })[0];

    const qty = useSelector((state) => state[item.id]);

    const dispatch = useDispatch();

    const increment = () => {

        return dispatch({
            type: 'INCREMENT',
            productId: item.id,
        });

    };

    const decrement = () => {

        return dispatch({
            type: 'DECREMENT',
            productId: item.id,
        })

    };

    return (

        <Box py={3}>
            <Flex>
                <Box w="32" h={32}>
                    <div className="bg-center bg-no-repeat bg-cover h-full w-full rounded-lg border" style={{
                        backgroundImage: `url(${item.image})`
                    }}></div>
                </Box>
                <Box px={4}>
                    <Box mb={2}>
                        <Box
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated
                        >
                            {item.name}
                        </Box>
                        <Box
                            color="gray.400"
                            // fontWeight="semibold"
                            fontSize="sm"
                            lineHeight="tight"
                            isTruncated
                        >
                            {item.description}
                        </Box>
                        <Box
                            color="gray.400"
                            // fontWeight="semibold"
                            fontSize="sm"
                            lineHeight="tight"
                            isTruncated
                        >
                            {item.shop.name} · {item.category.name}
                        </Box>
                    </Box>
                    <Box>
                        {symbols[defaultPrice.currency]} {currencyFormat(defaultPrice.price)}
                    </Box>
                    <ButtonGroup size="sm" isAttached variant="outline" mt={3}>
                        <IconButton aria-label="Remove from cart" icon={<MinusIcon />} onClick={() => decrement()} />
                        <Button mr="-px" disabled={true}>{qty || 0}</Button>
                        <IconButton aria-label="Add to cart" icon={<AddIcon />} onClick={() => {
                            
                            if (qty < item.qty) increment()
                            
                        }} />
                    </ButtonGroup>
                </Box>
            </Flex>
        </Box>

    )

}

export default ({
    products
}) => {

    const {currency} = useContext(CurrencyContext);
    const {country} = useContext(CountryContext);
    const [checkout, setCheckout] = useState(false);

    const {user} = useAuth();

    const [name, setName] = useState(user.displayName);
    const [phone, setPhone] = useState('');


    const dispatch = useDispatch();

    const toast = useToast();

    return (
        
        <Query
            query={gql`

                query(
                    $ids: [bigint!]
                ){

                    products(where:{
                        id: {_in: $ids},
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
            
            `}
            variables={{
                ids: Object.keys(products)
            }}
        >
            {({loading, error, data, refetch}) => {

                const _products = (!loading && data && data.products ? data.products: []);


                const subTotal = sumBy(_products, (p) => {

                    return p.prices.filter((p) => p.currency === currency)[0].price * products[p.id];

                });

                const totalDelivery = sumBy(_products, (p) => {

                    return p.shop.dispatch[`rate_${country.toLowerCase()}`];

                });

                const total = subTotal + totalDelivery;


                let subtotalByShop = fromPairs(toPairs(groupBy(_products, (p) => p.shop.subaccount_id)).map((k) => {

                    return [
                        k[0],
                        sumBy(k[1], (p) => {

                            return p.prices.filter((p) => p.currency === currency)[0].price * products[p.id];
        
                        })
                    ];

                }).map((k) => {

                    return [
                        k[0],
                        {
                            value: k[1],
                            percentage: (k[1] / total) * 100
                        }
                    ]

                }));

                let totalDeliveryByShop = fromPairs(toPairs(groupBy(_products, (p) => p.shop.dispatch.subaccount_id)).map((k) => {

                    return [
                        k[0],
                        sumBy(k[1], (p) => {

                            return p.shop.dispatch[`rate_${country.toLowerCase()}`];
        
                        })
                    ];

                }).map((k) => {

                    return [
                        k[0],
                        {
                            value: k[1],
                            percentage: (k[1] / total) * 100
                        }
                    ]

                }));


                // console.log(subtotalByShop, totalDeliveryByShop);


                const subaccounts = toPairs({
                    ...subtotalByShop,
                    ...totalDeliveryByShop
                }).map((k) => {

                    return {
                        id: k[0],
                        transaction_split_ratio: k[1].percentage / 10
                    };

                });

                // console.log(subaccounts);

                const router = useRouter();

                

                return (

                    <>
                        <DrawerBody>
                            {checkout ? <Box>
                                <Button
                                    _hover={{ bg: "#fff" }}
                                    px={0}
                                    border="0px"
                                    leftIcon={<ChevronLeftIcon />}
                                    onClick={() => setCheckout(false)}
                                    colorScheme="teal"
                                    variant="outline"
                                >
                                    Back
                                </Button>
                                {!user ? <Login embed={true} /> : <Box my={8}>
                                    <FormControl isRequired my={4}>
                                        <FormLabel htmlFor="email">Full Name</FormLabel>
                                        <Input
                                            onChange={(e) => setName(e.target.value)}
                                            type="text"
                                            id="email"
                                            value={name}
                                            aria-describedby="text-helper-text"
                                        />
                                    </FormControl>
                                    <FormControl isRequired my={4}>
                                        <FormLabel htmlFor="phone">Phone Number</FormLabel>
                                        <Input
                                            onChange={(e) => setPhone(e.target.value)}
                                            type="text"
                                            id="phone"
                                            value={phone}
                                            aria-describedby="text-helper-text"
                                        />
                                    </FormControl>
                                </Box>}
                            </Box> :_products.map((p) => {

                                return (
                                    <CartItem item={p} />
                                )

                            }) }
                        </DrawerBody>
                        <DrawerFooter flexDirection="column" w="full">
                            <Box my={10} w="full">
                                <Flex justifyContent="space-between" alignItems="center" py={3} borderBottomWidth={1}>
                                    <Box fontSize="lg">
                                        Sub Total
                                    </Box>
                                    <Box fontSize="lg">
                                        {symbols[currency]} {currencyFormat(subTotal)}
                                    </Box>
                                </Flex>
                                <Flex justifyContent="space-between" alignItems="center" py={3} borderBottomWidth={1}>
                                    <Box fontSize="lg">
                                        Delivery
                                    </Box>
                                    <Box fontSize="lg">
                                        {symbols[currency]} {currencyFormat(totalDelivery)}
                                    </Box>
                                </Flex>
                                <Flex justifyContent="space-between" alignItems="center" py={3}>
                                    <Box fontSize="lg" fontWeight="bold">
                                        Total
                                    </Box>
                                    <Box fontSize="lg" fontWeight="bold">
                                        {symbols[currency]} {currencyFormat(total)}
                                    </Box>
                                </Flex>
                            </Box>
                            <Mutation
                                mutation={gql`

                                    mutation (
                                        $user_id: bigint,
                                        $currency: String!,
                                        $country: String!,
                                        $customer_name: String!,
                                        $customer_phone: String!,
                                        $subtotal: float8!,
                                        $total: float8!,
                                        $total_delivery: float8!,
                                        $total_qty: Int!,
                                        $items: [order_items_insert_input!]!
                                    ) {
                                        order: insert_orders_one(object: {
                                            currency: $currency,
                                            country: $country,
                                            customer_name: $customer_name,
                                            customer_phone: $customer_phone,
                                            subtotal: $subtotal,
                                            total: $total,
                                            total_delivery: $total_delivery,
                                            total_qty: $total_qty,
                                            user_id: $user_id,
                                            items: {
                                                data: $items
                                            }
                                        }) {
                                            id
                                        }
                                        ${_products.map((p) => {

                                            return (
                                                `update_product_${p.id}: update_products_by_pk(
                                                    _inc: {qty: -${products[p.id]}
                                                }, pk_columns: {id: ${p.id}}) {
                                                    id
                                                }`
                                            );

                                        })}
                                    }
                                
                                `}
                                variables={{
                                    currency,
                                    country,
                                    customer_name: name,
                                    customer_phone: phone,
                                    subtotal: subTotal,
                                    total,
                                    total_delivery: totalDelivery,
                                    total_qty: sum(values(products)),
                                    user_id: user ? user.id: null,
                                    items: _products.map((p) => {

                                        const defaultPrice = p.prices.filter((p) => p.currency === currency)[0].price;

                                        return {
                                            price: defaultPrice,
                                            product_id: p.id,
                                            qty: products[p.id],
                                            total: defaultPrice * products[p.id]
                                        };

                                    })
                                }}
                                onCompleted={(data) => {

                                    dispatch({
                                        type: 'RESET'
                                    });

                                    window.FlutterwaveCheckout({
                                        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
                                        tx_ref: `order_${data.order.id}`,
                                        amount: total,
                                        currency,
                                        country,
                                        // payment_options: "card,ussd,barter",
                                        customer: {
                                            email: user.email,
                                            phonenumber: phone,
                                            name,
                                        },
                                        subaccounts,
                                        callback: function (data) {
                                          
                                            // console.log(data);

                                            router.push(`/orders/${data.order.id}`);



                                        },
                                        customizations: {
                                            title: "Jumga Inc.",
                                            description: "No. 1 Online Marketplace in Africa",
                                            logo: "",
                                        },
                                    });

                                }}
                            >
                                {(pay, {loading}) => (

                                    <Button
                                        colorScheme="teal"
                                        variant="outline"
                                        isLoading={loading}
                                        disabled={checkout && (!user || !user.id)}
                                        onClick={() => {

                                            if (!checkout) {

                                                setCheckout(true);

                                            } else {

                                                if (!user || !user.id) {

                                                    return;
    
                                                }
    
                                                if (!name || !phone) {
    
                                                    toast({
                                                        title: "All fields are required",
                                                        description: "Fullname & Phone number fields are required",
                                                        status: "error",
                                                        duration: 5000,
                                                        isClosable: true,
                                                    });
    
                                                }

                                                pay();

                                            }

                                        }}
                                    >
                                        {checkout ? `Pay ${symbols[currency]} ${currencyFormat(total)}` : 'Continue to checkout'}
                                    </Button>

                                )}
                            </Mutation>
                        </DrawerFooter>
                    </>

                )

            }}
        </Query>
    )

}