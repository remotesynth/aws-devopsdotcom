// The LaunchDarkly Node Server SDK
const LaunchDarkly = require("launchdarkly-node-server-sdk");
exports.handler = async (event) => {
  // initialize the SDK client with the SDK Key
  const client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY);
  await client.waitForInitialization();

  // we're passing in a generic user key
  const context = {
    kind: "user",
    key: "anonymous",
  };

  // if the flag is on for this environment, this
  // will be true, if it's off, it will be false
  const exampleLDCall = await client.variation("example-flag", context, false);

  // this is not necessary here but it ensures that all
  // analytics events are immediate sent to LaunchDarkly
  // which is helpful for debugging
  client.flush();

  // format the response. All we're passing back, is the value of the flag
  const response = {
    statusCode: 200,
    body: JSON.stringify(exampleLDCall),
  };
  return response;
};
