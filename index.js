const { Toolkit } = require('actions-toolkit')

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

    repos = repository || process.env.GITHUB_REPOSITORY
    if (!repos) {
        tools.exit.failure('There was no repository found or provided!')
    }
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

    tools.core.setOutput('add_label_name', addLabel)
    tools.core.setOutput('remove_label_name', removeLabel)
    tools.core.setOutput('repository', repos)
    tools.core.setOutput('pr_number', number)


    if (generate_only === true || generate_only === 'true') {
        // exit early
        tools.exit.success('We did it team!')
    }

    const { owner, repo } = repos.split('/')

    const pull_response = await tools.github.pulls.get({ owner: owner, repo: repo, pull_number: number })

    const { id, labels } = pull_response.data
    let addLabelExists = false
    for (let l of labels) {
        if (l.name.startsWith(removeLabel)) {
            github.issues.removeLabel({ issue_number: number, owner: owner, repo: repo, name: removeLabel })
        }
        if (l.name.startsWith(addLabel)) {
            addLabelExists = true
        }
    }

    if (addLabelExists === false) {
        github.issues.addLabels({ issue_number: number, owner: owner, repo: repo, labels: [addLabel] })
    }


    tools.exit.success('Label update complete')
})
