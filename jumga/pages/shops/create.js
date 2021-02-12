import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import firebaseClient from "../../utils/firebase/client";
import firebase from "firebase/app";
import "firebase/auth";
import {
    Box,
    Flex,
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Stack,
    Button,
    Select,
    Heading,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    useToast,
} from "@chakra-ui/react";
import Head from 'next/head';
import Header from "../../components/Header";
import gql from "graphql-tag";
import { useAuth } from "../../utils/auth";
import {Mutation} from '@apollo/client/react/components'
import { useRouter } from "next/router";
import useAxios from 'axios-hooks';
import { parseCookies } from "nookies";


export { getServerSideProps } from '../../utils/authenticated';


export const SelectBank = ({
    countryCode,
    bankCode,
    setBankCode
}) => {

    // console.log(countryCode);

    const cookies = parseCookies();

    const [{ data, loading, error }, refetch] = useAxios(
        {
            url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/banks/${countryCode}`,
            method: 'GET',
            headers: {
                authorization: `Bearer ${cookies.token}`
            }
        }
    );

    useEffect(() => {

        if (!bankCode && data) {

            setBankCode(data.data[0].code);

        }

    }, [data]);
    
    return (
        <Fragment>
            <Select
                name="bankCode"
                value={bankCode}
                onChange={(e) => {
                    
                    setBankCode(e.target.value);
                
                }}
                
            >
                {loading ? <option>Loading Banks</option> : !error ? data.data.map((b) => {

                    return (
                        <option key={b.id} value={b.code}>{b.name}</option>
                    )

                }): <option>Unable to Fetch Banks</option>}
            </Select>
            {error ? <button onClick={refetch}>refetch</button>: null}
        </Fragment>

    )

}


export default () => {

    const [name, setName] = useState('');
    const [country, setCountry] = useState('GH');
    const [bankCode, setBankCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const {user} = useAuth();

    const router = useRouter();

    // console.log(user);

    return (
        <>
            <Head>
				<title>Create Shop</title>
			</Head>
            <Header />
            <Flex>
                <Box w={500} p={4} my={12} mx="auto">
                    <Breadcrumb mb={8}>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/shops">Your Shops</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink href="#">Create Shop</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Heading textAlign="center" as="h6" size="lg" mb="16">
                        Create a shop
                    </Heading>
                    <FormControl isRequired>
                        <FormLabel htmlFor="name">Shop Name</FormLabel>
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            id="name"
                            value={name}
                            aria-describedby="text-helper-text"
                        />
                        <FormHelperText id="email-helper-text">
                            You are required to pay $20 for your shop to be approved.
                        </FormHelperText>
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="phone">Business Phone Number</FormLabel>
                        <Input
                            onChange={(e) => setPhone(e.target.value)}
                            type="text"
                            id="phone"
                            value={phone}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="phone">Business Email</FormLabel>
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            id="phone"
                            value={email}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="country">Country</FormLabel>
                        <Select
                            isRequired
                            name="country"
                            placeholder="Select Country"
                            defaultValue={country}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            <option value="GH">Ghana</option>
                            {/* <option value="UK">United Kingdom</option> */}
                            <option value="NG">Nigeria</option>
                            <option value="KE">Kenya</option>
                        </Select>
                    </FormControl>
                    {country ? <FormControl isRequired my={4}>
                        <FormLabel htmlFor="bankCode">Bank</FormLabel>
                        <SelectBank
                            countryCode={country}
                            setBankCode={setBankCode}
                            bankCode={bankCode}
                        />
                    </FormControl>: null}
                    {country && bankCode ? <FormControl isRequired my={4}>
                        <FormLabel htmlFor="accountNumber">Account Number</FormLabel>
                        <Input
                            onChange={(e) => setAccountNumber(e.target.value)}
                            type="text"
                            id="accountNumber"
                            value={accountNumber}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>: null}
                    {user ? <Stack justify="center" mt={6} isInline spacing={10}>
                        <Mutation
                            mutation={gql`

                                mutation(
                                    $name: String!,
                                    $admin_id: bigint!,
                                    $phone: String!,
                                    $email: String!,
                                    $account_number: String!,
                                    $bank_code: String!,
                                    $country: String!
                                ){
                                    shop: insert_shops_one(object: {
                                        admin_id: $admin_id,
                                        name: $name,
                                        phone: $phone,
                                        email: $email,
                                        account_number: $account_number,
                                        bank_code: $bank_code,
                                        country: $country
                                    }) {
                                        id
                                    }
                                    ${user && user.role === 'user' ? `update_users_by_pk(pk_columns: {
                                        id: $admin_id
                                    }, _set: {
                                        role: "merchant"
                                    }) {
                                        id
                                    }`: ''}
                                }
                            
                            `}
                            variables={{
                                admin_id: user.id,
                                name,
                                phone,
                                account_number: accountNumber,
                                bank_code: bankCode,
                                country,
                                email
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
                                    isDisabled={name === "" || !email || !country || !bankCode || !accountNumber || !phone}
                                    isLoading={loading}
                                    onClick={() => {
                                        
                                        save();

                                    }}
                                >
                                    Create
                                </Button>
                            )}
                        </Mutation>
                    </Stack>: null}
                </Box>
            </Flex>
        </>

    );

}