// The LaunchDarkly Node Server SDK
const LaunchDarkly = require("launchdarkly-node-server-sdk");
// for decrypting JWT tokens
const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  const client = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY);
  await client.waitForInitialization();

  // decrypting the JWT token
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
