import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import { API, Amplify, graphqlOperation } from 'aws-amplify';
import { createTodo, updateTodo, deleteTodo } from './graphql/mutations';

import awsExports from "./aws-exports";
import { useEffect } from "react";
Amplify.configure(awsExports);

function App({ signOut, user }) {
  useEffect(() => {
    async function createTodoItem() {
      const todo = { name: "My third todo", description: "test!" };

      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    }

    createTodoItem();
  }, []);

  return (
    <View className="App">
      <Card>
        <Image src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);