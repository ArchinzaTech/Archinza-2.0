/**
 * GitHub API client wrapper using Octokit
 */

import { Octokit } from '@octokit/rest';
import type {
  Repository,
  CodeSearchResult,
  FileContent,
  Issue,
  TreeNode,
  RateLimitInfo,
  GitHubError
} from './types.js';

export class GitHubClient {
  private octokit: Octokit;
  private rateLimitWarningThreshold = 100;

  constructor(token: string) {
    if (!token) {
      throw new Error('GitHub token is required');
    }

    this.octokit = new Octokit({
      auth: token,
      userAgent: 'github-mcp-server/1.0.0',
    });
  }

  /**
   * Check rate limit status and log warnings if running low
   */
  async checkRateLimit(): Promise<RateLimitInfo> {
    try {
      const response = await this.octokit.rateLimit.get();
      const rateLimit: RateLimitInfo = {
        limit: response.data.rate.limit,
        remaining: response.data.rate.remaining,
        reset: response.data.rate.reset,
        used: response.data.rate.used,
      };

      if (rateLimit.remaining < this.rateLimitWarningThreshold) {
        const resetDate = new Date(rateLimit.reset * 1000);
        console.warn(
          `⚠️  GitHub API rate limit low: ${rateLimit.remaining}/${rateLimit.limit} remaining. Resets at ${resetDate.toISOString()}`
        );
      }

      return rateLimit;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * List all repositories accessible to the authenticated user
   */
  async listRepositories(params?: {
    type?: 'all' | 'owner' | 'public' | 'private' | 'member';
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<Repository[]> {
    try {
      const response = await this.octokit.repos.listForAuthenticatedUser({
        type: params?.type || 'all',
        sort: params?.sort || 'updated',
        direction: params?.direction || 'desc',
        per_page: params?.per_page || 100,
        page: params?.page || 1,
      });

      return response.data as Repository[];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search for code across all accessible repositories
   */
  async searchCode(query: string, params?: {
    per_page?: number;
    page?: number;
  }): Promise<{ items: CodeSearchResult[]; total_count: number }> {
    try {
      const response = await this.octokit.search.code({
        q: query,
        per_page: params?.per_page || 30,
        page: params?.page || 1,
      });

      return {
        items: response.data.items as CodeSearchResult[],
        total_count: response.data.total_count,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get file content from a repository
   */
  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    ref?: string
  ): Promise<FileContent> {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });

      // Handle directory case
      if (Array.isArray(response.data)) {
        throw new Error(`Path '${path}' is a directory, not a file`);
      }

      const file = response.data as FileContent;

      // Decode base64 content if present
      if (file.content && file.encoding === 'base64') {
        file.content = Buffer.from(file.content, 'base64').toString('utf-8');
      }

      return file;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * List issues across repositories with optional filtering
   */
  async listIssues(params?: {
    filter?: 'assigned' | 'created' | 'mentioned' | 'subscribed' | 'all';
    state?: 'open' | 'closed' | 'all';
    labels?: string;
    sort?: 'created' | 'updated' | 'comments';
    direction?: 'asc' | 'desc';
    since?: string;
    per_page?: number;
    page?: number;
  }): Promise<Issue[]> {
    try {
      const response = await this.octokit.issues.listForAuthenticatedUser({
        filter: params?.filter || 'assigned',
        state: params?.state || 'open',
        labels: params?.labels,
        sort: params?.sort || 'updated',
        direction: params?.direction || 'desc',
        since: params?.since,
        per_page: params?.per_page || 30,
        page: params?.page || 1,
      });

      return response.data as Issue[];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * List issues for a specific repository
   */
  async listRepoIssues(
    owner: string,
    repo: string,
    params?: {
      state?: 'open' | 'closed' | 'all';
      labels?: string;
      sort?: 'created' | 'updated' | 'comments';
      direction?: 'asc' | 'desc';
      since?: string;
      per_page?: number;
      page?: number;
    }
  ): Promise<Issue[]> {
    try {
      const response = await this.octokit.issues.listForRepo({
        owner,
        repo,
        state: params?.state || 'open',
        labels: params?.labels,
        sort: params?.sort || 'updated',
        direction: params?.direction || 'desc',
        since: params?.since,
        per_page: params?.per_page || 30,
        page: params?.page || 1,
      });

      return response.data as Issue[];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create an issue in a specific repository
   */
  async createIssue(
    owner: string,
    repo: string,
    params: {
      title: string;
      body?: string;
      assignees?: string[];
      labels?: string[];
      milestone?: number;
    }
  ): Promise<Issue> {
    try {
      const response = await this.octokit.issues.create({
        owner,
        repo,
        title: params.title,
        body: params.body,
        assignees: params.assignees,
        labels: params.labels,
        milestone: params.milestone,
      });

      return response.data as Issue;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get repository tree (directory structure)
   */
  async getRepositoryTree(
    owner: string,
    repo: string,
    treeSha?: string,
    recursive: boolean = true
  ): Promise<TreeNode[]> {
    try {
      // If no tree SHA provided, get the default branch first
      if (!treeSha) {
        const repoData = await this.octokit.repos.get({ owner, repo });
        const defaultBranch = repoData.data.default_branch;
        const branchData = await this.octokit.repos.getBranch({
          owner,
          repo,
          branch: defaultBranch,
        });
        treeSha = branchData.data.commit.commit.tree.sha;
      }

      const response = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: treeSha,
        recursive: recursive ? 'true' : undefined,
      });

      return response.data.tree as TreeNode[];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle and format errors from GitHub API
   */
  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      const githubError = error as GitHubError & Error;

      // Rate limit error
      if (githubError.status === 403 && githubError.message.includes('rate limit')) {
        return new Error(
          'GitHub API rate limit exceeded. Please wait before making more requests.'
        );
      }

      // Not found error
      if (githubError.status === 404) {
        return new Error('Resource not found. Please check the repository, path, or permissions.');
      }

      // Unauthorized error
      if (githubError.status === 401) {
        return new Error('GitHub authentication failed. Please check your access token.');
      }

      // Validation error
      if (githubError.status === 422) {
        return new Error(`GitHub API validation error: ${githubError.message}`);
      }

      return new Error(`GitHub API error: ${githubError.message}`);
    }

    return new Error('Unknown error occurred while accessing GitHub API');
  }
}
