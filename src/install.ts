import * as util from 'util'
import * as path from 'path'

import {Release} from './github'

const repoURL = 'https://github.com/abhinav/stitchmd'

// GitHubGateway matches the API of github.Gateway.
export interface GitHubGateway {
    getLatestRelease(): Promise<Release>
    getReleaseByTag(tag: string): Promise<Release>
}

// ToolCache matches the API of @actions/tool-cache
// and is used to abstract access to the top-level functions in it.
export interface ToolCache {
    downloadTool(url: string): Promise<string>
    extractTar(archivePath: string, dest?: string): Promise<string>
    cacheDir(
        dir: string,
        tool: string,
        version: string,
        arch?: string
    ): Promise<string>
}

// Request is a request to install a release.
export interface Request {
    platform: string
    arch: string
    version: string
}

export interface InstallerConfig {
    github: GitHubGateway
    toolcache: ToolCache
}

// Installer installs specific releases of stitchmd.
export class Installer {
    private readonly github: GitHubGateway
    private readonly toolcache: ToolCache

    // Builds a new Installer that uses the provided GitHubGateway
    // to fetch release information.
    constructor(cfg: InstallerConfig) {
        this.github = cfg.github
        this.toolcache = cfg.toolcache
    }

    // Installs the requested release.
    async install(request: Request): Promise<string> {
        let release: Release
        if (request.version === 'latest') {
            release = await this.github.getLatestRelease()
        } else {
            release = await this.github.getReleaseByTag(request.version)
        }

        // os.platform matches GOOS for all but Windows.
        const goos = request.platform === 'win32' ? 'windows' : request.platform
        const goarch = request.arch === 'x64' ? 'amd64' : request.arch

        const filename = util.format('stitchmd-%s-%s.tar.gz', goos, goarch)
        const url = util.format(
            '%s/releases/download/%s/%s',
            repoURL,
            release.tag_name,
            filename
        )

        // Download, extract, and cache the release.
        const downloadPath = await this.toolcache.downloadTool(url)
        const extractedPath = await this.toolcache.extractTar(downloadPath)
        const cachePath = await this.toolcache.cacheDir(
            extractedPath,
            'stitchmd',
            release.tag_name,
            request.arch
        )

        let exePath = path.join(cachePath, 'stitchmd')
        if (request.platform === 'win32') {
            exePath += '.exe'
        }

        return exePath
    }
}
