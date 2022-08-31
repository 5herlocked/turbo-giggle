import * as cdk from 'aws-cdk-lib';
import { BuildEnvironmentVariableType, Project, Source } from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';
import { Repository } from 'aws-cdk-lib/aws-ecr';

export class WorkloadBuilder extends cdk.Stack {
  constructor(scope: Construct, id: string, owner: string, branch: string, repoName: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const account = props?.env?.account!;
    const region = props?.env?.region!;
    
    const ecr_repo = new Repository(this, 'ECR-Repository', {
      repositoryName: repoName,
    })

    const repo = Source.gitHub({
      owner: owner,
      repo: repoName,
      branchOrRef: branch,
      webhook: true,
    });

    const buildProject = new Project(this, 'CodeBuildProject', {
      projectName: repoName,
      source: repo,
      environmentVariables: {
        'AWS_DEFAULT_REGION': {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: region
        },
        'AWS_ACCOUNT_ID': {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: account
        },
        'IMAGE_TAG': {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: 'latest'
        },
        'IMAGE_REPO_NAME': {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: repoName,
        }
      }
    });

    // const input = CodePipelineSource.gitHub(githubURL, branch);

    // const pipelineProject = new PipelineProject(this, 'Project', {
    //   projectName: 'KinesisIngestBuilder',
    //   environment: {
    //     buildImage: LinuxBuildImage.STANDARD_6_0,
    //     privileged: true,
    //     computeType: ComputeType.SMALL,
    //     environmentVariables: {
    //       'AWS_DEFAULT_REGION': {
    //         type: BuildEnvironmentVariableType.PLAINTEXT,
    //         value: region
    //       },
    //       'AWS_ACCOUNT_ID': {
    //         type: BuildEnvironmentVariableType.PLAINTEXT,
    //         value: account
    //       },
    //       'IMAGE_TAG': {
    //         type: BuildEnvironmentVariableType.PLAINTEXT,
    //         value: 'latest'
    //       },
    //       'IMAGE_REPO_NAME': {
    //         type: BuildEnvironmentVariableType.PLAINTEXT,
    //         value: repoName,
    //       }
    //     }
    //   }
    // });

    
  }
}