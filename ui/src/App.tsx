import React, { useEffect, useState } from "react";
import tw from "twin.macro";

type Message = {
  title: string;
  body: string;
};

const Container = tw.div`container mx-auto w-full`;

const App = () => {
  const [authId, setAuthId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // subscribe for messages
  useEffect(() => {
    if (authId === "") {
      return;
    }

    console.log("subscribing to the inbox of: " + authId);
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
              <span>{m.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default App;

/*       <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */
