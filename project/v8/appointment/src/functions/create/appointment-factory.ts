import * as AWS from 'aws-sdk';

interface SendMessageEventBridge {
  Entries: [
    {
      Source: string;
      Detail: string;
      DetailType: string;
      EventBusName: string;
    }
  ];
}

const eventBridge = new AWS.EventBridge();

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
    const eventBusName = process.env.EVENT_BUS_NAME;
    const message = {
      name,
      date,
      countryISO,
    };

    const params: SendMessageEventBridge = {
      Entries: [
        {
          Source: "appointment",
          Detail: JSON.stringify(message),
          DetailType: "appointment.cancel.pe",
          EventBusName: eventBusName,
        },
      ],
    };

    console.log("Parameters to send to EventBridge", params);

    try {
      console.log("Sending message to EventBridge");
      const result = await eventBridge.putEvents(params).promise();
      console.log("Result", result);
      console.log("Message sent to EventBridge", params);
    } catch (error) {
      console.log("Error sending message to SNS");
      console.log(error);
    }
  }
}

export class AppointmentColombia implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment) {
    const { name, date, countryISO } = appointment;
    const eventBusName = process.env.EVENT_BUS_NAME;
    const message = {
      name,
      date,
      countryISO,
    };

    const params: SendMessageEventBridge = {
      Entries: [
        {
          Source: "appointment",
          Detail: JSON.stringify(message),
          DetailType: "appointment.cancel.co",
          EventBusName: eventBusName,
        },
      ],
    };

    console.log("Parameters to send to EventBridge", params);

    try {
      console.log("Sending message to EventBridge");
      const result = await eventBridge.putEvents(params).promise();
      console.log("Result", result);
      console.log("Message sent to EventBridge", params);
    } catch (error) {
      console.log("Error sending message to SNS");
      console.log(error);
    }
  }
}

export class AppointmentMexico implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment) {
    const { name, date, countryISO } = appointment;
    const eventBusName = process.env.EVENT_BUS_NAME;
    const message = {
      name,
      date,
      countryISO,
    };

    const params: SendMessageEventBridge = {
      Entries: [
        {
          Source: "appointment",
          Detail: JSON.stringify(message),
          DetailType: "appointment.cancel.mx",
          EventBusName: eventBusName,
        },
      ],
    };

    console.log("Parameters to send to EventBridge", params);

    try {
      console.log("Sending message to EventBridge");
      const result = await eventBridge.putEvents(params).promise();
      console.log("Result", result);
      console.log("Message sent to EventBridge", params);
    } catch (error) {
      console.log("Error sending message to SNS");
      console.log(error);
    }
  }
}
