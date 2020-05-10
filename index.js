const { Toolkit } = require('actions-toolkit')
const core = require('@actions/core')

Toolkit.run(async tools => {

    const { context } = tools
    tools.log.info(`Event type is: ${context.event}`)
    let { number } = context.payload

    const {
        status_true_message = "Success",
        status_false_message = "Failed",
        label_prefix,
        status,
        pr_number,
        repository,
        generate_only = false
    } = tools.inputs

    number = pr_number || number
    if (!number) {
        tools.exit.failure('This is not a pull_request event, and there was no pr_number provided!')
    }

    function repo(inputRepo) {
        if (inputRepo) {
            const [owner, repo] = inputRepo.split('/')
            return { owner, repo }
        }
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
            return { owner, repo }
        }

        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            }
        }

        throw new Error('context.repo requires a GITHUB_REPOSITORY environment variable like \'owner/repo\'')
    }

    repos = repo(repository)

    if (!status) { } else if (status === '') {
        tools.log.success('The status was an empty string. \n\
        This happens when the output of the step being checked for a status is empty, \n\
        and its empty because it errored without handling that error. \n\
        Or a previous step errored and the step you are wanting to track was skipped.\n')
    }

    let addLabel, removeLabel
    if (status === true || status === 'true') {
        addLabel = `${label_prefix} ${status_true_message}`
        removeLabel = `${label_prefix} ${status_false_message}`
    } else {
        addLabel = `${label_prefix} ${status_false_message}`
        removeLabel = `${label_prefix} ${status_true_message}`
    }

    core.setOutput('add_label_name', addLabel)
    core.setOutput('remove_label_name', removeLabel)
    core.setOutput('repository', repos)
    core.setOutput('pr_number', number)


    if (generate_only === true || generate_only === 'true') {
        // exit early
        tools.exit.success('We did it team!')
    }


    core.debug(`The query fields: ${JSON.stringify({ ...repos, pull_number: number })}`)
    const pull_response = await tools.github.pulls.get({ ...repos, pull_number: number })

    const { id, labels } = pull_response.data
    let addLabelExists = false
    for (let l of labels) {
        if (l.name.startsWith(removeLabel)) {
            core.debug(`Removing label ${removeLabel}`)
            github.issues.removeLabel({ ...repos, issue_number: number, name: removeLabel })
        }
        if (l.name.startsWith(addLabel)) {
            core.debug(`Label ${addLabel} already in place`)
            addLabelExists = true
        }
    }

    if (addLabelExists === false) {
        core.debug(`Adding label ${addLabel}`)
        github.issues.addLabels({ ...repos, issue_number: number, labels: [addLabel] })
    }


    tools.exit.success('Label update complete')
})
