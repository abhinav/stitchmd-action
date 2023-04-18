import {toPlatformPath} from '@actions/core'

export interface Args {
    summary: string
    output: string
    diff: boolean
    preface?: string
    offset?: number
    no_toc?: boolean
}

export function buildArgList(args: Args): string[] {
    const result: string[] = []
    result.push('-o', toPlatformPath(args.output))
    if (args.preface) {
        result.push('-preface', toPlatformPath(args.preface))
    }
    if (args.offset) {
        result.push('-offset', args.offset.toString())
    }
    if (args.no_toc) {
        result.push('-no-toc')
    }
    if (args.diff) {
        result.push('-diff')
    }
    result.push(toPlatformPath(args.summary))
    return result
}

export interface RunResult {
    stdout: string
}

export interface Executor {
    exec(
        exe: string,
        args: string[],
        options?: {
            listeners?: {
                stdout?: (data: Buffer) => void
            }
        }
    ): Promise<number>
}

export class Runner {
    private readonly installPath: string
    private readonly exec: Executor

    constructor(exec: Executor, installPath: string) {
        this.installPath = installPath
        this.exec = exec
    }

    async run(args: Args): Promise<RunResult> {
        const stdout: number[] = []
        let stdout_listener: ((data: Buffer) => void) | undefined
        if (args.diff) {
            stdout_listener = (data: Buffer) => {
                stdout.push(...data.values())
            }
        }

        await this.exec.exec(this.installPath, buildArgList(args), {
            listeners: {
                stdout: stdout_listener
            }
        })

        return {
            stdout: Buffer.from(stdout).toString()
        }
    }
}
