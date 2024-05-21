import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { SESSION_KEY } from './constant';
import { cache } from './graphql/policies';

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_APOLLO_HTTP_ENDPOINT || 'http://localhost:4000/graphql',
  headers: {
    'Apollo-Require-Preflight': 'true',
    'Access-Control-Allow-Origin': '*',
    'X-Apollo-Operation-Name': '',
    'Access-Control-Request-Method': 'OPTIONS',
  },
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(SESSION_KEY.ACCESS_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_SUBSCRIPTION_ENDPOINT || 'ws://localhost:4000/subscriptions',
    connectionParams: {
      authToken: `Bearer ${localStorage.getItem(SESSION_KEY.ACCESS_TOKEN)}`,
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  },
};

export default new ApolloClient({
  link: authLink.concat(splitLink),
  cache,
  defaultOptions,
});
