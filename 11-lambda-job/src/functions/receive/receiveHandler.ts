import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

const appointmentsList = [
  {
    appointmentId: 1,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: true,
  },
  {
    appointmentId: 2,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: true,
  },
  {
    appointmentId: 3,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: true,
  },
  {
    appointmentId: 4,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: false,
  },
  {
    appointmentId: 5,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: true,
  },
  {
    appointmentId: 6,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: false,
  },
  {
    appointmentId: 7,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: true,
  },
  {
    appointmentId: 8,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: true,
  },
  {
    appointmentId: 9,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: true,
  },
  {
    appointmentId: 10,
    appointmentDate: "2020-01-01",
    appointmentTime: "10:00",
    appointmentType: "Consultation",
    isPaid: false,
  },
];

const handler = async (): Promise<any> => {
  const appointments = appointmentsList.filter(
    (appointment) => !appointment.isPaid
  );

  console.log("appointments", appointments);

  return {
    statusCode: 200,
    body: "Appointments released",
  };
};

export { handler };
