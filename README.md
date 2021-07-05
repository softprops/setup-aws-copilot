# Setup AWS Copilot

> 👩‍✈️A GitHub Action for setting up the [AWS Copilot command line interface](https://github.com/aws/copilot-cli)

## usage

Add a step to your workflow to install AWS Copilot

```yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Setup AWS Copilot
      uses: cooltra/setup-aws-copilot@v1

```

#### inputs

| Name        | Type    | Description                                                     |
|-------------|---------|-----------------------------------------------------------------|
| `version`      | string  | version of [Copilot cli release](https://github.com/aws/copilot-cli/releases) defaults to latest version                |


Doug Tangren (softprops) 2020.
