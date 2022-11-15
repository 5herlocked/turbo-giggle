import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { NodegroupAmiType, CapacityType, KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { InstanceType } from 'aws-cdk-lib/aws-ec2';

export default class ClusterConstruct extends Construct {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id);

        const account = props?.env?.account!;
        const region = props?.env?.region!;

        const nodeGrpProps = {
            minSize: 1,
            maxSize: 2,
            desiredSize: 1,
            instanceTypes: [new InstanceType('m5a.large')],
            amiType: NodegroupAmiType.AL2_X86_64,
            nodeGroupCapacityType: CapacityType.ON_DEMAND,
            version: KubernetesVersion.V1_23
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