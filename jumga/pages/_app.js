import React from 'react';
import "tailwindcss/tailwind.css";
import "../app.css";
import { ChakraProvider, theme } from "@chakra-ui/react"
import { AuthProvider } from '../utils/auth';
import { ApolloProvider } from '@apollo/client';
import client from '../utils/apollo';
import nookies, {setCookie} from 'nookies';
import currencyMap from '../utils/currencyMap.json';

import { Provider } from 'react-redux'
import { useStore } from '../utils/store'

import {CurrencyProvider} from '../utils/contexts/Currency';
import { CountryProvider } from '../utils/contexts/Country';

const allowedCurrencies = ['GHS', 'NGN', 'GBP', 'KES'];
const defaultCurrency = "GBP";

const allowedCountries = ['GH', 'NG', 'UK', 'KE'];
const defaultCountry = "UK";

let geoip;

if (typeof window === 'undefined') { 

    geoip = require('geoip-country');

}


function JumgaApp({ Component, pageProps }) {

	const {token, currency, country} = pageProps;
	const store = useStore({});

	return (
		<ChakraProvider theme={theme}>
			<AuthProvider>
				<ApolloProvider client={client({
					token
				})}>
					<Provider store={store}>
						<CurrencyProvider currency={currency}>
							<CountryProvider country={country}>
								<Component
									{...pageProps}
								/>
							</CountryProvider>
						</CurrencyProvider>
					</Provider>
				</ApolloProvider>
			</AuthProvider>
		</ChakraProvider>
	)

}

JumgaApp.getInitialProps = ({ctx}) => {

	if (!ctx) {

		const cookies = parseCookies();

		const pCurrency = currencyMap[cookies.country];

		return {
			pageProps: {
				token: cookies.token,
				country: allowedCountries.indexOf(cookies.country) > -1 ? country: defaultCountry,
				currency: pCurrency ? allowedCurrencies.indexOf(pCurrency) > -1 ? pCurrency: defaultCurrency : defaultCurrency
			}
		}

	}

    const ip = ctx?.req?.headers['x-forwarded-for'] || ctx?.req?.ip || ctx?.req?.connection.remoteAddress;

	const {token, country: _country} = nookies.get(ctx);


	let country;

    // console.log(cookies.country);

    if (!_country) {

        const geo = geoip.lookup(ip);

        if (geo) {

            country = geo.country;

            setCookie(ctx, 'country', geo.country, {
                // maxAge: 30 * 24 * 60 * 60,
                path: '/',
            });

        } else {

            setCookie(ctx, 'country', defaultCountry, {
                // maxAge: 30 * 24 * 60 * 60,
                path: '/',
            });

            country = defaultCountry;

        }

    } else {

        country = _country;

	}
	
	const pCurrency = currencyMap[country];

	return {
		pageProps: {
			token,
			country: allowedCountries.indexOf(country) > -1 ? country: defaultCountry,
			currency: pCurrency ? allowedCurrencies.indexOf(pCurrency) > -1 ? pCurrency: defaultCurrency : defaultCurrency
		}
	}

}

export default JumgaApp
