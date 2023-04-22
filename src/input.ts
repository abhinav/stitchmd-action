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
export type Inputs =
    | {
          mode: Mode.Install
          version: string
          githubToken: string
      }
    | {
          summary: string
          output: string
          mode: Mode.Check | Mode.Write
          preface: string
          offset: number
          noToc: boolean
          version: string
          githubToken: string
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
    const mode = src.getInput('mode') || 'check'
    if (!Object.values(Mode).includes(mode as Mode)) {
        throw new Error(`Invalid mode: ${mode}`)
    }

    if (mode === Mode.Install) {
        return {
            mode: Mode.Install,
            version: src.getInput('version') || 'latest',
            githubToken: src.getInput('github-token', {required: true})
        }
    }

    return {
        summary: src.getInput('summary', {required: true}),
        output: src.getInput('output', {required: true}),
        mode: mode as Mode,
        preface: src.getInput('preface') || '',
        offset: parseInt(src.getInput('offset') || '0', 10),
        noToc: src.getBooleanInput('no-toc'),
        version: src.getInput('version') || 'latest',
        githubToken: src.getInput('github-token', {required: true})
    }
}
