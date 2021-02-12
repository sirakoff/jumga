import { GraphQLClient } from 'graphql-request'

export default new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
    headers: {
        'x-hasura-admin-secret': process.env.GRAPHQL_SECRET
    }
});