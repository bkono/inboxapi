/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onNotification = /* GraphQL */ `
  subscription OnNotification($authId: String!) {
    onNotification(authId: $authId) {
      id
      authId
      submittedAt
      title
      body
      expiresAt
    }
  }
`;
