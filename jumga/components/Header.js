import React, {useState, useContext, useRef} from 'react';
import {
    Flex,
    Box,
    Container,
    Link,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    Button,
    
    Drawer,
    
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure
} from "@chakra-ui/react"
import {ChevronDownIcon} from '@chakra-ui/icons';
import firebaseClient from "../utils/firebase/client";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuth } from '../utils/auth';
import { useRouter } from 'next/router';

import { useSelector } from 'react-redux'
import CartItems from '../components/CartItems';
import { CountryContext } from '../utils/contexts/Country';

import { setCookie } from 'nookies';


const Header = () => {

    firebaseClient();

    const {user} = useAuth();

    const router = useRouter();

    const cart = useSelector((state) => state);

    const {country} = useContext(CountryContext);

    // console.log(cart);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();

    const changeCountry = (country) => {

        setCookie(null, 'country', `${country}`, {
            path: '/',
        });

        window.location.reload();

    }

    return (
        <>
            <Box className="navbar-shadow h-16 fixed top-0 left-0 right-0 bg-white z-10">
                <Drawer
                    isOpen={isOpen}
                    placement="right"
                    onClose={onClose}
                    finalFocusRef={btnRef}
                    size="sm"
                >
                    <DrawerOverlay>
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>
                                Cart
                            </DrawerHeader>

                            
                            {Object.keys(cart).length ? <CartItems
                            
                                products={cart}
                            
                            />: <Flex justifyContent="center" alignItems="center">
                                <Box>
                                    You don't have any items in cart
                                </Box>    
                            </Flex>}

                            
                        </DrawerContent>
                    </DrawerOverlay>
                </Drawer>
                <Container maxW="6xl" h="full">
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        h="full"
                        // paddingTop="4"
                        // paddingBottom="4"
                    >
                        <Link href="/" className="hover:no-underline focus:outline-none">
                            <Box fontWeight="700" fontSize="2xl">
                                JUMGA
                            </Box>
                        </Link>
                        <Flex alignItems="center">
                            <Box mx={4}>
                                <Link href="/shops/create">
                                    Create a shop
                                </Link>
                            </Box>
                            <Menu mx={4} placement="bottom-end">
                                <MenuButton size="sm" as={Button} rightIcon={<ChevronDownIcon />}>
                                    {country}
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => changeCountry('GH')} className="relative">
                                        {country === 'GH' ? <svg className="absolute w-5 h-5 text-black left-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg> : null}
                                        <span className="ml-6">GH</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => changeCountry('UK')} className="relative">
                                        {country === 'UK' ? <svg className="absolute w-5 h-5 text-black left-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg> : null}
                                        <span className="ml-6">UK</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => changeCountry('NG')} className="relative">
                                        {country === 'NG' ? <svg className="absolute w-5 h-5 text-black left-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg> : null}
                                        <span className="ml-6">NG</span>
                                    </MenuItem>
                                    <MenuItem onClick={() => changeCountry('KE')} className="relative">
                                        {country === 'KE' ? <svg className="absolute w-5 h-5 text-black left-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg> : null}
                                        <span className="ml-6">KE</span>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            <Box className="flex items-center pl-10">

                                <Link href="/search" className="relative focus:outline-none rounded-full border-2 p-2 ">
                                    <svg className="text-gray-500 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Link>
                                <button onClick={onOpen} className="relative focus:outline-none rounded-full border-2 p-2 mx-3">
                                    <svg className="text-gray-500 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                    {Object.keys(cart).length > 0 ? <div className="absolute -top-2 rounded-full px-1 -right-2 bg-red-500 text-white text-xs">
                                        {Object.keys(cart).length}
                                    </div>: null}
                                </button>
                                <Menu placement="bottom-end">
                                    
                                    <MenuButton onClick={() => {

                                        if (!user) {

                                            router.push('/login');

                                        }

                                    }} className="focus:outline-none">
                                        <div className="focus:outline-none rounded-full border-2 p-2">
                                            <svg className="text-gray-500 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </MenuButton>
                                    {user ? <MenuList>
                                        <MenuItem onClick={() => {

                                            router.push('/orders');

                                        }}>Your Orders</MenuItem>
                                        <MenuItem onClick={() => {

                                            router.push('/shops');

                                        }}>Your Shops</MenuItem>
                                        <MenuItem onClick={async () => {

                                            await firebase.auth().signOut();

                                            window.location.reload();

                                        }}>Logout</MenuItem>
                                    </MenuList>: null}
                                </Menu>
                                
                            </Box>
                        </Flex>
                    </Flex>
                </Container>
            </Box>
            <Box h={16} />
        </>
    );

};


export default Header;