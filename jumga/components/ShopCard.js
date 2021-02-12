import {Box, Flex, Badge, Button} from '@chakra-ui/react';
import Link from 'next/link';
import { useAuth } from '../utils/auth';

export default function ShopCard({
    width = 'auto',
    mx = 0,
    my = 0,
    px = 0,
    py = 0,
    id,
    name,
    approved,
    country,
    isEdit,
    logo
}) {

    const {user} = useAuth();

    return (
        
        <Box width={width} mx={mx} my={my} px={px} py={py} cursor="pointer">
            <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                paddingTop="5"
                paddingBottom="5"
                borderWidth="1px"
                borderRadius="lg"
                className="h-96"
            >
                <Link href={isEdit ? `/shops/${id}/edit`: `/shops/${id}`}>
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="relative rounded-full bg-gray-200 w-28 h-28 flex items-center justify-center overflow-hidden">
                                {logo ? <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{
                                    backgroundImage: `url(${logo})`
                                }}></div>:<svg className="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>}
                            </div>
                            {/* {isEdit ? <div className="absolute top-0 rounded-full px-1 right-0 bg-red-500 text-white text-sm">
                                100
                            </div> : null} */}
                        </div>
                        <Box className="font-medium text-lg mt-4">
                            {name}
                        </Box>
                        {isEdit ? <Box>
                            {approved ? <Badge colorScheme="green">APPROVED</Badge> :<Badge>NOT APPROVED</Badge>}
                        </Box> : null}
                    </div>
                </Link>
                <Box>
                    {!approved && isEdit ? <Button onClick={() => {

                        window.FlutterwaveCheckout({
                            public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
                            tx_ref: `shop_approval_${id}`,
                            amount: 20,
                            currency: "USD",
                            country,
                            // payment_options: "card,mobilemoney,ussd",
                            customer: {
                                email: user.email,
                                // phone_number: "08102909304",
                                // name: "yemi desola",
                            },
                            callback: function (data) { // specified callback function
                                console.log(data);
                            },
                            customizations: {
                                title: "Jumga Inc.",
                                description: "Shop approval fee.",
                                logo: "percentage",
                            }
                        });

                    }} my="4" colorScheme="teal" size="xs">
                        Pay approval fee
                    </Button>: null}
                </Box>
                {isEdit ? <Flex direction="column" justifyContent="center" alignItems="center" mt={4}>
                    <div className="my-1">
                        <Link href={`/shops/${id}/products`}>
                            View Products
                        </Link>
                    </div>
                    <div className="my-1">
                        <Link href={`/shops/${id}/orders`}>
                            View Orders
                        </Link>
                    </div>
                </Flex>: null}
            </Flex>
        </Box>
    )

}