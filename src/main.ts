import * as os from 'os'

import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import * as toolcache from '@actions/tool-cache'

import {Inputs, Mode, newInputs} from './input'
import {writeOutputs, Outputs} from './output'
import {Gateway as GitHubGateway} from './github'
import * as install from './install'
import * as stitchmd from './stitchmd'

async function main(): Promise<void> {
    const outputs: Outputs = {}
    try {
        const inputs: Inputs = newInputs(core)

        const repos = github.getOctokit(inputs.githubToken, {
            userAgent: 'stitchmd-action'
        }).rest.repos
        const githubGateway = new GitHubGateway(repos)

        const installer = new install.Installer({
            github: githubGateway,
            toolcache
        })

        const installPath = await installer.install({
            platform: os.platform(),
            arch: os.arch(),
            version: inputs.version
        })
        outputs.installPath = installPath

        if (inputs.mode === Mode.Install) {
            core.info(`Installed stitchmd to ${installPath}`)
            return
        }

        const runner = new stitchmd.Runner(exec, installPath)
        const check = inputs.mode === Mode.Check
        const result = await runner.run({
            ...inputs,
            diff: check
        })

        if (check) {
            if (result.stdout.length > 0) {
                outputs.checkFailed = true
                if (!inputs.checkCanFail) {
                    core.setFailed(`${inputs.output} is not up to date`)
                }
            } else {
                core.info(`${inputs.output} is up to date`)
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    } finally {
        writeOutputs(core, outputs)
    }
}

void main()
