const stitchmdOwner = 'abhinav'
const stitchmdRepo = 'stitchmd'

// Release is a GitHub release.
export interface Release {
    id: number
    tag_name: string
}

// GitHubRestClient is a subset of the GitHub REST API client.
export interface GitHubRestClient {
    getLatestRelease(params: {
        owner: string
        repo: string
    }): Promise<{data: Release}>
    getReleaseByTag(params: {
        owner: string
        repo: string
        tag: string
    }): Promise<{data: Release}>
}

// Gateway gates access to GitHub, providing a domain-specific API.
export class Gateway {
    private readonly client: GitHubRestClient

    // Builds a new Gateway that uses the provided client
    // to make requests to GitHub.
    constructor(client: GitHubRestClient) {
        this.client = client
    }

    // getLatestRelease returns information about
    // the latest release of stitchmd.
    async getLatestRelease(): Promise<Release> {
        const {data} = await this.client.getLatestRelease({
            owner: stitchmdOwner,
            repo: stitchmdRepo
        })
        return data
    }

    // getReleaseByTag returns information about
    // the release of stitchmd with the given tag.
    async getReleaseByTag(tag: string): Promise<Release> {
        const {data} = await this.client.getReleaseByTag({
            owner: stitchmdOwner,
            repo: stitchmdRepo,
            tag
        })
        return data
    }
}
