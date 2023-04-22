import * as install from '../src/install'

import {expect, test} from '@jest/globals'

test.each([
    {
        platform: 'linux',
        arch: 'x64',
        wantUrl:
            'https://github.com/abhinav/stitchmd/releases/download/v1.2.3/stitchmd-linux-amd64.tar.gz',
        wantFile: 'stitchmd'
    },
    {
        platform: 'darwin',
        arch: 'x64',
        wantUrl:
            'https://github.com/abhinav/stitchmd/releases/download/v1.2.3/stitchmd-darwin-amd64.tar.gz',
        wantFile: 'stitchmd'
    },
    {
        platform: 'win32',
        arch: 'x64',
        wantUrl:
            'https://github.com/abhinav/stitchmd/releases/download/v1.2.3/stitchmd-windows-amd64.tar.gz',
        wantFile: 'stitchmd.exe'
    }
])(
    'install latest $platform $arch',
    async ({platform, arch, wantUrl, wantFile}) => {
        const githubGateway: install.GitHubGateway = {
            getLatestRelease: async () => {
                return {
                    id: 1,
                    tag_name: 'v1.2.3'
                }
            },
            getReleaseByTag: async (tag: string) => {
                throw new Error(`unexpected call to getReleaseByTag(${tag})`)
            }
        }

        const toolCache: install.ToolCache = {
            downloadTool: async (url: string) => {
                expect(url).toEqual(wantUrl)
                return 'downloadPath'
            },
            extractTar: async (_downloadPath: string) => {
                return 'extractedPath'
            },
            cacheDir: async () => {
                return 'cacheDir'
            }
        }

        const installer = new install.Installer({
            github: githubGateway,
            toolcache: toolCache
        })

        const path = await installer.install({
            platform,
            arch,
            version: 'latest'
        })

        expect(path).toEqual(`cacheDir/${wantFile}`)
    }
)
