import * as input from '../src/input'

import {expect, test} from '@jest/globals'

function mapInputSource(values: {[key: string]: string}): input.InputSource {
    return {
        getInput: (name: string, options?: input.InputOptions) => {
            if (options?.required && values[name] === undefined) {
                throw new Error(`Missing input: ${name}`)
            }
            return values[name] || ''
        },
        getBooleanInput: (name: string) => {
            return values[name] === 'true'
        }
    }
}

test('newInputs/missing', () => {
    const src = mapInputSource({})
    expect(() => input.newInputs(src)).toThrow('Missing input: summary')
})

test('newInputs/invalidMode', () => {
    const src = mapInputSource({
        summary: 'summary',
        output: 'output',
        mode: 'invalid'
    })

    expect(() => input.newInputs(src)).toThrow('Invalid mode: invalid')
})

test.each([
    {
        name: 'install',
        give: {
            mode: 'install',
            version: 'version',
            'github-token': 'github-token'
        } as {[key: string]: string},
        want: {
            mode: input.Mode.Install,
            version: 'version',
            githubToken: 'github-token'
        }
    },
    {
        name: 'check',
        give: {
            summary: 'summary',
            output: 'output',
            mode: 'check',
            preface: 'preface',
            offset: '1',
            'no-toc': 'true',
            version: 'version',
            'github-token': 'github-token'
        },
        want: {
            summary: 'summary',
            output: 'output',
            mode: input.Mode.Check,
            preface: 'preface',
            offset: 1,
            noToc: true,
            version: 'version',
            githubToken: 'github-token'
        }
    }
])('newInputs/$name', ({give, want}) => {
    const src = mapInputSource(give)
    const inputs = input.newInputs(src)
    expect(inputs).toEqual(want)
})
