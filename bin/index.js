#!/usr/bin/env node

const PurgeS3 = require('../purge-s3');
const { Command } = require('commander');

const pkg = require('../package.json');
const command = new Command();

command
    .version(pkg.version)
    .requiredOption('--keyword <keyword>', 'The keyword of the bucket that you wish to delete. Use *')
    .option('--force', 'Delete the bucket regardless if it is empty or not')
    .option('--dryrun', 'Returns the list of buckets that will be deleted')
    .action(optionActions)
    .parse(process.argv);

function optionActions(cmd) {
    new PurgeS3(cmd)
}
