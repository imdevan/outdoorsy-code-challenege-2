import {useReducer, useEffect, Dispatch} from 'react'

import logo from "./logo.svg";
import "./App.css";
import { Tracing } from "node:trace_events";
import styles from "./globalstyles.module.css";

let messages = {
  email: {
    required: "Email is required",
    invalid: "Email is not in the correct format",
  },
  phone: {
    required: "Phone is required",
    invalid: "Phone is invalid",
    //pattern: "Phone is international format",
  },
};

interface ErrorMessage {
  [required: string]: string;
  invalid: string;
}

interface AlbumType {
  albumId: number,
  id: number,
  thumbnailUrl: string,
  title: string,
  url: string
}

type Action = {
  type: string,
  payload: AlbumType[]
}

interface State {
  albums: AlbumType[],
}

const Card = ({album}: {album: AlbumType}) => {
  return (
    <div className={styles.card}>
      {/* card stuff goes here */}
      <img src={album.thumbnailUrl} />
    </div>
  )
}

const CardContainer = ({albums}: {albums: AlbumType[]}) => {
  return (
    <div className={styles.cardContainer}>
      {albums?.map(album => (
        <Card key={album.id} album={album} />
      ))}
    </div>
  )
}

const reducer = (state: State, action: Action): State => {
  switch(action.type){
    case 'setAlbums': 
      // return state obj with albums
      console.log('action', action);
      return {
        ...state,
        albums: action.payload
      }
    case 'filterAlbums':
      // filter albums here
      return {...state}
    default: 
      throw new Error('no action');
  }
}

function getErrorMessage(err: ErrorMessage, message: string) {
  return err[message];
}

const intitialState: State = {
  albums: []
};

function App(props: { errorType: string }) {
  const [state, dispatch] = useReducer(reducer, intitialState);
  const { errorType } = props;
  const errorMessage = getErrorMessage(messages.email, errorType); ;
  const {albums} = state;

  useEffect(() => {
    (async () => {
      // Load albums
      const response: any = await fetch('https://jsonplaceholder.typicode.com/photos');
      const data: any = await response.json();
      dispatch({
        type: 'setAlbums', 
        payload: data.splice(0,10)
      });
    })();
  }, []);

  return (
    <div className="App">
      errorType: {errorType}
      <br />
      {errorMessage}
      
      <CardContainer albums={albums} />
    </div>
  );
}

export default App;