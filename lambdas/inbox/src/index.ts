import * as aws from "aws-sdk";
import Table from "ddb-table";

interface NotificationSchema {
  pk: string;
  sk: string;
  id: string;
  authId: string;
  title: string;
  body: string;
  expiresAt: Number;
  submittedAt: Number;
}

interface Notification {
  id: string;
  authId: string;
  title: string;
  body: string;
  expiresAt: Number;
  submittedAt: Number;
}

type NotificationInput = {
  authId: string;
  title: string;
  body: string;
  expiresAt?: string;
};

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    authId: string;
    since: Number;
    notification: NotificationInput;
  };
};

exports.handler = async (
  event: AppSyncEvent
): Promise<Notification[] | Notification> => {
  const tableName = process.env.DDB_TABLE;
  const table = new Table<NotificationSchema, "pk", "sk">({
    tableName,
    primaryKey: "pk",
    sortKey: "sk",
  });

  switch (event.info.fieldName) {
    case "listNotifications":
      console.log("listNotifications");
      return await list(table, event.arguments.authId);
    case "addNotification":
      console.log("addNotification");
      return add(table, event.arguments.notification);
    default:
      return null;
  }

  return null;
};

async function add(
  table: Table<NotificationSchema, "pk", "sk">,
  input: NotificationInput
) {
  const now = Date.now();
  let expires: Number;
  if (input.expiresAt) {
    expires = Date.parse(input.expiresAt);
  } else {
    expires = now;
  }

  const item = {
    ...input,

    pk: "inbox#" + input.authId,
    sk: now.toString(),
    id: input.authId + now,
    submittedAt: now,
    expiresAt: expires,
  };

  const result = await table.put(item).return("ALL_OLD").exec();
  return (result.Attributes as Notification) || item;
}

async function list(
  table: Table<NotificationSchema, "pk", "sk">,
  authId: string,
  since?: Number
) {
  let q = table
    .query()
    .keyCondition((cond) => cond.eq("pk", "inbox#" + authId));
  if (since) {
    q.keyCondition((cond) => cond.gte("sk", since.toString()));
  }

  const results: Notification[] = [];
  for await (const e of q.entries()) {
    results.push(e as Notification);
  }

  return results;
}
