const aws = require('aws-sdk');
const prompt = require('prompt-sync')({ sigint: true });

require('@colors/colors')

const s3 = new aws.S3();


module.exports = class PurgeS3 {

    constructor({ keyword, force = false, dryrun = false }) {
        this.listBuckets(keyword).then(buckets => {
            if (dryrun) return;
            const response = prompt('Do you want to continue? (y/n)');
            if (!['y', 'yes'].includes(response.toLowerCase())) return;
            if (!force) console.log('--force flag is false. Will not delete non-empty buckets');
            this.deleteBuckets(buckets, force);
        });
    }

    async listBuckets(keyword) {
        console.log(`Getting list of bucket(s) to be deleted...(Keyword: \"${keyword}\")\n`)

        const s3Res = await s3.listBuckets().promise();
        const buckets = s3Res.Buckets;
        const filteredBuckets = buckets.filter(bucket => bucket.Name.includes(keyword)).map(bucket => bucket.Name);
        const bucketNumber = filteredBuckets.length;
        const nonEmptyBuckets = await this.getNonEmptyBuckets(filteredBuckets);

        filteredBuckets.forEach(bucket => {
            console.log(bucket);
        })

        console.log(`\n${bucketNumber} bucket${bucketNumber > 1 ? 's' : ''} to be deleted`);
        console.log(`\n${nonEmptyBuckets.length} bucket${nonEmptyBuckets.length > 1 ? 's' : ''} ${nonEmptyBuckets.length > 1 ? 'are' : 'is'} not empty`.yellow);
        return filteredBuckets;
    }
    async deleteBuckets(buckets = [], force = false) {
        let deleteCount = 0;
        const currentBuckets = force ? buckets : await this.getEmptyBuckets(buckets);
        for (const bucket of currentBuckets) {
            console.log('\nDeleting bucket ' + bucket + '...');
            try {
                await s3.deleteBucket({
                    Bucket: bucket
                }).promise()
            }
            catch (e) {
                if (e.code === 'BucketNotEmpty') {
                    const listObjectRes = await s3.listObjectsV2({
                        Bucket: bucket
                    }).promise()
                    const objects = listObjectRes.Contents
                    for (const object in objects) {
                        await s3.deleteObject({
                            Bucket: bucket,
                            Key: object.Key
                        }).promise()
                    }
                }
            }
            console.log('Bucket ' + bucket + ' deleted'.blue);
            deleteCount++;
        }
        console.log(`${deleteCount} bucket${deleteCount > 1 ? 's' : ''} deleted`.green)
        if (force) return;
        const nonEmptyBuckets = await this.getNonEmptyBuckets(buckets);
        console.log(`\n${nonEmptyBuckets.length} bucket${deleteCount > 1 ? 's' : ''} not deleted(Bucket not empty)`.yellow)

    }
    async getNonEmptyBuckets(buckets) {
        let nonEmptyBuckets = [];
        for (const bucket of buckets) {
            const getBucketRes = await s3.listObjectsV2({
                Bucket: bucket,
                MaxKeys: 1
            }).promise()
            if (getBucketRes.Contents.length) {
                nonEmptyBuckets = [...nonEmptyBuckets, getBucketRes.Name]
            }
        }
        return nonEmptyBuckets;
    }
    async getEmptyBuckets(buckets = []) {
        let emptyBuckets = [];
        for (const bucket of buckets) {
            const getBucketRes = await s3.listObjectsV2({
                Bucket: bucket,
                MaxKeys: 1
            }).promise()
            if (!getBucketRes.Contents.length) {
                emptyBuckets = [...emptyBuckets, getBucketRes.Name]
            }
        }
        return emptyBuckets;
    }
}
