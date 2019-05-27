

import request = require('request-promise');
import constants = require('./constants');
import { AuthenticationResponse } from './domain/responses/authenticationResponse';
import { Activity } from 'chatdown-domain';
import { EventActivityRequest } from './domain/requests/eventActivityRequest';
import log = require('npmlog');

/** Handles http requests */
export class RequestHandler {
  _directlineSecret: string;
  _tokenEndpoint: string;

  /**
   * @param {string} directlineSecret - The Directline secret that is linked to your Azure bot service directline channel. Used to authenticate with the Directline API.
   * @param {string} tokenEndpoint - An endpoint that uses the directlineSecret to generate a token to communicate with the Directline API.
   */
  constructor(directlineSecret: string, tokenEndpoint: string) {
    this._directlineSecret = directlineSecret;
    this._tokenEndpoint = tokenEndpoint;
  }

  async getActivityResponse(authResponse: AuthenticationResponse, watermark?: number): Promise<Activity[]> {
    var conversationActivityEndpoint = `${constants.Directline.conversation_endpoint}/${authResponse.conversationId}/activities`;

    // watermark indicates the most recent message seen by the client
    if (watermark) {
      conversationActivityEndpoint += `?watermark=${watermark}`;
    }

    const authOptions = {
      url: conversationActivityEndpoint,
      headers: {
        'Authorization': `Bearer ${authResponse.token}`,
        'Content-Type': 'application/json'
      }
    };

    var response: Activity[];
    function eventRequestCallback(body: any): void {
      // activities are returned in order.
      var info: Activity[] = JSON.parse(body).activities;
      response = info;
      // mapResponse(body);
      log.verbose("get activity response", body);
    }

    await request.get(authOptions)
      .then(eventRequestCallback, (error: any) => {
        throw new Error(error);
      });

    return response;
  }

  /**
  * Sends an activity to the directline channel
  * @returns {Promise<AuthenticationResponse>}
  */
  async sendEventActivity(authResponse: AuthenticationResponse, event: EventActivityRequest): Promise<void> {
    var conversationActivityEndpoint = `${constants.Directline.conversation_endpoint}/${authResponse.conversationId}/activities`;

    const authOptions = {
      url: conversationActivityEndpoint,
      headers: {
        'Authorization': `Bearer ${authResponse.token}`,
        'Content-Type': 'application/json'
      },
      json: event
    };

    function eventRequestCallback(body: any): void {
      log.verbose("send event response", body);
    }

    await request.post(authOptions)
      .then(eventRequestCallback, (error: any) => {
        throw new Error(error);
      })
  }

  /**
  * Sends an activity to the directline channel
  * @returns {Promise<AuthenticationResponse>}
  */
  async sendActivity(authResponse: AuthenticationResponse, activity: Activity): Promise<void> {
    var conversationActivityEndpoint = `${constants.Directline.conversation_endpoint}/${authResponse.conversationId}/activities`;

    const authOptions = {
      url: conversationActivityEndpoint,
      headers: {
        'Authorization': `Bearer ${authResponse.token}`,
        'Content-Type': 'application/json'
      },
      json: activity
    };

    function eventRequestCallback(body: any): void {
      log.verbose("send activity response", body);
    }

    await request.post(authOptions)
      .then(eventRequestCallback, (error: any) => {
        throw new Error(error);
      })
  }

  /**
  * Authenticates with directline and creates a conversation with a token that we can use to communicate
  * @returns {Promise<AuthenticationResponse>}
  */
  async authenticate(): Promise<AuthenticationResponse> {
    var authResponse: AuthenticationResponse;

    if (this._directlineSecret) {
      authResponse = await this.authenticateUsingSecret();
    }
    else {
      authResponse = await this.authenticateUsingTokenEndpoint();
    }

    var that = this;
    function conversationAuthRequestCallback(body: any): void {
      authResponse = that.mapAuthResponse(body);
      log.verbose("conversation auth response", body);
    }

    const conversationAuthOptions = {
      url: constants.Directline.conversation_endpoint,
      headers: {
        'Authorization': `Bearer ${authResponse.token}`
      }
    };

    await request.post(conversationAuthOptions)
      .then(conversationAuthRequestCallback, (error: any) => { throw new Error(error); })

    return authResponse;
  }

  private async authenticateUsingSecret() {
    let authResponse: AuthenticationResponse = new AuthenticationResponse();

    const authOptions = {
      url: constants.Directline.token_endpoint,
      headers: {
        'Authorization': `Bearer ${this._directlineSecret}`
      }
    };

    authResponse = new AuthenticationResponse();

    var that = this;
    function authRequestCallback(body: any): void {
      authResponse = that.mapAuthResponse(body);
      log.verbose("auth response", body);
    }

    await request.post(authOptions)
      .then(authRequestCallback, (error: any) => { throw new Error(error); })

    return authResponse;
  }

  private mapAuthResponse(body: any): AuthenticationResponse {
    const info = JSON.parse(body);
    var authResponse = new AuthenticationResponse();
    authResponse.conversationId = info.conversationId;
    authResponse.expires_in = info.expires_in;
    authResponse.token = info.token;
    return authResponse;
  }

  private async authenticateUsingTokenEndpoint() {
    let authResponse: AuthenticationResponse = new AuthenticationResponse();

    const authOptions = {
      url: this._tokenEndpoint,
    };

    function authRequestCallback(body: any): void {
      if (!body) {
        throw new Error('invalid token response');
      }

      var token;
      var response;

      try {
        response = JSON.parse(body);

        if (response.token) {
          token = response.token;
        }
        else {
          token = response;
        }
      }
      catch (e) {
        // recover using string value
        token = body;
      }

      authResponse.token = token;
      log.verbose("token endpoint token response", token);
    }

    await request.get(authOptions)
      .then(authRequestCallback, (error: any) => { throw new Error(error); })

    return authResponse;
  }
}

module.exports = { RequestHandler: RequestHandler };