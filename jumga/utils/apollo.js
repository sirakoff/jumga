import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});


let client;

export default ({
    token
}) => {

    const authLink = setContext((_, { headers }) => {
    
        // get the authentication token from local storage if it exists


        const _headers = {
            ...headers,
        };

        if (token && token !== 'null') {
            
            _headers.authorization = `Bearer ${token}`;


        } else {

            _headers["x-hasura-role"] = "anonymous";


        }

    
        return {
          headers: _headers
        }
    });

    // if (!client) {

        client = new ApolloClient({
            link: authLink.concat(httpLink),
            ssrMode: typeof window === 'undefined',
            cache: new InMemoryCache(),
        });

    // }

    return client;

};