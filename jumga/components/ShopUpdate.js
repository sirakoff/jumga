import {Mutation} from '@apollo/client/react/components';
import {gql} from '@apollo/client';

import {
    onFileChange,
    uploadImage
} from '../utils/imageUpload';
import Dropzone from 'react-dropzone';

import { useAuth } from '../utils/auth';
import {
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Textarea,
    Stack,
    Button,
    Box,
    Badge,
    Heading,
    Select,
    Container,
    Flex,
    Spinner
} from '@chakra-ui/react';
import {useState} from 'react';
import { useRouter } from 'next/router';
import {SelectBank} from '../pages/shops/create';

export default ({
    shop
}) => {

    const [state, setState] = useState(shop);
    const [loading, setLoading] = useState(false);

    const {user} = useAuth();

    const router = useRouter();

    return (
        <>
            <Flex>
                <Box w={500} p={4} mx="auto">
                    <Heading textAlign="center" as="h6" size="lg" mb="16">
                        Update shop
                    </Heading>
                    <Dropzone
                        onDrop={(files) => {
                            
                            const file = onFileChange(files);

                            if (file) {

                                setLoading(true);

                                uploadImage(file, (url) => {

                                    setState({
                                        ...state,
                                        logo: url
                                    });

                                    setLoading(false);

                                });

                            }
                            
                        }}
                    >
                        {({getRootProps, getInputProps}) => (
                            <div className="mx-auto my-10 rounded-full bg-gray-200 w-28 h-28 flex items-center justify-center overflow-hidden" {...getRootProps()}>
                                <input {...getInputProps()} />
                                {loading ? <Spinner /> : state.logo ? <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{
                                    backgroundImage: `url(${state.logo})`
                                }}></div> : <svg className="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>}
                            </div>
                        )}
                    </Dropzone>
                    <Flex my="10" justifyContent="center" alignItems="center">
                        {state.approved ? <Badge colorScheme="green">APPROVED</Badge> :<Badge>NOT APPROVED</Badge>}
                    </Flex>
                    <FormControl textAlign="center">
                        {!state.approved ? <div className="mt-6">
                            <FormHelperText id="email-helper-text">
                                You are required to pay $20 for your shop to be approved.
                            </FormHelperText>
                            <Button onClick={() => {

                                window.FlutterwaveCheckout({
                                    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
                                    tx_ref: `shop_approval_${state.id}`,
                                    amount: 20,
                                    currency: "USD",
                                    country: state.country,
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
                                        logo: "",
                                    }
                                });

                            }} my="4" colorScheme="teal" size="xs">
                                Pay approval fee
                            </Button>
                        </div>: null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel htmlFor="name">Shop Name</FormLabel>
                        <Input
                            onChange={(e) => setState({
                                ...state,
                                name: e.target.value
                            })}
                            type="text"
                            id="name"
                            value={state.name}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="location">Shop Location</FormLabel>
                        <Input
                            onChange={(e) => setState({
                                ...state,
                                location: e.target.value
                            })}
                            type="text"
                            id="location"
                            value={state.location}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="description">Shop Description</FormLabel>
                        <Textarea
                            onChange={(e) => setState({
                                ...state,
                                description: e.target.value
                            })}
                            type="text"
                            id="description"
                            value={state.description}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="phone">Business Phone Number</FormLabel>
                        <Input
                            onChange={(e) => setState({
                                ...state,
                                phone: e.target.value
                            })}
                            type="text"
                            id="phone"
                            value={state.phone}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="phone">Business Email</FormLabel>
                        <Input
                            onChange={(e) => setState({
                                ...state,
                                email: e.target.value
                            })}
                            type="text"
                            id="phone"
                            value={state.email}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="country">Country</FormLabel>
                        <Select
                            isRequired
                            name="country"
                            disabled={true}
                            placeholder="Select Country"
                            defaultValue={state.country}
                            onChange={(e) => setState({
                                ...state,
                                country: e.target.value
                            })}
                        >
                            <option value="GH">Ghana</option>
                            {/* <option value="UK">United Kingdom</option> */}
                            <option value="NG">Nigeria</option>
                            <option value="KE">Kenya</option>
                        </Select>
                    </FormControl>
                    {state.country ? <FormControl isRequired my={4}>
                        <FormLabel htmlFor="bankCode">Bank</FormLabel>
                        <SelectBank
                            countryCode={state.country}
                            setBankCode={(bank_code) => setState({
                                ...state,
                                bank_code
                            })}
                            bankCode={state.bank_code}
                        />
                    </FormControl>: null}
                    {state.country && state.bank_code ? <FormControl isRequired my={4}>
                        <FormLabel htmlFor="accountNumber">Account Number</FormLabel>
                        <Input
                            onChange={(e) => setState({
                                ...state,
                                account_number: e.target.value
                            })}
                            type="text"
                            id="accountNumber"
                            value={state.account_number}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>: null}
                    {user ? <Stack justify="center" mt={6} isInline spacing={10}>
                        <Mutation
                            mutation={gql`

                                mutation(
                                    $id: bigint!,
                                    $logo: String,
                                    $name: String!,
                                    $phone: String!,
                                    $account_number: String!,
                                    $bank_code: String!,
                                    $country: String!,
                                    $location: String,
                                    $description: String,
                                    $email: String
                                ){
                                    update_shops_by_pk(pk_columns: {id: $id}, _set: {
                                        name: $name,
                                        location: $location,
                                        country: $country,
                                        description: $description,
                                        phone: $phone,
                                        logo: $logo,
                                        email: $email,
                                        account_number: $account_number,
                                        bank_code: $bank_code,
                                    }) {
                                        id
                                    }
                                }
                            
                            `}
                            variables={{
                                id: state.id,
                                logo: state.logo,
                                name: state.name,
                                phone: state.phone,
                                account_number: state.account_number,
                                bank_code: state.bank_code,
                                country: state.country,
                                location: state.location,
                                description: state.description,
                                email: state.email,
                            }}
                            onCompleted={() => {

                                router.push('/shops');

                            }}
                        >
                            {(save, {loading}) => (
                                <Button
                                    minWidth="40%"
                                    variant="solid"
                                    variantColor="blue"
                                    isDisabled={state.name === "" || !state.email  || !state.country || !state.bank_code || !state.account_number || !state.phone}
                                    isLoading={loading}
                                    onClick={() => {
                                        
                                        save();

                                    }}
                                >
                                    Update
                                </Button>
                            )}
                        </Mutation>
                    </Stack>: null}
                    
                </Box>
            </Flex>
        </>
    )

}