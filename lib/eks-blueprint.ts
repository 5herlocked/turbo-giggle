import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';

export default class ClusterConstruct extends Construct {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id);

        const account = props?.env?.account!;
        const region = props?.env?.region!;

        const nodeGrpProps = {
            minSize: 1,
            maxSize: 2,
            desiredSize: 1,
            instanceTypes: [new cdk.aws_ec2.InstanceType('m5a.large')],
            amiType: cdk.aws_eks.NodegroupAmiType.AL2_X86_64,
            nodeGroupCapacityType: cdk.aws_eks.CapacityType.ON_DEMAND,
            version: cdk.aws_eks.KubernetesVersion.V1_21
        };

        const clusterProvider = new blueprints.MngClusterProvider(nodeGrpProps);

        const blueprint = blueprints.EksBlueprint.builder()
            .clusterProvider(clusterProvider)
            .account(account)
            .region(region)
            .addOns()
            .teams()
            .build(scope, id + '-stack');
    }
}