import { currentUser } from './reactiveVars';

export const typePolicies = {
  Query: {
    fields: {
      currentUser: {
        read() {
          return currentUser();
        },
      },
    },
  },
};
