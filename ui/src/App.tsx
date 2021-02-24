import React, { useEffect, useState } from "react";
import "tailwindcss/dist/base.min.css";
import tw from "twin.macro";
import {
  Notification,
  ListNotificationsQuery,
  onNotification,
} from "./graphql";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

interface MessageAlertProps {
  msg: Notification;
}

const Container = tw.div`container mx-auto w-full`;
const MessageAlert: React.FC<MessageAlertProps> = ({ msg }) => {
  return (
    <div role="alert">
      <div tw="bg-blue-500 text-white font-bold rounded-t px-4 py-2">
        {msg.title}
      </div>
      <div tw="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
        <p>{msg.body}</p>
      </div>
    </div>
  );
};
/*
    <div tw="max-w-lg w-full rounded overflow-hidden shadow-lg">
      <div tw="px-6 py-4 mb-4">
        <p tw="font-semibold text-lg text-blue-600 mb-2">{msg.title}</p>
        <p tw="text-gray-600 font-light text-base">{msg.body}</p>
      </div>
    </div>
    */

const App = () => {
  const [authId, setAuthId] = useState("");
  const [messages, setMessages] = useState<Notification[]>([]);

  const listQuery = async (id: string) => {
    console.log("querying with id: " + id);
    const rsp = (await API.graphql(
      graphqlOperation(listQL, { id: id })
    )) as GraphQLResult<ListNotificationsQuery>;
    console.log(rsp);
    const msgs = rsp.data?.listNotifications?.map((msg) => {
      return msg as Notification;
    });

    setMessages(msgs || []);
  };

  // subscribe for messages
  useEffect(() => {
    if (authId === "") {
      return;
    }
    listQuery(authId).catch((reason) => console.log(reason));

    const sub = API.graphql(graphqlOperation(onNotification, { authId }))
      // @ts-ignore
      .subscribe({
        next: (data: any) => {
          console.log("received something on the subscription");
          console.log(data);
          const msg = data.value?.data?.onNotification;
          console.log("msg");
          console.log(msg);
          if (msg) {
            setMessages((msgs) => {
              return msgs.concat(msg as Notification);
            });
          }
        },
      });

    console.log("subscribing to the inbox of: " + authId);

    return () => {
      if (sub?.unsubscribe) {
        console.log("calling unsub");
        sub.unsubscribe();
      }
    };
  }, [authId]);

  const events = {
    onKeyPress: (event: any) => {
      if (event.key === "Enter") {
        setAuthId(event.target.value.trim());
        event.target.value = "";
      }
    },
    onBlur: (event: any) => {
      if (event.target.value === "") {
        return;
      }
      setAuthId(event.target.value.trim());
      event.target.value = "";
    },
  };

  return (
    <Container>
      <div>
        <p>
          Current authID: <span>{authId}</span>
        </p>
        <label>
          Change:{" "}
          <input
            tw="ml-2 px-2"
            name={"authId"}
            type="text"
            placeholder="Enter an authId"
            {...events}
          />
        </label>
      </div>
      <div tw="container flex flex-col overflow-y-auto mb-12">
        <span>Inbox:</span>
        <ul>
          {messages.map((m, i) => (
            <li key={i} tw="mb-2">
              <MessageAlert msg={m} />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default App;

const listQL = `
query ListQuery($id: String!) {
  listNotifications(authId: $id) {
    body
    id
    title
  }
}
`;
