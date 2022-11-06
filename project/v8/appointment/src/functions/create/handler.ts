import { AppointmentColombia, AppointmentMexico, AppointmentPeru, IAppointmentFactory } from './appointment-factory';

const create = async (event) => {
  const { name, date, countryISO } = JSON.parse(event.body);

  const factory: IAppointmentFactory =
    countryISO === "PE"
      ? new AppointmentPeru()
      : countryISO === "CO"
      ? new AppointmentColombia()
      : new AppointmentMexico();

  console.log("Data to send to SQS", { name, date, countryISO });

  await factory.execute({ name, date, countryISO });

  return {
    statusCode: 200,
    body: JSON.stringify({ name, date, countryISO }),
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
};

export const main = create;
