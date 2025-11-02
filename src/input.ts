import * as core from '@actions/core'

export type {InputOptions} from '@actions/core'

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

type InstallInputs = {
    version: string
    githubToken: string
}

type RunInputs = {
    summary: string
    output: string
    preface: string
    offset: number
    noToc: boolean
}

// Inputs to the action.
//
// Should match the inputs defined in action.yml.
export type Inputs = InstallInputs &
    (
        | {mode: Mode.Install}
        | ({mode: Mode.Write} & RunInputs)
        | ({mode: Mode.Check; checkCanFail: boolean} & RunInputs)
    )

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
    const modeStr = src.getInput('mode') || 'check'
    if (!Object.values(Mode).includes(modeStr as Mode)) {
        throw new Error(`Invalid mode: ${modeStr}`)
    }
    const mode = modeStr as Mode

    const installInputs: InstallInputs = {
        version: src.getInput('version') || 'latest',
        githubToken: src.getInput('github-token', {required: true})
    }

    if (mode === Mode.Install) {
        return {mode, ...installInputs}
    }

    const runInputs: RunInputs = {
        summary: src.getInput('summary', {required: true}),
        output: src.getInput('output', {required: true}),
        preface: src.getInput('preface') || '',
        offset: parseInt(src.getInput('offset') || '0', 10),
        noToc: src.getBooleanInput('no-toc')
    }

    if (mode === Mode.Write) {
        return {mode, ...installInputs, ...runInputs}
    }

    return {
        mode: Mode.Check,
        ...installInputs,
        ...runInputs,
        checkCanFail: src.getBooleanInput('check-can-fail') || false
    }
}
