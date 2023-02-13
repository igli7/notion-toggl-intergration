import * as dotenv from 'dotenv';
dotenv.config();

const togglAuthHeader = () => {
  const authBase64 = Buffer.from(
    `${process.env.TOGGL_API_KEY}:api_token`,
  ).toString('base64');
  const authHeader = `Basic ${authBase64}`;

  return authHeader;
};

export default togglAuthHeader();
