const { Toolkit } = require('actions-toolkit')

Toolkit.run(async tools => {
    let event_pr_number = null
    const { context } = tools
    if (tools.context.event === 'pull_request') {
        event_pr_number = context.payload.number
    }

    const {
        status_true_message = "Success",
        status_false_message = "Failed",
        label_prefix,
        status,
        pr_number = event_pr_number,
        repository = context.repository,
        generate_only = false
    } = tools.inputs

    if (!pr_number) {
        tools.exit.failure('This is not a pull_request event, and there was no pr_number provided!')
    }
    if (!repository) {
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
    tools.core.setOutput('repository', repository)
    tools.core.setOutput('pr_number', pr_number)


    if (generate_only === true || generate_only === 'true') {
        // exit early
        tools.exit.success('We did it team!')
    }

    const { owner, repo } = repository.split('/')

    const pull_response = await tools.github.pulls.get({ owner: owner, repo: repo, pull_number: pr_number })

    const { id, labels } = pull_response.data
    let addLabelExists = false
    for (let l of labels) {
        if (l.name.startsWith(removeLabel)) {
            github.issues.removeLabel({ issue_number: pr_number, owner: owner, repo: repo, name: removeLabel })
        }
        if (l.name.startsWith(addLabel)) {
            addLabelExists = true
        }
    }

    if (addLabelExists === false) {
        github.issues.addLabels({ issue_number: pr_number, owner: owner, repo: repo, labels: [addLabel] })
    }


    tools.exit.success('Label update complete')
})
