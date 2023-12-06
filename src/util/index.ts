import * as dns from 'dns';
import {LookupAddress} from 'node:dns';

export const util = {
    dns: {
        isValidUrlDns: async (websiteURL: string) => {
            const urlObject                      = new URL(websiteURL);
            let _dnsLookup: LookupAddress | null = null;

            try {
                _dnsLookup = await dns.promises.lookup(urlObject.hostname);
            } catch (e) {
                _dnsLookup = null
            }

            return !!_dnsLookup?.address;
        }
    }
}