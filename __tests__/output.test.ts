import * as output from '../src/output'

import {expect, test} from '@jest/globals'

test('writeOutputs', () => {
    const sink: output.OutputSink = {
        setOutput: (name: string, value: string) => {
            expect(name).toEqual('install-path')
            expect(value).toEqual('/tmp')
        }
    }

    output.writeOutputs(sink, {installPath: '/tmp'})
})
