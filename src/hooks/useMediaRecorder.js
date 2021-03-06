import {useMemo, useState, useContext, useEffect} from "react";
import { RecordingsContext } from '../context/recordings-context'
import { writeData, writeBlobs } from "../api";

/**
 * This media recorder hook keeps all the logic needed to perform an audio recording decoupling it from any component
 * so it can be reused if needed.
 *
 * This way, when it comes to testing you only need to mock this `recorder` hook and its returned values.
 *
 * The hook in use would look like this:
 * const { recording, recordings, setRecordings, isRecording } = useMediaRecorded(stream);
 *
 * The `setRecordings` method is exposed so that we can perform modifications to the list of recordings from the component
 * avoiding to bloat the logic of this hook (tough it could also be a good idea to do so) but we kept it like this for simplicity
 *
 * @param {Object} stream
 * @returns {{
 * recorder: { start: Function, stop: Function },
 * isRecording: boolean,
 * recordings: any[],
 * setRecordings: Function
 * }}
 *
 */
export default function useMediaRecorder(stream) {
  const {recordings, createList} = useContext(RecordingsContext);
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState([]);

  const recorder = useMemo(() => new MediaRecorder(stream), [stream]);

  const handleStart = () => {
    setIsRecording(true);
  }

  const handleStop = () => {
    const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' })
    const audioURL = window.URL.createObjectURL(blob)
    const newItem = [{
      stream: audioURL,
      name: new Date().toISOString().split('.')[0].split('T').join(' '),
      id: `id${window.performance.now().toString()}`,
    }]
    
    writeBlobs(blob, newItem).then(() => {
      setChunks([])
    })

    // push the new recording to the recordings list
    writeData(newItem).then(() => console.log('Saved in the cloud!')
    ).catch(err => console.log(err))
    createList([...recordings, ...newItem])
    setIsRecording(false);
  }

  const handleDataAvailable = (e) => {
    setChunks(currentChunks => [...currentChunks, e.data]);
  }

  recorder.onstop = handleStop;
  recorder.onstart = handleStart;
  recorder.ondataavailable = handleDataAvailable;

  return {
    recorder,
    recordings,
    isRecording,
  }
}
