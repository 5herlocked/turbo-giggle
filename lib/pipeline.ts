import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { TeamPlatform, TeamApplication } from '../teams';

export default class PipelineConstruct extends Construct {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id)
        
        const account = props?.env?.account!;
        const region = props?.env?.region!;
        
        const blueprint = blueprints.EksBlueprint.builder()
            .account(account)
            .region(region)
            .addOns(new blueprints.ClusterAutoScalerAddOn)
            .teams(new TeamPlatform(account), new TeamApplication('sherlock', account));
            
        const repoUrl = 'https://github.com/aws-samples/eks-blueprints-workloads.git'

        const bootstrapRepo : blueprints.ApplicationRepository = {
            repoUrl,
            targetRevision: 'workshop',
        }
        
        const devBootstrapArgo = new blueprints.ArgoCDAddOn({
        bootstrapRepo: {
            ...bootstrapRepo,
            path: 'envs/dev'
        },
        });
            
        blueprints.CodePipelineStack.builder()
            .name('eks-blueprints-workshop-pipeline')
            .owner('5herlocked')
            .repository({
                    repoUrl: 'turbo-giggle',
                    credentialsSecretName: 'github-token',
                    targetRevision: 'main'
            })
            .wave({
                id: "envs",
                stages: [
                    { id: 'dev', stackBuilder: blueprint.clone('us-east-1').addOns(devBootstrapArgo) },
                ]
            })
            .build(scope, id+'-stack', props);
    }
}