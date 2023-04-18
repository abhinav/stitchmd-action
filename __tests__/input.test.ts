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

test('newInputs/all', () => {
    const src = mapInputSource({
        summary: 'summary',
        output: 'output',
        mode: 'check',
        preface: 'preface',
        offset: '1',
        'no-toc': 'true',
        version: 'version',
        'github-token': 'github-token'
    })

    const inputs = input.newInputs(src)
    expect(inputs.summary).toEqual('summary')
    expect(inputs.output).toEqual('output')
    expect(inputs.mode).toEqual(input.Mode.Check)
    expect(inputs.preface).toEqual('preface')
    expect(inputs.offset).toEqual(1)
    expect(inputs.no_toc).toEqual(true)
    expect(inputs.version).toEqual('version')
    expect(inputs.github_token).toEqual('github-token')
})
