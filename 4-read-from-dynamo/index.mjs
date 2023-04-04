// The LaunchDarkly Node Server SDK
import LaunchDarkly from "launchdarkly-node-server-sdk";
// The SDK add-on for DynamoDB support
import { DynamoDBFeatureStore } from "launchdarkly-node-server-sdk-dynamodb";
// for decrypting JWT tokens
import jwt from "jsonwebtoken";

// configure the store before the SDK client
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
// make sure that the client is done initializing
await client.waitForInitialization();

export const handler = async (event) => {
  // decrypt the JWT token to get the user key
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
