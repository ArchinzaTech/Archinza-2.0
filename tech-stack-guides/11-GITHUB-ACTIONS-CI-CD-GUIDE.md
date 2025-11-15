# GitHub Actions CI/CD Guide for Archinza 2.0

## Overview

Archinza uses GitHub Actions for continuous integration and deployment, automatically deploying frontend applications to AWS S3 on code pushes.

---

## Workflow Files

Located in `.github/workflows/`:
- `deploy_s3_dev.yml` - Development deployment (develop branch)
- `deploy_s3_prod.yml` - Production deployment (main branch)

---

## Development Deployment

**File:** `.github/workflows/deploy_s3_dev.yml`

```yaml
name: Deploy to S3 Development

on:
  push:
    branches:
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        working-directory: ./archinza-front-beta/archinza-front-beta
        run: npm install

      - name: Build application
        working-directory: ./archinza-front-beta/archinza-front-beta
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.DEV_API_URL }}
          REACT_APP_ENV: development

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        working-directory: ./archinza-front-beta/archinza-front-beta
        run: |
          aws s3 sync build/ s3://appdev.archinza.com --delete

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.DEV_CLOUDFRONT_ID }} \
            --paths "/*"
```

---

## Production Deployment

**File:** `.github/workflows/deploy_s3_prod.yml`

```yaml
name: Deploy to S3 Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          cache-dependency-path: './archinza-front-beta/archinza-front-beta/package-lock.json'

      - name: Install dependencies
        working-directory: ./archinza-front-beta/archinza-front-beta
        run: npm ci

      - name: Run tests
        working-directory: ./archinza-front-beta/archinza-front-beta
        run: npm test -- --passWithNoTests

      - name: Build application
        working-directory: ./archinza-front-beta/archinza-front-beta
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.PROD_API_URL }}
          REACT_APP_ENV: production

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        working-directory: ./archinza-front-beta/archinza-front-beta
        run: |
          aws s3 sync build/ s3://www.archinza.com --delete \
            --cache-control "public, max-age=31536000" \
            --exclude "index.html" \
            --exclude "service-worker.js"

          aws s3 cp build/index.html s3://www.archinza.com/index.html \
            --cache-control "public, max-age=0, must-revalidate"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.PROD_CLOUDFRONT_ID }} \
            --paths "/*"

      - name: Notify deployment
        if: success()
        run: echo "Deployment successful!"

      - name: Notify failure
        if: failure()
        run: echo "Deployment failed!"
```

---

## GitHub Secrets Configuration

Go to: Repository Settings → Secrets and variables → Actions

**Required Secrets:**

```
AWS_ACCESS_KEY_ID          - AWS IAM access key
AWS_SECRET_ACCESS_KEY      - AWS IAM secret key
DEV_API_URL                - Dev API URL (e.g., https://api-dev.archinza.com)
PROD_API_URL               - Prod API URL (e.g., https://api.archinza.com)
DEV_CLOUDFRONT_ID          - Development CloudFront distribution ID
PROD_CLOUDFRONT_ID         - Production CloudFront distribution ID
```

---

## Workflow Triggers

### 1. On Push

```yaml
on:
  push:
    branches:
      - main
      - develop
```

### 2. On Pull Request

```yaml
on:
  pull_request:
    branches:
      - main
```

### 3. Manual Trigger

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - development
          - production
```

### 4. Scheduled

```yaml
on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM
```

---

## Common Actions Used

### 1. Checkout Code

```yaml
- name: Checkout code
  uses: actions/checkout@v3
```

### 2. Setup Node.js

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '16'
    cache: 'npm'
```

### 3. AWS Credentials

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1
```

---

## Deployment Flow

1. **Trigger:** Push to main/develop branch
2. **Checkout:** Clone repository
3. **Setup:** Install Node.js
4. **Install:** `npm install` or `npm ci`
5. **Test:** Run test suite (production only)
6. **Build:** Create production build
7. **Configure:** Set up AWS credentials
8. **Deploy:** Sync files to S3
9. **Cache:** Invalidate CloudFront
10. **Notify:** Success/failure notification

---

## Cache Control Strategy

### Static Assets (Long Cache)

```bash
--cache-control "public, max-age=31536000" # 1 year
```

Applied to:
- JS files
- CSS files
- Images
- Fonts

### HTML Files (No Cache)

```bash
--cache-control "public, max-age=0, must-revalidate"
```

Applied to:
- index.html
- service-worker.js

---

## Best Practices

### 1. Use `npm ci` for Production

```yaml
# ✅ Good: Deterministic installs
- run: npm ci

# ❌ Bad: May install different versions
- run: npm install
```

### 2. Enable Caching

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    cache: 'npm'
    cache-dependency-path: './path/to/package-lock.json'
```

### 3. Use Environment-Specific Secrets

```yaml
env:
  REACT_APP_API_URL: ${{ secrets.PROD_API_URL }}
  REACT_APP_RECAPTCHA_KEY: ${{ secrets.RECAPTCHA_SITE_KEY }}
```

### 4. Conditional Steps

```yaml
- name: Run tests
  if: github.ref == 'refs/heads/main'
  run: npm test
```

### 5. Fail Fast

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 30 # Fail if takes > 30 min
```

---

## Multiple Environments

```yaml
jobs:
  deploy-dev:
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to dev
        run: aws s3 sync build/ s3://dev.archinza.com

  deploy-prod:
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: aws s3 sync build/ s3://www.archinza.com
```

---

## Deployment Notifications

### Slack Notification

```yaml
- name: Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment to production completed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

### Email Notification

```yaml
- name: Send email
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Deployment Status
    body: Deployment completed successfully
    to: team@archinza.com
```

---

## Rollback Strategy

### Manual Rollback

```bash
# List S3 versions
aws s3api list-object-versions --bucket www.archinza.com

# Restore previous version
aws s3api copy-object \
  --copy-source www.archinza.com/index.html?versionId=VERSION_ID \
  --bucket www.archinza.com \
  --key index.html
```

### Automated Rollback on Failure

```yaml
- name: Deploy
  id: deploy
  run: aws s3 sync build/ s3://www.archinza.com

- name: Rollback on failure
  if: failure() && steps.deploy.outcome == 'failure'
  run: |
    # Restore from backup
    aws s3 sync s3://backups.archinza.com s3://www.archinza.com
```

---

## Monitoring Deployments

View deployment status:
- **GitHub Actions tab** - Real-time logs
- **Email notifications** - On success/failure
- **CloudWatch Logs** - Application logs post-deployment

---

## Summary

GitHub Actions CI/CD in Archinza provides:
- **Automated deployments** - On git push
- **Environment-specific builds** - Dev and prod pipelines
- **AWS S3 integration** - Direct deploy to S3 buckets
- **CloudFront invalidation** - Cache clearing
- **Secret management** - Secure credential storage
- **Build optimization** - Caching, parallel jobs
- **Quality gates** - Tests before production deploy
