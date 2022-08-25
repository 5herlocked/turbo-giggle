#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import ClusterConstruct from '../lib/eks-blueprint';
import PipelineConstruct from '../lib/pipeline';
import KNativeAddOn from '../lib/knative-addon';

const app = new cdk.App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region }
 
const eksCluster = new ClusterConstruct(app, 'cluster', { env });
const gitopsPipeline = new PipelineConstruct(app, 'pipeline', { env });
