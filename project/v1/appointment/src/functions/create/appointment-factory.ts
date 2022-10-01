import * as AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

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
  execute(appointment: ICreateAppointment): Promise<any>;
}

export class AppointmentPeru implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment): Promise<any> {
    const { name, date, countryISO } = appointment;
    return lambda
      .invoke({
        FunctionName: "appointment-pe-dev-create",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ name, date, countryISO }),
      })
      .promise();
  }
}

export class AppointmentColombia implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment): Promise<any> {
    const { name, date, countryISO } = appointment;
    return lambda
      .invoke({
        FunctionName: "appointment-co-dev-create",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ name, date, countryISO }),
      })
      .promise();
  }
}

export class AppointmentMexico implements IAppointmentFactory {
  async execute(appointment: ICreateAppointment): Promise<any> {
    const { name, date, countryISO } = appointment;
    return lambda
      .invoke({
        FunctionName: "appointment-mx-dev-create",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ name, date, countryISO }),
      })
      .promise();
  }
}
