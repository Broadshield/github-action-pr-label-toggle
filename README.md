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
    # Default: Success
    status_true_message: ""

    # This is a word like Error, Failure, Success, Not Found, or 👎
    # Default: Failed
    status_false_message: ""

    # The prefix of the label to toggle like Unit Tests, DB Dump
    label_prefix: ""

    # This is a boolean status that can be passed in to override the detected status.
    # Default: false
    status: ""

    # The GitHub token to use for authentication.
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
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                  | **Description**                                                                                                                                                  | **Default** | **Required** |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------ |
| **`status_true_message`**  | This is a word like Passing, Success, Found, or 👍                                                                                                               | `Success`   | **false**    |
| **`status_false_message`** | This is a word like Error, Failure, Success, Not Found, or 👎                                                                                                    | `Failed`    | **false**    |
| **`label_prefix`**         | The prefix of the label to toggle like Unit Tests, DB Dump                                                                                                       |             | **true**     |
| **`status`**               | This is a boolean status that can be passed in to override the detected status.                                                                                  |             | **false**    |
| **`github_token`**         | The GitHub token to use for authentication.                                                                                                                      |             | **false**    |
| **`pr_number`**            | The PR number to change the labels on. This is used when the action is triggered by something other than a PR such as a PR comment, or a push, or anything else. |             | **false**    |
| **`repository`**           | If not provided, this is the same as github.repository i.e: The owner and repository name. For example, Codertocat/Hello_World                                   |             | **false**    |
| **`generate_only`**        | If true, do not update the label, just output the generated name                                                                                                 |             | **false**    |

<!-- end inputs -->
<!-- start outputs -->

| \***\*Output\*\***  | \***\*Description\*\***          | \***\*Default\*\*** | \***\*Required\*\*** |
| ------------------- | -------------------------------- | ------------------- | -------------------- |
| `add_label_name`    | The label name to add            | undefined           | undefined            |
| `remove_label_name` | The label name to remove         | undefined           | undefined            |
| `repository`        | The repository to update         | undefined           | undefined            |
| `pr_number`         | The pull request that is updated | undefined           | undefined            |

<!-- end outputs -->
<!-- start [.github/ghdocs/examples/] -->
<!-- end [.github/ghdocs/examples/] -->
