<!-- start title -->

# GitHub Action: Pull Release Label Toggle

<!-- end title -->
<!-- start description -->

Creates or updates a PR label based on Success or Failure of GitHub Action Steps

<!-- end description -->

Allows toggling of a label between two states, such as success or failure.
This action should be used with: if: always()
This action will check the actual status
i.e. `Unit Tests Success` > `Unit Tests Failing`
To access other repos pull requests, add an environment variable to this action of:

```yaml
env:
  GITHUB_TOKEN: your token
```

<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: Broadshield/github-action-pr-label-toggle@v1.1.6
  with:
    # This is a word like Passing, Success, Found, or 👍
    status_true_message: ""

    # This is a word like Error, Failure, Success, Not Found, or 👎
    status_false_message: ""

    # The prefix of the label to toggle like Unit Tests, DB Dump
    label_prefix: ""

    # This is a boolean status that can be passed in to override the detected status.
    # Default: false
    status: ""

    # The GitHub token to use for authentication.
    # Default: ${{github.token}}
    github_token: ""

    # The PR number to change the labels on. This is used when the action is triggered
    # by something other than a PR such as a PR comment, or a push, or anything else.
    pr_number: ""

    # If not provided, this is the same as github.repository i.e: The owner and
    # repository name. For example, Codertocat/Hello_World
    repository: ""

    # If true, do not update the label, just output the generated name
    # Default: false
    generate_only: ""

    # Switch the default `Success` to `✅` and `Failed` to `❌`
    # Default: false
    use_emoji: ""

    # the label prefix will be generated from the current action's job name:
    # underscores and hyphens are turned to spaces, first letter of each word
    # is capitalized.
    # Means the `label_prefix` can be empty.
    # `unit_tests` -> `Unit Tests`
    # `spellcheck` -> `Spellcheck`
    # Default: false
    use_job_name_as_prefix: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                               | **Description**                                                                                                                                                                                                                                                                                                | **Default**                    | **Required** |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------ |
| **<code>status_true_message</code>**    | This is a word like Passing, Success, Found, or 👍                                                                                                                                                                                                                                                             |                                | **false**    |
| **<code>status_false_message</code>**   | This is a word like Error, Failure, Success, Not Found, or 👎                                                                                                                                                                                                                                                  |                                | **false**    |
| **<code>label_prefix</code>**           | The prefix of the label to toggle like Unit Tests, DB Dump                                                                                                                                                                                                                                                     |                                | **false**    |
| **<code>status</code>**                 | This is a boolean status that can be passed in to override the detected status.                                                                                                                                                                                                                                |                                | **false**    |
| **<code>github_token</code>**           | The GitHub token to use for authentication.                                                                                                                                                                                                                                                                    | <code>${{github.token}}</code> | **false**    |
| **<code>pr_number</code>**              | The PR number to change the labels on. This is used when the action is triggered by something other than a PR such as a PR comment, or a push, or anything else.                                                                                                                                               |                                | **false**    |
| **<code>repository</code>**             | If not provided, this is the same as github.repository i.e: The owner and repository name. For example, Codertocat/Hello_World                                                                                                                                                                                 |                                | **false**    |
| **<code>generate_only</code>**          | If true, do not update the label, just output the generated name                                                                                                                                                                                                                                               |                                | **false**    |
| **<code>use_emoji</code>**              | Switch the default <code>Success</code> to <code>✅</code> and <code>Failed</code> to <code>❌</code>                                                                                                                                                                                                          |                                | **false**    |
| **<code>use_job_name_as_prefix</code>** | the label prefix will be generated from the current action's job name:<br />underscores and hyphens are turned to spaces, first letter of each word<br />is capitalized.<br />Means the <code>label_prefix</code> can be empty.<br />`unit_tests` -> `Unit Tests`<br />`spellcheck` -> <code>Spellcheck</code> |                                | **false**    |

<!-- end inputs -->
<!-- start outputs -->

| \***\*Output\*\***             | \***\*Description\*\***          | \***\*Default\*\*** | \***\*Required\*\*** |
| ------------------------------ | -------------------------------- | ------------------- | -------------------- |
| <code>add_label_name</code>    | The label name to add            | undefined           | undefined            |
| <code>remove_label_name</code> | The label name to remove         | undefined           | undefined            |
| <code>repository</code>        | The repository to update         | undefined           | undefined            |
| <code>pr_number</code>         | The pull request that is updated | undefined           | undefined            |

<!-- end outputs -->
<!-- start [.github/ghdocs/examples/] -->
<!-- end [.github/ghdocs/examples/] -->
