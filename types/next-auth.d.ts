import { Session, User } from './../src/generated/prisma/index.d';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: User & DefaultSession['user']
    }
    interface UseR {
        id:                         string;
        name?:                       string;
        email?:                      string;
        username?:                   string;
        bio?:                        string;
        connectedStripeAccountId?:   string;
    }
}
