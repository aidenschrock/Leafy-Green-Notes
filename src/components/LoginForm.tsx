import { useState } from "react";
import Modal from "@leafygreen-ui/modal";
import TextInput from "@leafygreen-ui/text-input";
import Button from "@leafygreen-ui/button";

interface FuncProps {
  handleSubmit(email, password): void;
  open: boolean;
  setOpen: any;
}

const LoginForm: React.FC<FuncProps> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Modal data-testid="login-form" open={props.open} setOpen={props.setOpen}>
      <TextInput
        data-testid="email-input"
        className="input"
        type="email"
        label="Email"
        errorMessage="Email address invalid."
        description="Enter your email below"
        placeholder="your.email@example.com"
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <TextInput
        data-testid="password-input"
        className="input"
        type="password"
        label="Password"
        errorMessage="Incorrect password."
        description="Enter your password below"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <Button
        id="submit-button"
        type="submit"
        variant={"primary"}
        onClick={() => props.handleSubmit(email, password)}
      >
        Submit
      </Button>
    </Modal>
  );
};

export default LoginForm;
