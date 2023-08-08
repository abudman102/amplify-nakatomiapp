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

import { API, Amplify, graphqlOperation, Storage } from 'aws-amplify';
import { createTodo, updateTodo, deleteTodo } from './graphql/mutations';

import { listTodos } from './graphql/queries';

import awsExports from "./aws-exports";
import { useEffect, useState} from "react";
Amplify.configure(awsExports);

function App({ signOut, user }) {
  const [items, setItems] = useState([]);
  const [fileData, setFileData] = useState();
  const [fileStatus, setFileStatus ] = useState(false);

  const uploadFile = async () => {
    const file = fileData;

    if (!file) {
      alert('Please select a file before uploading');
      return;
    }

    if(file.type !== 'text/csv') {
      alert('Only CSV files are allowed');
      return;
    }

    try {
      const result = await Storage.put(file.name, file, {contentType: file.type});
      setFileStatus(true);
      console.log(21, result);
    
    } catch (error) {
      console.error('File upload error',error);
    }
  
  };


   // const result = await Storage.put(fileData.name, fileData, {
   //   contentType: fileData.type,
   // });
   // setFileStatus(true);
   // console.log(21, result);
  //};

  useEffect(() => {
    async function createTodoItem() {
      const todo = { name: "My third todo", description: "test!" };

      /* create a todo */
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    }

    async function listTodoItems() {
      const todos = await API.graphql(graphqlOperation(listTodos));
      console.log(30, todos.data.listTodos.items);
      setItems(todos.data.listTodos.items);
    
    }
    listTodoItems();
    //createTodoItem();

  }, []);

  return (
    <div className="App">
      <h1>Hello {user.username} </h1>
      <Button onClick={signOut}>Sign Out</Button>

      {/*items.map((item, index) => (
        <div key ={index}>
          {item.name} - {item.description}
        </div>
      ))*/}
      <div>
        <input type="file" onChange={(e) => setFileData(e.target.files[0])} />
      </div>
      <div>
        <button onClick={uploadFile}>Upload file</button>
      </div>
      {fileStatus ? 'File uploaded successfully' : '' }
    </div>
  );
}

export default withAuthenticator(App);