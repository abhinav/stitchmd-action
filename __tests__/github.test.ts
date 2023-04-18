import * as github from '../src/github'

import {expect, test} from '@jest/globals'

test('getLatestRelease', async () => {
    const client: github.GitHubRestClient = {
        getLatestRelease: async params => {
            expect(params.owner).toEqual('abhinav')
            expect(params.repo).toEqual('stitchmd')

            return {
                data: {
                    id: 1,
                    tag_name: 'v1.0.0'
                }
            }
        },
        getReleaseByTag: async () => {
            throw new Error('unexpected call')
        }
    }

    const gateway = new github.Gateway(client)
    const release = await gateway.getLatestRelease()
    expect(release.id).toEqual(1)
    expect(release.tag_name).toEqual('v1.0.0')
})

test('getReleaseByTag', async () => {
    const client: github.GitHubRestClient = {
        getLatestRelease: async () => {
            throw new Error('unexpected call')
        },
        getReleaseByTag: async params => {
            expect(params.owner).toEqual('abhinav')
            expect(params.repo).toEqual('stitchmd')
            expect(params.tag).toEqual('v1.0.0')

            return {
                data: {
                    id: 1,
                    tag_name: 'v1.0.0'
                }
            }
        }
    }

    const gateway = new github.Gateway(client)
    const release = await gateway.getReleaseByTag('v1.0.0')
    expect(release.id).toEqual(1)
    expect(release.tag_name).toEqual('v1.0.0')
})
