const aws = require('aws-sdk');
const s3 = new aws.S3();

module.exports = class PurgeS3 {
    constructor({ keyword, dryrun = false }) {
        if (dryrun) {
            this.listBuckets(keyword);
            return;
        }
    }

    async listBuckets(keyword) {
        const s3Res = await s3.listBuckets().promise();
        const buckets = s3Res.Buckets;
        const filteredBuckets = buckets.filter(bucket => bucket.Name.includes(keyword));

        console.log(filteredBuckets);
    }
}
