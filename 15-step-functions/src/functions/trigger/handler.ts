import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const sft = new AWS.StepFunctions();

const executeStepFunction = (number) => {
  const stateMachineName = "initialStateMachine";

  return sft
    .listStateMachines({})
    .promise()
    .then((list) => {
      const length = list.stateMachines.length;

      for (let i = 0; i < length; i++) {
        const stateMachine = list.stateMachines[i];
        if (stateMachine.name === stateMachineName) {
          const params = {
            stateMachineArn: stateMachine.stateMachineArn,
            input: JSON.stringify({ number: +number }),
            name: uuidv4(),
          };

          return sft
            .startExecution(params)
            .promise()
            .then(() => true);
        }
      }
    });
};

const trigger = async (event) => {
  const number = event.queryStringParameters.number;
  console.log(`Number received: ${number}`);

  try {
    const result = await executeStepFunction(number);
    return { body: JSON.stringify({ message: "Trigger was called" }) };
  } catch (error) {
    console.log(error);
    return `Error: ${error.message}`;
  }
};

export const main = trigger;
