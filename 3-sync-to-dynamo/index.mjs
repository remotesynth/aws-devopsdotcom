// The LaunchDarkly Node Server SDK
import LaunchDarkly from "launchdarkly-node-server-sdk";
// The SDK add-on for DynamoDB support
import { DynamoDBFeatureStore } from "launchdarkly-node-server-sdk-dynamodb";

export const handler = (event, context, callback) => {
  setTimeout(() => {
    // configure the store before the SDK client
    const store = DynamoDBFeatureStore(process.env.DYNAMODB_TABLE, {
      cacheTTL: 30,
    });

    var ldConfig = {
      featureStore: store,
    };
    // initialize the LaunchDarkly client with the feature store
    var client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY, ldConfig);

    // the connected DynamoDB key store will automatically be updated with flag values
    // use a webhook integration to call this function whenever flag is updated
    client.once("ready", () => {
      client.close();
      callback(null, "store updated");
    });
  }, 2000); // initialize after some delay to ensure that LD caches have been purged
};
