const ping = require('ping');
const chalk = require('chalk');

const LOG_LEVEL = {
    INFORMATION: 0
};

class PingManager {

    constructor() {
        this.config = require("./../config.json");
    }

    async scanAllSites() {
        const goodIp = this.config.goodIp;
        const sites = this.config.sites;

        let passedScans = 0;
        let failedScans = 0;

        for(let x = 0; x < sites.length; x++) {
            const site = sites[x];

            const results = await this.scanSite(site);
            
            if(results.wasCompleteSuccess) {
                passedScans += 1;
            } else {
                failedScans += 1;
            }
        }

        console.log("");
        console.log(`Checked ${sites.length} sites. ${passedScans} passed, ${failedScans} failed.`);
    }

    async scanSite(site) {
        this.log(`Checking ${site.name}`);

        let successes = 0;
        let failures = 0;

        for(let x = 0; x < site.domains.length; x++) {
            const domain = site.domains[x];

            const res = await this.pingUrl(domain);

            if(res.numeric_host === this.config.goodIp) {
                this.log(chalk.green(`\t✔ ${domain}`));

                successes += 1;
            } else {
                this.log(chalk.red(`\tx ${domain}: ${res.numeric_host}`));

                failures += 1;
            }
        }

        return {
            total: site.domains.length,
            successes: successes,
            failures: failures,
            wasCompleteSuccess: failures == 0
        };
    }

    async pingUrl(url) {
        const res = await ping.promise.probe(url);
        
        return res;
    }

    log(message, logLevel = LOG_LEVEL.INFORMATION) {
        console.log(message);
    }

}

module.exports = PingManager;