import axios, { AxiosError } from 'axios';
import * as dotenv from 'dotenv';
import togglAuthHeader from '../utils/togglAuthHeader';
dotenv.config();

const baseUrl = `https://api.track.toggl.com/api/v9/workspaces/${process.env.TOGGL_WORKSPACE_ID}`;

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
        Authorization: togglAuthHeader,
      },
    });

    return res;
  } catch (err) {
    const error = err as AxiosError<Error>;
    console.error('ERROR with toggl:', error.response?.data);
    return {
      error: error,
    };
  }
};
