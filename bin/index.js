const PurgeS3 = require('../purge-s3');
const command = require('commander');
const pkg = require('../package.json');

command
    .version(pkg.version)
    .requiredOption('--keyword <keyword>', 'The keyword of the bucket that you wish to delete.')
    .option('--dryrun', 'Returns the list of buckets that will be deleted')
    .action(optionActions)
    .parse(process.argv);

function optionActions(cmd) {
    new PurgeS3(cmd)
}
