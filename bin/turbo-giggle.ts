#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import ClusterConstruct from '../lib/eks-blueprint';
import PipelineConstruct from '../lib/cluster-pipeline';
import { WorkloadBuilder } from '../lib/workload-builder';

const app = new cdk.App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region }
 
const eksCluster = new ClusterConstruct(app, 'cluster', { env });
const consumerBuilder = new WorkloadBuilder(app, 'ingester-builder', '5herlocked', 'main', 'video-consumer-knative-microservice', { env });
const ingesterBuilder = new WorkloadBuilder(app, 'consumer-builder', '5herlocked', 'main', 'kinesis-knative-ingest', { env });
const gitopsPipeline = new PipelineConstruct(app, 'pipeline', { env });
