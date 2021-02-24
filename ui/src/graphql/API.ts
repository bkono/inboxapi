/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type NotificationInput = {
  authId: string,
  title: string,
  body: string,
  expiresAt?: number | null,
};

export type Notification = {
  __typename: "Notification",
  id?: string,
  authId?: string,
  submittedAt?: number | null,
  title?: string,
  body?: string,
  expiresAt?: number,
};

export type AddNotificationMutationVariables = {
  notification?: NotificationInput,
};

export type AddNotificationMutation = {
  addNotification?:  {
    __typename: "Notification",
    id: string,
    authId: string,
    submittedAt?: number | null,
    title: string,
    body: string,
    expiresAt: number,
  } | null,
};

export type ListNotificationsQueryVariables = {
  authId?: string,
  since?: number | null,
};

export type ListNotificationsQuery = {
  listNotifications?:  Array< {
    __typename: "Notification",
    id: string,
    authId: string,
    submittedAt?: number | null,
    title: string,
    body: string,
    expiresAt: number,
  } | null > | null,
};

export type OnNotificationSubscriptionVariables = {
  authId?: string,
};

export type OnNotificationSubscription = {
  onNotification?:  {
    __typename: "Notification",
    id: string,
    authId: string,
    submittedAt?: number | null,
    title: string,
    body: string,
    expiresAt: number,
  } | null,
};
