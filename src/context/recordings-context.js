import React, { useState } from "react";
import {getBlobs} from '../api'

const RecordingsContext = React.createContext([{}, () => {}]);

const RecordingsProvider = ({ children}) => {
  const [recordings, setRecordings] = useState([]);

  const createList = (data = []) => {
    setRecordings(data)
  }

  return (
    <RecordingsContext.Provider value={{recordings, createList}}>
      {children}
    </RecordingsContext.Provider>
  );
};

export { RecordingsContext, RecordingsProvider };