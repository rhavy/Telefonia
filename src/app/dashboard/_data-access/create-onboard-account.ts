"use server"

import { stripe } from "@/lib/stripe"; 

export async function getLoginOnboardAccount(accoutId: string | null){
    if(!accoutId){
        return null;
    }
    try {
        const accountLink = await stripe.accountLinks.create({
            account: accoutId,
            refresh_url: `${process.env.HOST_URL!}/dashboard`,
            return_url: `${process.env.HOST_URL!}/dashboard`,
            type: "account_onboarding",
        })
        return accountLink.url;
    } catch (err) {
        console.log("## Erro Account ID ", err);
        return null;
        
        
    }
}