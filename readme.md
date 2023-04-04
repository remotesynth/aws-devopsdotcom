# Using LaunchDarkly in AWS Serverless

The examples here show how to integrate LaunchDarkly within AWS Serverless using Lamba and DynamoDB. They were presented as part of a webinar to DevOps.com on April 6, 2023. Each folder contains a version of the same Lambda implemented in CommonJS and in ESModule formats. They contain the following examples:

0. The `lamda-layers` folder contains the layers used throughout the examples. Layers make it easier to add and manage a dependency like LaunchDarkly's SDKs across multiple Lambdas.
1. The `basic-integration` shows how to add LaunchDarkly to a Lambda built with Node.js and get the value of a flag.
2. The `user-targeting` example shows how to get user data passed from a JWT token and pass that to LaunchDarkly to get a user targeted flag variation. Note that this also requires the `jswebtoken` library. The token is passed in the `Authortization` header of the request and should contain an email address under the object key of `key`.
3. The `sync-to-dynamo` example will write the value of all the flags for the LaunchDarkly environment (specified by the SDK key) to a DynamoDB table. To enable this to sync automatically, you'll need to ensure that it has a function URL and to call this URL via a webhook integration in LaunchDarkly.
4. The `read-from-dynamo` example updates the prior `user-targeting` example to use DynamoDB as the source of truth rather than LaunchDarkly. This assumes that the synchronisation is working in order to get proper flag updates.
5. The `sending-analytics-on-shutdown` example shows how to ensure that all of the analytics events created by flag calls are sent back to LaunchDarkly prior to a Lambda shutting down. It relies on the `LambdaInsightsExtension` layer being added to the Lambda.