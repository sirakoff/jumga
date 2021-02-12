import React, { useState, useEffect, Fragment } from "react";
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
    Checkbox,
    Heading,
    Spinner,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from "@chakra-ui/react";
import Header from "../../../../components/Header";
import gql from "graphql-tag";
import { useAuth } from "../../../../utils/auth";
import {Mutation, Query} from '@apollo/client/react/components'
import { useRouter } from "next/router";
import {
    onFileChange,
    uploadImage
} from '../../../../utils/imageUpload';

import { getServerSideProps as mainGetServerSideProps } from '../../../../utils/authenticated';

import Dropzone from 'react-dropzone';
import Head from 'next/head';
import { some } from "lodash";

export const getServerSideProps = async (context) => {

    const {props} = await mainGetServerSideProps(context);

    return {
        props: {
            ...props,
            id: context.params.id
        }
    }


}

export const symbols = {
    'NGN': '₦',
    'GHS': 'GH₵',
    'GBP': '£',
    'KES': 'Ksh'
}


const CREATE_PRODUCT = gql`

    mutation(
        $name: String!,
        $description: String!,
        $admin_id: bigint!,
        $category_id: bigint!,
        $shop_id: bigint!,
        $public: Boolean,
        $image: String,
        $qty: Int,
        $prices: [product_prices_insert_input!]!
    ){
        insert_products_one(object: {
            category_id: $category_id,
            created_by: $admin_id,
            description: $description,
            name: $name,
            public: $public,
            image: $image,
            qty: $qty,
            prices: {
                data: $prices
            },
            shop_id: $shop_id
        }) {
            id
        }
    }

`;

const UPDATE_PRODUCT = `
    update_products_by_pk(pk_columns: {
        id: $id
    }, _set: {
        category_id: $category_id,
        description: $description,
        name: $name,
        public: $public,
        image: $image,
        qty: $qty
    }) {
        id
    }

`;


export default (props) => {

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(props.product ? props.product.image:'');
    const [qty, setQty] = useState(props.product ? props.product.qty:1);
    const [pub, setPublic] = useState(props.product ? props.product.public:'');
    const [name, setName] = useState(props.product ? props.product.name:'');
    const [description, setDescription] = useState(props.product ? props.product.description :'');
    const [category, setCategory] = useState(props.product ? props.product.category_id :'');
    let [prices, setPrices] = useState(props.product ? props.product.prices :[{
        currency: 'GHS',
        price: 0,
        default: true
    },{
        currency: 'GBP',
        price: 0,
        default: false
    },{
        currency: 'KES',
        price: 0,
        default: false
    },{
        currency: 'NGN',
        price: 0,
        default: false
    }]);
    const {user} = useAuth();

    const router = useRouter();

    const variables = {
        id: props.product ? props.product.id: null,
        name,
        qty,
        public: pub,
        image,
        description,
        admin_id:  (user)  ?user.id: null,
        category_id: category,
        shop_id: props.id,
        prices
    };

    return (
        <>
            <Header />
            <Flex>
                <Head>
                    <title>Create Product</title>
                </Head>
                <Box w={500} p={4} my={12} mx="auto">
                    <Heading textAlign="center" as="h6" size="lg" mb="16">
                        {props.product ? 'Update product' : 'Create a product'}
                    </Heading>
                    <Dropzone
                        onDrop={(files) => {
                            
                            const file = onFileChange(files);

                            if (file) {

                                setLoading(true);

                                uploadImage(file, (url) => {

                                    setImage(url);
                                    setLoading(false);

                                });

                            }
                            
                        }}
                    >
                        {({getRootProps, getInputProps}) => (
                            <div className="my-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md" {...getRootProps()}>
                                {loading ? <Spinner /> : <div className="text-center">
                                    <input {...getInputProps()} />
                                    {image ? <img src={image} /> :<Fragment>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-1 text-sm text-gray-600">
                                            <button className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150 ease-in-out">
                                                Upload a file
                                            </button>
                                            or drag and drop
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </Fragment>}
                                </div>}
                            </div>
                        )}
                    </Dropzone>
                    <FormControl isRequired>
                        <FormLabel htmlFor="name">Product Name</FormLabel>
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            id="name"
                            value={name}
                            aria-describedby="text-helper-text"
                        />
                        {/* <FormHelperText id="email-helper-text">
                            You are required to pay $20 for your shop to be approved.
                        </FormHelperText> */}
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Input
                            onChange={(e) => setDescription(e.target.value)}
                            type="text"
                            id="description"
                            value={description}
                            aria-describedby="text-helper-text"
                        />
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="category">Category</FormLabel>
                        <Query
                            query={gql`
                                query{
                                    category{
                                        id
                                        name
                                    }
                                }
                            `}
                            onCompleted={(data) => {

                                setCategory(data.category[0].id);

                            }}
                        >
                            {({loading, data, error, refetch}) => {

                                return (
                                    <Select
                                        name="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {(!loading && data && data.category ? data.category: []).map((c) => {

                                            return (
                                                <option value={c.id} key={c.id}>
                                                    {c.name}
                                                </option>
                                            )

                                        })}
                                    </Select>
                                )

                            }}
                        </Query>
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="qty">Available Qty</FormLabel>
                        <NumberInput
                            name="qty"
                            isInvalid={false}
                            onChange={(valueString) => {

                                setQty(valueString);
                            
                            }}
                            value={qty}
                            min={0}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <FormControl isRequired my={4}>
                        <FormLabel htmlFor="qty">Visibility</FormLabel>
                        <Checkbox isChecked={pub} onChange={(e) => setPublic(e.target.checked)}>
                            Make public
                        </Checkbox>
                    </FormControl>
                    <FormControl isRequired my={10}>
                        <FormLabel htmlFor="prices">Prices</FormLabel>
                        {prices.map((p, index) => {

                            const format = (val) => `${symbols[p.currency]} ` + val
                            const parse = (val) => val.replace(/\B(?=(\d{3})+(?!\d))/g, "")

                            return (
                                <Box key={p.currency} my={6}>
                                    <NumberInput
                                        my={3}
                                        isInvalid={false}
                                        onChange={(valueString) => {

                                            prices[index].price = parse(valueString);
                                            
                                            setPrices([
                                                ...prices
                                            ]);
                                        
                                        }}
                                        value={format(p.price)}
                                        min={0}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <Checkbox isChecked={p.default} onChange={(e) => {

                                        prices = prices.map((p, i) => {

                                            if (i === index) {

                                                return {
                                                    ...p,
                                                    default: e.target.checked
                                                }

                                            } else {

                                                return {
                                                    ...p,
                                                    default: false
                                                }

                                            }

                                        });

                                        setPrices([
                                            ...prices
                                        ]);

                                    }}>Make default</Checkbox>
                                </Box>
                            )

                        })}
                    </FormControl>
                    {user ? <Stack justify="center" mt={6} isInline spacing={10}>
                        <Mutation
                            mutation={props.product ? gql`

                                mutation(
                                    $id: bigint!,
                                    $name: String!,
                                    $description: String!,
                                    $admin_id: bigint,
                                    $category_id: bigint!,
                                    $shop_id: bigint,
                                    $public: Boolean,
                                    $image: String,
                                    $qty: Int,
                                    $prices: [product_prices_insert_input!]
                                ){
                                    ${UPDATE_PRODUCT}
                                    ${prices.map((p, index) => {

                                        return (
                                            `
                                            price_update_${index}: update_product_prices_by_pk(pk_columns: {
                                                id: ${p.id}
                                            }, _set: {
                                                currency: "${p.currency}",
                                                default: ${p.default},
                                                price: ${p.price}
                                            }) {
                                                id
                                            }

                                            `
                                        )

                                    })}
                                }
                                
                            ` :CREATE_PRODUCT}
                            variables={variables}
                            onCompleted={() => {

                                router.push(`/shops/${props.id}/products`);

                            }}
                        >
                            {(save, {loading}) => (
                                <Button
                                    minWidth="40%"
                                    variant="solid"
                                    variantColor="blue"
                                    isDisabled={
                                        name === "" ||
                                        description === "" ||
                                        category === "" ||
                                        some(prices, (p) => p.price === 0)
                                    }
                                    isLoading={loading}
                                    onClick={() => {
                                        
                                        save();

                                    }}
                                >
                                    {props.product ? 'Update' :'Create'}
                                </Button>
                            )}
                        </Mutation>
                    </Stack>: null}
                </Box>
            </Flex>
        </>

    );

}