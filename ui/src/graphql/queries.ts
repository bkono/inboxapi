/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listNotifications = /* GraphQL */ `
  query ListNotifications($authId: String!, $since: AWSTimestamp) {
    listNotifications(authId: $authId, since: $since) {
      id
      authId
      submittedAt
      title
      body
      expiresAt
    }
  }
`;
