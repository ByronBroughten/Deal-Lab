// Sentry.init({
//   dsn: "https://17f616eaa65c438fa5a82b95836142d2@o529976.ingest.sentry.io/5648982",
//   integrations: [new Integrations.BrowserTracing()],

//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
// });

const init = () => {
  console.log("init placeholder");
};

function log(errorMessage: string) {
  console.log(errorMessage);
}
export const logS = {
  init,
  log,
};
