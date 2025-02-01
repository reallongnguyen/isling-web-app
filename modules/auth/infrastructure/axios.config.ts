/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosInstance } from 'axios';
import { capitalize } from 'lodash';

import { AuthToken } from '../models/auth-token.model';
import {
  deleteAuthToken,
  findAuthToken,
  insertAuthToken,
} from './repository/authToken.repo';
import { logout, refreshAuthToken } from './api/auth.api';

let renewAccessToken: Promise<any> | undefined;

function getAuthorizationString(token: AuthToken) {
  const tokenType = capitalize(token.tokenType);

  return `${tokenType} ${token.accessToken}`;
}

function simpleSignout() {
  deleteAuthToken();
  logout()
    .catch(console.error)
    .finally(() => {
      // reset all store
      window.location.reload();
    });
}

export function configAxiosInterceptor(
  axios: AxiosInstance,
  forceSignout = simpleSignout
): void {
  axios.interceptors.request.use((config) => {
    const token = findAuthToken();

    if (token) {
      config.headers.Authorization = getAuthorizationString(token);
    }

    if (!token && config.headers.Authorization) {
      config.headers.Authorization = null;
    }

    return config;
  });

  axios.interceptors.response.use(undefined, async (error: AxiosError) => {
    if (!(error.config && error.response && error.response.status === 401)) {
      return Promise.reject(error);
    }

    // trying renew access token by fresh token
    const token = findAuthToken();

    if (!token) {
      return Promise.reject(error);
    }

    renewAccessToken = renewAccessToken || refreshAuthToken(token);

    try {
      const newAuthToken = await renewAccessToken;
      insertAuthToken(newAuthToken);
      error.config.headers.Authorization = getAuthorizationString(newAuthToken);

      // again request with the new access token
      return axios.request(error.config);
    } catch (err: any) {
      if (err.status >= 400 && err.status < 500) {
        console.info(
          'axiosConfig: renew access token -> refresh token failed -> force signout'
        );

        forceSignout();
      }

      return Promise.reject(error);
    } finally {
      renewAccessToken = undefined;
    }
  });
}
