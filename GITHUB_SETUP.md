# GitHub Repository Setup Instructions

Your local Git repository has been successfully initialized and committed! Follow these steps to create a GitHub repository and push your code.

## Step 1: Create a New GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in with your account (tg1investigation@gmail.com)
2. Click the **"+"** button in the top-right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `x-scraper` (or any name you prefer)
   - **Description**: `A Python web scraper for X (Twitter) hashtags using Selenium`
   - Choose **Public** or **Private** (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you setup instructions. Use the **"push an existing repository from the command line"** section.

Run these commands in your terminal (replace `YOUR-USERNAME` and `REPO-NAME` with your actual values):

```bash
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

For example, if your username is `tg1investigation` and repo name is `x-scraper`:

```bash
git remote add origin https://github.com/tg1investigation/x-scraper.git
git branch -M main
git push -u origin main
```

## Step 3: Authenticate

When you run `git push`, you may be prompted for authentication:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your GitHub password)

### Create a Personal Access Token (if needed):

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it: "X Scraper Local"
4. Select scopes: **repo** (full control of private repositories)
5. Click "Generate token"
6. Copy the token and use it as your password when prompted

## Step 4: Verify

Go to your GitHub repository page and you should see all your files!

## What Was Committed

✅ `main.py` - The main scraper script
✅ `requirements.txt` - Python dependencies
✅ `.gitignore` - Git ignore rules
✅ `README.md` - Project documentation

## Future Updates

To push future changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Alternative: Using GitHub CLI

If you have GitHub CLI installed, you can create and push in one command:

```bash
gh repo create x-scraper --public --source=. --remote=origin --push
```

---

**Need Help?** Check GitHub's official documentation at https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github

