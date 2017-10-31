# Site Status Checker

Simple Node CLI tool to check that a particular URL is resolving to the correct
IP address. Will add more features in the future for checking site performance,
running automated site tests, and more. See the roadmap for details.

Built for managing client sites where clients are prone to accidently break
sites, domains, and other related functionality, often without realizing it.

*This is a WIP.*

## Roadmap

  - [x] Add Ability to Check Site Resolution IP Against Known Good IP Address
  - [ ] Add Ability to Specify Reverse-Proxy vs. Standard DNS Resolution
  - [ ] Add Ability to Check Raw DNS Entry for Correct Configuration
  - [ ] Add Ability to Monitor Site Lighthouse Scores
  - [ ] Add Ability to Crawl Sitemap and Alert if There are Any 404s
  - [ ] Add Ability to Run Simple Smoke/Integration Tests on Site

## Running the Tool

After copying `config.example.json` to `config.json`, and filling out the 
appropriate details, just run the tool with:

```
npm run-script run
```

*Note: This tool will eventually be an installable CLI tool via NPM. These 
instructions are liable to change eventually.*