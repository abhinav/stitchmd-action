// Outputs from the action.
//
// Should match the outputs defined in action.yml.
export interface Outputs {
    installPath?: string
    checkFailed?: boolean
}

// Output context of the action.
//
// Matches the context provided by GitHub Actions.
export interface OutputSink {
    setOutput(name: string, value: string): void
}

// writeOutputs writes the given outputs to the given context.
export function writeOutputs(sink: OutputSink, outputs: Outputs): void {
    if (outputs.installPath !== undefined) {
        sink.setOutput('install-path', outputs.installPath)
    }
    if (outputs.checkFailed !== undefined) {
        sink.setOutput('check-failed', outputs.checkFailed.toString())
    }
}
