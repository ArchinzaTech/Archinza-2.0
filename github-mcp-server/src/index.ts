#!/usr/bin/env node

/**
 * GitHub MCP Server
 * Provides access to GitHub repositories for code navigation and project management
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { GitHubClient } from './github-client.js';

// Get GitHub token from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

// Initialize GitHub client
const github = new GitHubClient(GITHUB_TOKEN);

// Create MCP server
const server = new Server(
  {
    name: 'github-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

/**
 * Tool Handlers
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_repositories',
        description:
          'List all GitHub repositories accessible to the authenticated user. Returns repository metadata including name, description, language, stars, and more.',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['all', 'owner', 'public', 'private', 'member'],
              description: 'Filter repositories by type (default: all)',
              default: 'all',
            },
            sort: {
              type: 'string',
              enum: ['created', 'updated', 'pushed', 'full_name'],
              description: 'Sort repositories by field (default: updated)',
              default: 'updated',
            },
            direction: {
              type: 'string',
              enum: ['asc', 'desc'],
              description: 'Sort direction (default: desc)',
              default: 'desc',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page (default: 100, max: 100)',
              default: 100,
              maximum: 100,
            },
            page: {
              type: 'number',
              description: 'Page number for pagination (default: 1)',
              default: 1,
            },
          },
        },
      },
      {
        name: 'search_code',
        description:
          'Search for code across all accessible repositories. Supports GitHub code search syntax including qualifiers like repo:, path:, extension:, language:, etc.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description:
                'Search query using GitHub code search syntax (e.g., "function repo:owner/repo", "TODO extension:js")',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page (default: 30, max: 100)',
              default: 30,
              maximum: 100,
            },
            page: {
              type: 'number',
              description: 'Page number for pagination (default: 1)',
              default: 1,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_file_content',
        description:
          'Get the content of a specific file from a GitHub repository. Returns the file content decoded from base64.',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner (username or organization)',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            path: {
              type: 'string',
              description: 'Path to the file within the repository',
            },
            ref: {
              type: 'string',
              description: 'Git reference (branch, tag, or commit SHA). Defaults to default branch',
            },
          },
          required: ['owner', 'repo', 'path'],
        },
      },
      {
        name: 'list_issues',
        description:
          'List issues across all repositories or for a specific repository. Supports filtering by state, labels, and more.',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner (optional, for repo-specific issues)',
            },
            repo: {
              type: 'string',
              description: 'Repository name (optional, for repo-specific issues)',
            },
            filter: {
              type: 'string',
              enum: ['assigned', 'created', 'mentioned', 'subscribed', 'all'],
              description:
                'Filter issues by involvement (default: assigned). Only used when owner/repo not specified.',
              default: 'assigned',
            },
            state: {
              type: 'string',
              enum: ['open', 'closed', 'all'],
              description: 'Filter issues by state (default: open)',
              default: 'open',
            },
            labels: {
              type: 'string',
              description: 'Comma-separated list of label names to filter by',
            },
            sort: {
              type: 'string',
              enum: ['created', 'updated', 'comments'],
              description: 'Sort issues by field (default: updated)',
              default: 'updated',
            },
            direction: {
              type: 'string',
              enum: ['asc', 'desc'],
              description: 'Sort direction (default: desc)',
              default: 'desc',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page (default: 30, max: 100)',
              default: 30,
              maximum: 100,
            },
            page: {
              type: 'number',
              description: 'Page number for pagination (default: 1)',
              default: 1,
            },
          },
        },
      },
      {
        name: 'create_issue',
        description:
          'Create a new issue in a specific GitHub repository. Requires repository write access.',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner (username or organization)',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            title: {
              type: 'string',
              description: 'Issue title',
            },
            body: {
              type: 'string',
              description: 'Issue body/description (supports Markdown)',
            },
            assignees: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of usernames to assign to the issue',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of label names to apply to the issue',
            },
            milestone: {
              type: 'number',
              description: 'Milestone number to associate with the issue',
            },
          },
          required: ['owner', 'repo', 'title'],
        },
      },
      {
        name: 'get_repo_structure',
        description:
          'Get the directory tree structure of a GitHub repository. Returns all files and directories in a hierarchical structure.',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'Repository owner (username or organization)',
            },
            repo: {
              type: 'string',
              description: 'Repository name',
            },
            tree_sha: {
              type: 'string',
              description: 'Git tree SHA (optional, defaults to default branch)',
            },
            recursive: {
              type: 'boolean',
              description: 'Whether to fetch the tree recursively (default: true)',
              default: true,
            },
          },
          required: ['owner', 'repo'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case 'list_repositories': {
        const repos = await github.listRepositories({
          type: args.type as 'all' | 'owner' | 'public' | 'private' | 'member',
          sort: args.sort as 'created' | 'updated' | 'pushed' | 'full_name',
          direction: args.direction as 'asc' | 'desc',
          per_page: args.per_page as number,
          page: args.page as number,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(repos, null, 2),
            },
          ],
        };
      }

      case 'search_code': {
        if (!args.query || typeof args.query !== 'string') {
          throw new McpError(ErrorCode.InvalidParams, 'Query parameter is required');
        }

        const results = await github.searchCode(args.query, {
          per_page: args.per_page as number,
          page: args.page as number,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'get_file_content': {
        if (!args.owner || !args.repo || !args.path) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'owner, repo, and path parameters are required'
          );
        }

        const file = await github.getFileContent(
          args.owner as string,
          args.repo as string,
          args.path as string,
          args.ref as string | undefined
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(file, null, 2),
            },
          ],
        };
      }

      case 'list_issues': {
        let issues;

        // If owner and repo are provided, list issues for that specific repo
        if (args.owner && args.repo) {
          issues = await github.listRepoIssues(args.owner as string, args.repo as string, {
            state: args.state as 'open' | 'closed' | 'all',
            labels: args.labels as string,
            sort: args.sort as 'created' | 'updated' | 'comments',
            direction: args.direction as 'asc' | 'desc',
            since: args.since as string,
            per_page: args.per_page as number,
            page: args.page as number,
          });
        } else {
          // Otherwise list issues across all repos
          issues = await github.listIssues({
            filter: args.filter as 'assigned' | 'created' | 'mentioned' | 'subscribed' | 'all',
            state: args.state as 'open' | 'closed' | 'all',
            labels: args.labels as string,
            sort: args.sort as 'created' | 'updated' | 'comments',
            direction: args.direction as 'asc' | 'desc',
            since: args.since as string,
            per_page: args.per_page as number,
            page: args.page as number,
          });
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issues, null, 2),
            },
          ],
        };
      }

      case 'create_issue': {
        if (!args.owner || !args.repo || !args.title) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'owner, repo, and title parameters are required'
          );
        }

        const issue = await github.createIssue(args.owner as string, args.repo as string, {
          title: args.title as string,
          body: args.body as string | undefined,
          assignees: args.assignees as string[] | undefined,
          labels: args.labels as string[] | undefined,
          milestone: args.milestone as number | undefined,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issue, null, 2),
            },
          ],
        };
      }

      case 'get_repo_structure': {
        if (!args.owner || !args.repo) {
          throw new McpError(ErrorCode.InvalidParams, 'owner and repo parameters are required');
        }

        const tree = await github.getRepositoryTree(
          args.owner as string,
          args.repo as string,
          args.tree_sha as string | undefined,
          args.recursive !== false
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tree, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new McpError(ErrorCode.InternalError, errorMessage);
  }
});

/**
 * Resource Handlers
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'github://repos',
        name: 'GitHub Repositories',
        description: 'List of all accessible GitHub repositories',
        mimeType: 'application/json',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    // Parse the URI
    const url = new URL(uri);

    if (url.protocol !== 'github:') {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid URI protocol');
    }

    // Handle different resource patterns
    if (url.pathname === '//repos') {
      // List all repositories
      const repos = await github.listRepositories();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(repos, null, 2),
          },
        ],
      };
    }

    // Pattern: github://repo/{owner}/{repo}/tree
    const treeMatch = url.pathname.match(/^\/\/repo\/([^/]+)\/([^/]+)\/tree$/);
    if (treeMatch) {
      const [, owner, repo] = treeMatch;
      const tree = await github.getRepositoryTree(owner, repo);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(tree, null, 2),
          },
        ],
      };
    }

    // Pattern: github://repo/{owner}/{repo}/file/{path}
    const fileMatch = url.pathname.match(/^\/\/repo\/([^/]+)\/([^/]+)\/file\/(.+)$/);
    if (fileMatch) {
      const [, owner, repo, path] = fileMatch;
      const file = await github.getFileContent(owner, repo, path);
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: file.content || '',
          },
        ],
      };
    }

    throw new McpError(ErrorCode.InvalidRequest, 'Invalid resource URI pattern');
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new McpError(ErrorCode.InternalError, errorMessage);
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('GitHub MCP Server running on stdio');
  console.error('Token:', GITHUB_TOKEN!.substring(0, 4) + '...');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
