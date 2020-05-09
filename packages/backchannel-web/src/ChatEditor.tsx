import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import AppContext from "./Context";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { ActionType } from "./actions";

const ChatEditor = () => {
  const [draft, setDraft] = useState("");
  const { dispatch } = useContext(AppContext);
  const textChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: ActionType.SentChat, payload: draft });
    setDraft("");
  };
  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Input
          type="text"
          name="message"
          placeholder="say something"
          onChange={textChanged}
          value={draft}
        />
        <Button color="primary">Send</Button>
      </FormGroup>
    </Form>
  );
};

export default ChatEditor;
