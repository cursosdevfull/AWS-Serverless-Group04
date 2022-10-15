export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/receiveHandler.handler",
  events: [
    {
      eventBridge: {
        eventBus: "EventBusCurso4",
        pattern: {
          source: ["appointment"],
          "detail-type": ["appointment.cancel"],
        },
      },
    },
  ],
};
