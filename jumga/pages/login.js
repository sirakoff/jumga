import React, { useState } from "react";
import Link from "next/link";
import firebaseClient from "../utils/firebase/client";
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
    Heading,
    useToast,
} from "@chakra-ui/react";
import Head from 'next/head';

import nookies from "nookies";
import { verifyIdToken } from "../utils/firebase/admin";
import Header from "../components/Header";
import { useRouter } from 'next/router'
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";

export async function getServerSideProps(context) {
    
    try {
    
        const cookies = nookies.get(context);
        const token = await verifyIdToken(cookies.token);

        if (token) {

            context.res.writeHead(302, { Location: "/" });
            context.res.end();

        }
    
        return {
            props: { session: token, token },
        };
    
    } catch (err) {
        
        
        return { props: {} };

    }

}

export default function Login({
    embed = false
}) {
    firebaseClient();
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [register, setRegister] = useState(false);

    const router = useRouter();

    const loginUser = async () => {

        await firebase.auth().signInWithEmailAndPassword(email, pass).then(function (firebaseUser) {

            if (!embed) {

                setTimeout(() => {
            
                    if (router.query.r) {

                        window.location.href = router.query.r;

                    } else {

                        window.location.href = "/";

                    }

                }, 500);

            }


        }).catch(function (error) {
            
            const message = error.message;
            toast({
                title: "An error occurred.",
                description: message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });

        });

    }

    return (
        <>
            {!embed ? <Header />: null}
            <Flex>
                {!embed ? <Head>
                    <title>Login / Register</title>
                </Head>: null}
                <Box w={500} p={4} my={12} mx="auto">
                    <Heading textAlign="center" as="h6" size="lg" mb="16">
                        {register ? 'Register': 'Login'}
                    </Heading>
                    {register ? <FormControl isRequired>
                        <FormLabel htmlFor="name">Full Name</FormLabel>
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            id="name"
                            value={name}
                            aria-describedby="email-helper-text"
                        />
                    </FormControl>: null}
                    <FormControl isRequired>
                        <FormLabel htmlFor="email">Email address</FormLabel>
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="emailAddress"
                            value={email}
                            aria-describedby="email-helper-text"
                        />
                        <FormHelperText id="email-helper-text">
                            We'll never share your email.
                        </FormHelperText>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                            onChange={(e) => setPass(e.target.value)}
                            type="password"
                            id="pass"
                            value={pass}
                            aria-describedby="password-helper-text"
                        />
                    </FormControl>
                    <Stack justify="center" mt={6} isInline spacing={10}>
                        {register ? <Mutation
                            mutation={gql`

                                mutation (
                                    $email: String!,
                                    $name: String!,
                                    $password: String!,
                                ){
                                    user: register(info:{
                                        email: $email,
                                        password: $password,
                                        name: $name
                                    }){
                                        id
                                    }
                                }
                            
                            `}
                            variables={{
                                email,
                                name,
                                password: pass
                            }}
                            onCompleted={async () => {

                                await loginUser();

                            }}
                        >
                            {(save, {loading}) => {

                                return (
                                    <Button
                                        minWidth="40%"
                                        variant="solid"
                                        variantColor="blue"
                                        isLoading={loading}
                                        isDisabled={email === "" || pass === "" || name === ""}
                                        onClick={() => {
                                        
                                            save()

                                        }}
                                    >
                                        Register
                                    </Button>
                                )

                            }}
                        </Mutation>: null}
                        {!register ? <Button
                            minWidth="40%"
                            variant="solid"
                            variantColor="green"
                            isDisabled={email === "" || pass === ""}
                            onClick={async () => {
                                
                                await loginUser();

                            }}
                        >
                            Log in
                        </Button>: null}
                    </Stack>
                    <Flex my={6} justifyContent="center" alignItems="center">
                        <Button
                            _hover={{ bg: "#fff" }}
                            px={0}
                            border="0px"
                            // leftIcon={<ChevronLeftIcon />}
                            onClick={() => setRegister(!register)}
                            colorScheme="teal"
                            variant="outline"
                        >
                            {register ? 'Already have an account? Login' : 'Don\'t have an account? Login'}
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </>
    );
}