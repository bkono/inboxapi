/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addNotification = /* GraphQL */ `
  mutation AddNotification($notification: NotificationInput!) {
    addNotification(notification: $notification) {
      id
      authId
      submittedAt
      title
      body
      expiresAt
    }
  }
`;
