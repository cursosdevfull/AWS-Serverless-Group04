import { AppointmentColombia, AppointmentMexico, AppointmentPeru, IAppointmentFactory } from './appointment-factory';

const create = async (event) => {
  const { name, date, countryISO } = JSON.parse(event.body);

  const factory: IAppointmentFactory =
    countryISO === "PE"
      ? new AppointmentPeru()
      : countryISO === "CO"
      ? new AppointmentColombia()
      : new AppointmentMexico();

  const result = await factory.execute({ name, date, countryISO });

  return {
    statusCode: 200,
    body: JSON.stringify(JSON.parse(result.Payload).body),
  };
};

export const main = create;
