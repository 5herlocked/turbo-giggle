import * as cdk from 'aws-cdk-lib';
import { BuildEnvironmentVariableType, Project, Source } from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class WorkloadBuilder extends cdk.Stack {
  constructor(scope: Construct, id: string, owner: string, branch: string, repoName: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const account = props?.env?.account!;
    const region = props?.env?.region!;
    
    const ecr_repo = new Repository(this, 'ECR-Repository', {
      repositoryName: repoName,
    });
    
    const custom_service_policy = new PolicyDocument({
      statements: [new PolicyStatement({
        actions: [
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:GetAuthorizationToken",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart"
        ],
        resources: [ecr_repo.repositoryArn],
        principals: [new ServicePrincipal('codebuild.amazonaws.com')]
      })],
    });
    
    const service_role = new Role(this, 'Service-Role', {
      roleName: repoName + '-code-build-service-role',
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
      description: 'Service Role to be assumed by the CodeBuild to publish to ECR',
      inlinePolicies: {
        'Custom-Policy': custom_service_policy,
      }
    });

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
      },
      role: service_role,
    });
  }
}