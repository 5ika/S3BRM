# S3BRM - S3 Backup Retention Manager

S3BRM is a tool created to manage the retention of files saved on an s3 object storage.
It allows in particular to delete files according to a backup plan.

## Configuration

```shell
curl https://raw.githubusercontent.com/5ika/S3BRM/main/env.sh.example > env.sh
nano env.sh # See example below
source env.sh # Set variables in the current environnment
```

Example of configuration for the following backup plan:
- Keep daily backups of the last 15 days
- Keep weekly backups of the last month
- Keep monthly backups for one year

```shell
# env.sh
export S3_ENDPOINT_HOST=sos-ch-dk-2.exo.io
export S3_ACCESS_KEY=ACCESSKEY
export S3_SECRET_KEY=SECRETKEY
export S3_REGION=ch-dk-2
export S3_BUCKET=my-bucket
export FILES_PREFIX=database/
export DAILY_BACKUP_INTERVAL=15
export WEEKLY_BACKUP_INTERVAL=31
export MONTHLY_BACKUP_INTERVAL=365
```

## Execution

```shell
deno run --allow-env --allow-net="$S3_ENDPOINT_HOST" https://raw.githubusercontent.com/5ika/S3BRM/main/mod.ts 
```

To test the tool behavior without deleting anything, one can use the debug mode with `-d` or `--debug` parameter:

```shell
deno run --allow-env --allow-net="$S3_ENDPOINT_HOST" https://raw.githubusercontent.com/5ika/S3BRM/main/mod.ts --debug
```