import AWS from "aws-sdk";

const ses = new AWS.SES({ region: "us-east-2" });

// This lamda function recieves message from SQS and
// send message as email to the recipient using SES.
const recieveAndSendMailIAM = async (event, context) => {
  const record = event.Records[0];
  console.log("Email Record from SQS", record);
  const email = JSON.parse(record.body);
  const { subject, body, recipient } = email;
  // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "redrobin3636@gmail.com",
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.log("An Error occurred while sending email", error.message);
  }
};

export const handler = recieveAndSendMailIAM;
