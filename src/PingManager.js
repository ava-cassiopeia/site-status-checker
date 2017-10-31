const ping = require('ping');
const chalk = require('chalk');
const whois = require("node-whois");

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
                const whoisData = await this.whois(res.numeric_host);
                const orgName = whoisData.OrgName;

                let colorFunction = chalk.red;
                let statusSymbol = "x";
                let addToFailures = true;

                if(this.config.reverseProxyRegex && orgName) {
                    const regex = new RegExp(this.config.reverseProxyRegex, "gi");
                    const doesMatchReverseProxy = regex.test(orgName);

                    if(doesMatchReverseProxy) {
                        colorFunction = chalk.yellow;
                        statusSymbol = "~";
                        addToFailures = false;
                    }
                }

                this.log(colorFunction(`\t${statusSymbol} ${domain}: ${res.numeric_host}, ${orgName}`));

                if(addToFailures) {
                    failures += 1;
                } else {
                    successes += 1;
                }
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

    whois(url) {
        return new Promise((resolve, reject) => {
            whois.lookup(url, (err, data) => {
                const dataObj = this.processWhoIsString(data);

                resolve(dataObj);
            });
        });
    }

    processWhoIsString(data) {
        const lines = data.split("\n");
        let output = {};

        for(let x = 0; x < lines.length; x++) {
            const line = lines[x];

            // skip "comment" lines (any lines starting with #)
            if(line[0] === '#') {
                continue;
            }

            const splitLine = line.split(/:(.+)/);
            const index = splitLine[0].replace(":", "").trim();
            const value = splitLine[1] ? splitLine[1].trim() : "";

            output[index] = value;
        }

        return output;
    }

    log(message, logLevel = LOG_LEVEL.INFORMATION) {
        console.log(message);
    }

}

module.exports = PingManager;