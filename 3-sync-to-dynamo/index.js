// The LaunchDarkly Node Server SDK
const LaunchDarkly = require("launchdarkly-node-server-sdk");
// The SDK add-on for DynamoDB support
const {
  DynamoDBFeatureStore,
} = require("launchdarkly-node-server-sdk-dynamodb");

exports.handler = (event, context, callback) => {
  setTimeout(() => {
    const store = DynamoDBFeatureStore(process.env.DYNAMODB_TABLE, {
      cacheTTL: 30,
    });

    var ldConfig = {
      featureStore: store,
    };
    // initialize the LaunchDarkly client with the feature store
    var client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY, ldConfig);

    // the connected DynamoDB key store will automatically updated with flag values
    client.once("ready", () => {
      client.close();
      callback(null, "store updated");
    });
  }, 2000); // initialize after some delay to ensure that LD caches have been purged
};
