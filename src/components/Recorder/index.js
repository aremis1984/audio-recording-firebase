import { useMemo, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import RecordingList from '../RecordingsList'
import Visualizer from '../Visualizer'
import {RecordCircleFill, StopCircleFill, PlayCircleFill, PauseCircleFill } from 'react-bootstrap-icons';
import useMediaRecorder from "../../hooks/useMediaRecorder";
import { RecordingsContext } from '../../context/recordings-context'
import {getBlobs} from '../../api'

import './style.css'

const Recorder = ({stream}) => {
    const { recorder, isRecording } = useMediaRecorder(stream);
    const {recordings} = useContext(RecordingsContext);
    const [dataPath, setDataPath] = useState('');

    const defaultRecordClass = 'record-play'
    const recordButtonClassesText = useMemo(() => isRecording ? `${defaultRecordClass} recording-audio` : defaultRecordClass, [isRecording])
    const recordingStateIcon = useMemo(() => isRecording ? <StopCircleFill /> : <RecordCircleFill />, [isRecording])
    
    const toggleRecording = () => {
        if (!isRecording) {
            recorder.start(1000)
        } else {
            recorder.stop();
            setDataPath('')
        }
    }

    const onPlay = () => {
        let player = document.getElementById('audio-tracker');
        player.play();
    }

    const onPause = () => {
        let player = document.getElementById('audio-tracker');
        player.pause();
    }

    const selectedId = (id) => {
        const item = recordings.find(r => r.id === id)
        getBlobs(item.id).then(url => {
            setDataPath(url);
        }).catch(err => {
            console.log(`File ${item.id} not found! ${err}`)
            setDataPath(item.stream);
        })   
    }

    return (
        <div className='main-app'>
            <div className='screen'>
                {isRecording
                    ? <Visualizer stream={stream} isRecording={isRecording} barColor={[18,124,85]} />
                    : <RecordingList onSelectedId={selectedId} />
                }
            </div>
            <div className='centered-items'>
                <audio id='audio-tracker' autoPlay="autoplay" src={dataPath}>Sorry, your browser doesn't support recording audio.</audio>
                <div className='controls'>
                    <button onClick={toggleRecording} data-testid='record' className={recordButtonClassesText}>{recordingStateIcon}</button>
                    <button onClick={onPlay} data-testid='play' disabled={dataPath===''} className='play-pause'><PlayCircleFill /></button>
                    <button onClick={onPause} data-testid='pause' disabled={dataPath===''} className='play-pause'><PauseCircleFill /></button>
                </div>
            </div>
        </div>
    )
}

Recorder.propTypes = {
    stream: PropTypes.object
};

export default Recorder
