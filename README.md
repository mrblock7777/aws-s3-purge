# AWS S3 Bucket Purge
This package is intended to ease the process of deleting multiple buckets at once, even if the buckets are not empty

## Prerequisite
- Ensure your AWS credentials is configured (Either using `aws configure` or through profile export)
- Ensure your credentials has sufficient permission to perform S3 operations(`s3:GetBucket`, `s3:ListBuckets`, `s3:DeleteBucket`, `s3:ListObjectsV2`, `s3:DeleteObject`)

### Install

Install the package through: \
```
npm i -g @mrblock7777/aws-s3-purge
```

### Basic usage
Dryrun (Running delete simulation):

```
aws-s3 purge --keyword [your-bucket] --dryrun
```

Delete empty buckets:
```
aws-s3-purge --keyword [your-bucket]
```

Delete empty & non-empty buckets:
```
aws-s3-purge --keyword [your-bucket] --force
```

### Future implementation

- Support for --role-arn, to assume different roles
- Support for delete all S3 buckets
- More details dryrun (to include objects that will be deleted as well)