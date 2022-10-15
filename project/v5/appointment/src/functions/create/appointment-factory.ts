import * as AWS from 'aws-sdk';

interface SendMessageSNS {
  Message: string;
  TopicArn: string;
}

const sns = new AWS.SNS();

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

export class AppointmentPeru implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment) {
    const { name, date, countryISO } = appointment;
    const topicArn = process.env.TOPIC_ARN_PE;
    const message = {
      name,
      date,
      countryISO,
    };

    const params: SendMessageSNS = {
      Message: JSON.stringify(message),
      TopicArn: topicArn,
    };

    console.log("Parameters to send to SNS", params);

    try {
      console.log("Sending message to SNS");
      const result = await sns.publish(params).promise();
      console.log("Result", result);
      console.log("Message sent to SNS", params);
    } catch (error) {
      console.log("Error sending message to SNS");
      console.log(error);
    }
  }
}

export class AppointmentColombia implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment) {
    const { name, date, countryISO } = appointment;
    const topicArn = process.env.TOPIC_ARN_CO;
    const message = {
      name,
      date,
      countryISO,
    };

    const params: SendMessageSNS = {
      Message: JSON.stringify(message),
      TopicArn: topicArn,
    };

    console.log("Parameters to send to SNS", params);

    try {
      console.log("Sending message to SNS");
      const result = await sns.publish(params).promise();
      console.log("Result", result);
      console.log("Message sent to SNS", params);
    } catch (error) {
      console.log("Error sending message to SNS");
      console.log(error);
    }
  }
}

export class AppointmentMexico implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment) {
    const { name, date, countryISO } = appointment;
    const topicArn = process.env.TOPIC_ARN_MX;
    const message = {
      name,
      date,
      countryISO,
    };

    const params: SendMessageSNS = {
      Message: JSON.stringify(message),
      TopicArn: topicArn,
    };

    console.log("Parameters to send to SNS", params);

    try {
      console.log("Sending message to SNS");
      const result = await sns.publish(params).promise();
      console.log("Result", result);
      console.log("Message sent to SNS", params);
    } catch (error) {
      console.log("Error sending message to SNS");
      console.log(error);
    }
  }
}
