// The LaunchDarkly Node Server SDK
const LaunchDarkly = require("launchdarkly-node-server-sdk");
// The SDK add-on for DynamoDB support
const {
  DynamoDBFeatureStore,
} = require("launchdarkly-node-server-sdk-dynamodb");
// for decrypting JWT tokens
const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  const store = DynamoDBFeatureStore(process.env.DYNAMODB_TABLE, {
    cacheTTL: 30,
  });

  // useLdd launches the client in daemon mode where flag values come
  // from the data store (i.e. dynamodb)
  const options = {
    featureStore: store,
    useLdd: true,
  };

  const client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY, options);
  await client.waitForInitialization();

  const header = await jwt.verify(
    event.headers.Authorization,
    process.env.SECRET_KEY
  );

  // we're passing in the user key from the JWT token
  const context = {
    kind: "user",
    key: header.key,
  };

  // if the user is in the internal users segemnt they
  // will get a different response, which could lead to
  // different code paths within the Lambda
  const exampleLDCall = await client.variation(
    "targeted-lambda-flag",
    context,
    "this is a default value"
  );

  // this is not necessary here but it ensures that all
  // analytics events are immediate sent to LaunchDarkly
  // which is helpful for debugging
  client.flush();

  const response = {
    statusCode: 200,
    body: JSON.stringify(exampleLDCall),
  };
  return response;
};

// you will need to add the LambdaInsightsExtension to the
// Layers on your Lambda function for this to work
process.on("SIGTERM", async () => {
  console.info("[runtime] SIGTERM received");

  console.info("[runtime] cleaning up");
  // flush is currently required for the Node SDK
  await client.flush();
  client.close();
  console.info("LaunchDarkly connection closed");

  console.info("[runtime] exiting");
  process.exit(0);
});
