console.log(process.cwd());
console.log(
  __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/sendHandler.handler"
);
