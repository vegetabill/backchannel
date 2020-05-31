import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import AppContext from "../state/Context";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { ActionType } from "../model/Actions";

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
    <Form className="chatEditor" onSubmit={onSubmit}>
      <FormGroup>
        <Input
          type="text"
          name="message"
          autoComplete="off"
          placeholder="say something"
          onChange={textChanged}
          value={draft}
        />
        <Button className="chatEditor__button" color="primary">
          Send
        </Button>
      </FormGroup>
    </Form>
  );
};

export default ChatEditor;
