import * as Rollbar from "rollbar";
import { NODE_ENV, ROLLBAR_TOKEN } from "./env";

export default ROLLBAR_TOKEN ? new Rollbar({
  accessToken: ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: NODE_ENV,
}) : null;
