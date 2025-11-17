# GitHub MCP Server

A Model Context Protocol (MCP) server that provides comprehensive access to GitHub repositories for code navigation and automated project management.

## Features

### Tools

The server provides the following tools:

1. **list_repositories** - Get all accessible repositories with metadata
   - Filter by type (all, owner, public, private, member)
   - Sort by various fields (created, updated, pushed, full_name)
   - Pagination support

2. **search_code** - Search for code across all accessible repositories
   - Supports full GitHub code search syntax
   - Qualifiers: `repo:`, `path:`, `extension:`, `language:`, etc.
   - Pagination support

3. **get_file_content** - Read any file from any accessible repository
   - Specify owner, repo, and file path
   - Optional git reference (branch, tag, or commit SHA)
   - Automatic base64 decoding

4. **list_issues** - Get issues across all repos or for a specific repository
   - Filter by state (open, closed, all)
   - Filter by labels, assignees, etc.
   - Sort options and pagination

5. **create_issue** - Create a new issue in a specific repository
   - Set title, body (Markdown supported)
   - Assign users and labels
   - Link to milestones

6. **get_repo_structure** - Get the directory tree of a repository
   - Full recursive directory structure
   - Returns all files and folders
   - Configurable recursion depth

### Resources

The server exposes these MCP resources:

- `github://repos` - List of all accessible repositories
- `github://repo/{owner}/{repo}/tree` - Directory structure of a specific repository
- `github://repo/{owner}/{repo}/file/{path}` - Content of a specific file

## Installation

### Prerequisites

- Node.js 18 or higher
- A GitHub personal access token

### Setup

1. **Clone or navigate to the project:**
   ```bash
   cd github-mcp-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a descriptive name (e.g., "MCP Server")
   - Select the following scopes:
     - `repo` (Full control of private repositories)
     - `read:org` (Read org and team membership)
     - `read:user` (Read user profile data)
   - Click "Generate token" and copy it

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your GitHub token:
   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```

5. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

## Usage

### Running the Server

The server runs on stdio as per the MCP specification:

```bash
npm start
```

For development with auto-rebuild:

```bash
npm run watch
```

### Integrating with Claude Desktop

Add the server to your Claude Desktop configuration file:

**MacOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/absolute/path/to/github-mcp-server/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Example Tool Calls

#### List Repositories
```json
{
  "name": "list_repositories",
  "arguments": {
    "type": "owner",
    "sort": "updated",
    "per_page": 50
  }
}
```

#### Search Code
```json
{
  "name": "search_code",
  "arguments": {
    "query": "function handleError repo:myorg/myrepo",
    "per_page": 10
  }
}
```

#### Get File Content
```json
{
  "name": "get_file_content",
  "arguments": {
    "owner": "myorg",
    "repo": "myrepo",
    "path": "src/index.ts",
    "ref": "main"
  }
}
```

#### List Issues
```json
{
  "name": "list_issues",
  "arguments": {
    "owner": "myorg",
    "repo": "myrepo",
    "state": "open",
    "labels": "bug,urgent"
  }
}
```

#### Create Issue
```json
{
  "name": "create_issue",
  "arguments": {
    "owner": "myorg",
    "repo": "myrepo",
    "title": "Bug: Application crashes on startup",
    "body": "## Description\n\nThe application crashes when...",
    "labels": ["bug", "high-priority"],
    "assignees": ["username"]
  }
}
```

#### Get Repository Structure
```json
{
  "name": "get_repo_structure",
  "arguments": {
    "owner": "myorg",
    "repo": "myrepo",
    "recursive": true
  }
}
```

## Rate Limiting

The GitHub API has rate limits:
- **Authenticated requests:** 5,000 requests per hour
- **Search API:** 30 requests per minute

The server includes:
- Automatic rate limit checking
- Warning messages when approaching limits
- Graceful error handling for rate limit errors

When you're running low on requests, the server will log warnings like:
```
⚠️  GitHub API rate limit low: 50/5000 remaining. Resets at 2025-01-15T12:00:00.000Z
```

## Error Handling

The server handles common GitHub API errors:

- **401 Unauthorized** - Invalid or expired token
- **403 Forbidden** - Rate limit exceeded or insufficient permissions
- **404 Not Found** - Repository, file, or resource doesn't exist
- **422 Validation Failed** - Invalid parameters

All errors are returned as MCP-formatted error responses with descriptive messages.

## Development

### Project Structure

```
github-mcp-server/
├── src/
│   ├── index.ts          # Main MCP server implementation
│   ├── github-client.ts  # GitHub API client wrapper
│   └── types.ts          # TypeScript type definitions
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run watch
```

This will watch for changes and automatically rebuild.

## Future Enhancements

Planned features for future versions:

- **Cross-repo dependency analysis** - Identify dependencies between repositories
- **Project dashboards** - Aggregate status across multiple repos
- **Pull request management** - Create, review, and merge PRs
- **Workflow automation** - Trigger GitHub Actions and monitor runs
- **Team analytics** - Contribution statistics and team metrics
- **Advanced search** - Semantic code search and pattern matching
- **Caching layer** - Reduce API calls with intelligent caching

## Troubleshooting

### "GitHub token is required" error
Make sure the `GITHUB_TOKEN` environment variable is set either in your `.env` file or in the MCP configuration.

### "Resource not found" error
- Verify you have access to the repository
- Check that the owner, repo name, and path are correct
- Ensure your token has the necessary scopes

### Rate limit errors
- Wait for the rate limit to reset (shown in error message)
- Consider caching frequently accessed data
- Use more specific search queries to reduce API calls

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - See LICENSE file for details

## Links

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Octokit Documentation](https://github.com/octokit/rest.js)
