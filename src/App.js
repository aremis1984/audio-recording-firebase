import { useEffect, useState, useMemo, useContext } from 'react';
import Recorder from './components/Recorder'
import { RecordingsProvider, RecordingsContext } from './context/recordings-context'

import './App.css';

function App() {
  const constraints = useMemo(() => { return {audio: true} }, [])
  const [stream, setStream] = useState(null)
  const { recordings, createList } = useContext(RecordingsContext);
  const [error, setError] = useState(null)

  useEffect(() => {
    if ( stream ) {
      return
    }

    let didCancel = false

    const getUserMedia = async () => {
      try {
        const streamResp = await navigator.mediaDevices.getUserMedia(constraints);
        if (!didCancel) {
          setStream(streamResp);
        }
      } catch (err) {
        if (!didCancel) {
          setError(err);
        }
      }
    }
    
    const cancel = () => {
      didCancel = true;

      if (!stream) return;

      if ((stream).getAudioTracks) {
        (stream).getAudioTracks().map(track => track.stop());
      }

      if ((stream).stop) {
        (stream).stop();
      }
    }

    getUserMedia();

    return cancel;
  }, [constraints, stream, error, recordings])


  const recoderRenderer = () => {
    if( stream === null ) {
      return (<button className="record-play">Loading…</button>)
    }
    return (
      <RecordingsProvider value={{recordings, createList}}>
        <Recorder stream={stream} />
      </RecordingsProvider>
      
    )
  }
  return (
    <>
      <header>
        <h1 className='green-element'>Sound Recorder</h1>
      </header>
      <main>
        {recoderRenderer()}
      </main>
    </>
  );
}

export default App;
