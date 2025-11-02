import * as output from '../src/output'

import {expect, test} from '@jest/globals'

test.each([
    {
        name: 'install-path',
        give: {installPath: 'foo'} as output.Outputs,
        want: {'install-path': 'foo'}
    },
    {
        name: 'check-failed',
        give: {checkFailed: true},
        want: {'check-failed': 'true'}
    },
    {
        name: 'check-failed false',
        give: {checkFailed: false},
        want: {'check-failed': 'false'}
    }
])('writeOutputs($name)', ({give, want}) => {
    const got: Record<string, string> = {}
    const sink: output.OutputSink = {
        setOutput: (name: string, value: string) => {
            got[name] = value
        }
    }

    output.writeOutputs(sink, give)
    expect(got).toEqual(want)
})
