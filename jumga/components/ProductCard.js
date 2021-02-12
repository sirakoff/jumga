import React, { useContext } from 'react';
import {Box, Image, Badge, ButtonGroup, Button, IconButton, useToast} from '@chakra-ui/react';
import {MinusIcon, AddIcon} from '@chakra-ui/icons';
import Link from 'next/link';
import { symbols } from '../pages/shops/[id]/product/create';
import currencyFormat from 'mout/number/currencyFormat';
import moment from 'moment';
import {CurrencyContext} from '../utils/contexts/Currency';

import { useDispatch, useSelector } from 'react-redux'
import { CountryContext } from '../utils/contexts/Country';


function ProductCard({
    width = 'auto',
    mx = 0,
    my = 0,
    px = 0,
    py = 0,
    id,
    name,
    category,
    image,
    prices,
    createdAt,
    shopId,
    shop,
    isEdit,
    availableQty = 0
}) {

    const date = moment(createdAt);
    const isTwoWeeksOld = !(date.isAfter(moment().subtract(1, 'days').startOf('day')));

    const {currency} = useContext(CurrencyContext);
    const {country} = useContext(CountryContext);

    const deliversToCountry = shop.dispatch && shop.dispatch[`rate_${country.toLowerCase()}`] > 0;

    const defaultPrice = prices.filter((p) => {
        
        return isEdit ? p.default: p.currency === currency;
    
    
    })[0];


    const cartQty = useSelector((state) => state[id]);


    const dispatch = useDispatch();

    const increment = () => {

        return dispatch({
            type: 'INCREMENT',
            productId: id,
        });

    };

    const decrement = () => {

        return dispatch({
            type: 'DECREMENT',
            productId: id,
        })

    };

    const toast = useToast();
  
    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" className="h-84">
            {/* <Image src={image} alt={name} /> */}
            <div className="relative bg-center bg-no-repeat bg-cover h-48 w-full" style={{
                backgroundImage: `url(${image})`
            }}>
                {!isEdit ? <div className="absolute bottom-4 right-4">

                    <Link href={`/shops/${shopId}`}>
                        <Badge isTruncated maxW={32}>
                            {shop.name}
                        </Badge>
                    </Link>

                </div>:null}
            </div>
    
            <Box p="3">
                <Box d="flex" alignItems="baseline">
                    {!isTwoWeeksOld ? <Badge borderRadius="full" px="2" colorScheme="teal">
                        New
                    </Badge>: null}
                    {deliversToCountry ? <Badge ml={1} borderRadius="full" px="2" colorScheme="teal">
                        Delivers to {country}
                    </Badge>: null}
                    {/* <Box
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                        ml="2"
                    >
                        {property.beds} beds &bull; {property.baths} baths
                    </Box> */}
                </Box>
        
                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                >
                    {name}
                </Box>

                <Box
                    // mt="1"
                    color="gray.400"
                    // fontWeight="semibold"
                    fontSize="sm"
                    lineHeight="tight"
                    isTruncated
                >
                    {category}
                </Box>
        
                <Box>
                    {symbols[defaultPrice.currency]} {currencyFormat(defaultPrice.price)}
                </Box>

                {!isEdit ? availableQty > 0 ? <ButtonGroup size="sm" isAttached variant="outline" mt={3}>
                    <IconButton aria-label="Remove from cart" icon={<MinusIcon />} onClick={() => decrement()} />
                    <Button mr="-px" disabled={true}>{cartQty || 0}</Button>
                    <IconButton aria-label="Add to cart" icon={<AddIcon />} onClick={() => {

                        if (deliversToCountry) {
                        
                            if ((cartQty || 0) < availableQty) increment()

                        } else {

                            toast({
                                title: `Not Available in ${country}`,
                                description: `${shop.name} is unable to delivery to ${country}`,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                            })

                        }
                        
                        
                    }} />
                </ButtonGroup>: <Badge colorScheme="red">OUT OF STOCK</Badge>: null}
            </Box>
        </Box>
    )
  }

  export default (props) => {

    return (
        props.isEdit ? <Link href={`/shops/${props.shopId}/product/${props.id}`}>
            <Box as="a" position="relative" width={props.width} mx={props.mx} my={props.my} px={props.px} py={props.py} cursor="pointer">
                <ProductCard {...props} />
            </Box>
        </Link>: <Box position="relative" width={props.width} mx={props.mx} my={props.my} px={props.px} py={props.py} cursor="pointer">
            <ProductCard {...props} />
        </Box>
    )

  }