import * as stitchmd from '../src/stitchmd'

import {expect, test} from '@jest/globals'

test.each([
    {
        desc: 'minimal',
        give: {summary: 'summary', output: 'output', diff: false},
        want: ['-o', 'output', 'summary']
    },
    {
        desc: 'diff',
        give: {summary: 'summary', output: 'output', diff: true},
        want: ['-o', 'output', '-diff', 'summary']
    },
    {
        desc: 'preface',
        give: {
            summary: 'summary',
            output: 'output',
            diff: false,
            preface: 'preface'
        },
        want: ['-o', 'output', '-preface', 'preface', 'summary']
    },
    {
        desc: 'offset',
        give: {
            summary: 'summary',
            output: 'output',
            diff: false,
            offset: 1
        },
        want: ['-o', 'output', '-offset', '1', 'summary']
    },
    {
        desc: 'noToc',
        give: {
            summary: 'summary',
            output: 'output',
            diff: false,
            noToc: true
        },
        want: ['-o', 'output', '-no-toc', 'summary']
    }
])('buildArgList(%#)', ({give, want}) => {
    const got = stitchmd.buildArgList(give)
    expect(got).toEqual(want)
})

test('run/write', async () => {
    const exec: stitchmd.Executor = {
        exec: async (cmd: string) => {
            expect(cmd).toEqual('stitchmd')
            // Don't bother checking argument list.
            // We'll validate that separately.
            return 0
        }
    }

    const args: stitchmd.Args = {
        summary: 'summary',
        output: 'output',
        diff: false
    }

    const runner = new stitchmd.Runner(exec, 'stitchmd')
    const result = await runner.run(args)
    expect(result.stdout).toEqual('')
})

test('run/diff', async () => {
    const exec: stitchmd.Executor = {
        exec: async (_cmd, _args, options) => {
            if (options && options.listeners && options.listeners.stdout) {
                options.listeners.stdout(Buffer.from('diff'))
            }
            return 0
        }
    }

    const args: stitchmd.Args = {
        summary: 'summary',
        output: 'output',
        diff: true
    }

    const runner = new stitchmd.Runner(exec, 'stitchmd')
    const result = await runner.run(args)
    expect(result.stdout).toEqual('diff')
})
