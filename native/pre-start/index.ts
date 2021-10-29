/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */

if (!window.location) {
  // App is running in simulator
  //@ts-ignore
  window.navigator.userAgent = "ReactNative";
}
