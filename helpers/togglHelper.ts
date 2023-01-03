import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const baseUrl = `https://api.track.toggl.com/api/v9/workspaces/${process.env.TOGGL_WORKSPACE_ID}`;

const authBase64 = Buffer.from(
  `${process.env.TOGGL_API_KEY}:api_token`,
).toString('base64');
const authHeader = `Basic ${authBase64}`;

type ITogglHelper = {
  method: 'POST' | 'GET';
  endpoint: string;
  data?: Object;
};

export const togglHelper = async ({ method, endpoint, data }: ITogglHelper) => {
  try {
    const res = await axios(`${baseUrl}/${endpoint}`, {
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });

    return res;
  } catch (error) {
    return {
      error: error,
    };
  }
};
