import * as AWS from 'aws-sdk';

const sqs = new AWS.SQS();

export interface ICreateAppointment {
  name: string;
  date: string;
  countryISO: string;
}

export interface IResponseCreateAppointment {
  Payload: {
    name: string;
    date: string;
    countryISO: string;
  };
}

export interface IAppointmentFactory {
  execute(appointment: ICreateAppointment): void;
}

interface SendMessageSQS {
  MessageBody: string;
  QueueUrl: string;
}

export class AppointmentPeru implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment) {
    const { name, date, countryISO } = appointment;
    const queueUrl = process.env.SQSPE_QUEUE_URL;
    const message = {
      name,
      date,
      countryISO,
    };

    const params: SendMessageSQS = {
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    };

    console.log("Parameters to send to SQS", params);

    try {
      console.log("Sending message to SQS");
      const result = await sqs.sendMessage(params).promise();
      console.log("Result", result);
      console.log("Message sent to SQS", params);
    } catch (error) {
      console.log("Error sending message to SQS");
      console.log(error);
    }
  }
}

export class AppointmentColombia implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment): Promise<any> {
    const { name, date, countryISO } = appointment;
    const queueUrl = process.env.SQSCO_QUEUE_URL;
    const message = {
      name,
      date,
      countryISO,
    };

    const params: SendMessageSQS = {
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    };

    console.log("Parameters to send to SQS", params);

    try {
      await sqs.sendMessage(params).promise();
      console.log("Message sent to SQS", params);
    } catch (error) {
      console.log(error);
    }
  }
}

export class AppointmentMexico implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment): Promise<any> {
    const { name, date, countryISO } = appointment;
    const queueUrl = process.env.SQSMX_QUEUE_URL;
    const message = {
      name,
      date,
      countryISO,
    };

    const params: SendMessageSQS = {
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    };

    console.log("Parameters to send to SQS", params);

    try {
      await sqs.sendMessage(params).promise();
      console.log("Message sent to SQS", params);
    } catch (error) {
      console.log(error);
    }
  }
}
