import * as core from '@actions/core'

export {InputOptions} from '@actions/core'

// Mode defines the supported execution modes.
export enum Mode {
    // Install will download and install the stitchmd binary.
    Install = 'install',

    // Check will install and run stitchmd,
    // and fail if its output does not match
    // what's on disk.
    Check = 'check',

    // Write will install and run stitchmd,
    // and write its output to disk.
    Write = 'write'
}

// Inputs to the action.
//
// Should match the inputs defined in action.yml.
export interface Inputs {
    summary: string
    output: string
    mode: Mode
    preface: string
    offset: number
    no_toc: boolean
    version: string
    github_token: string
}

// The context of the action.
//
// Matches the context provided by GitHub Actions.
export interface InputSource {
    getInput(name: string, options?: core.InputOptions): string
    getBooleanInput(name: string, options?: core.InputOptions): boolean
}

// newInputs reads inputs from the given context.
//
// It will throw an error if any required inputs are missing.
export function newInputs(src: InputSource): Inputs {
    const summary = src.getInput('summary', {required: true})
    const output = src.getInput('output', {required: true})
    const mode = src.getInput('mode') || 'check'
    if (!Object.values(Mode).includes(mode as Mode)) {
        throw new Error(`Invalid mode: ${mode}`)
    }
    const preface = src.getInput('preface') || ''
    const offset = parseInt(src.getInput('offset') || '0', 10)
    const no_toc = src.getBooleanInput('no-toc')
    const version = src.getInput('version') || 'latest'
    const github_token = src.getInput('github-token', {required: true})

    return {
        summary,
        output,
        mode: mode as Mode,
        preface,
        offset,
        no_toc,
        version,
        github_token
    }
}
