import React, {useState, useContext} from 'react';
import {fireEvent, render, screen} from '@testing-library/react'
import Recorder from './index'
import { RecordingsContext, RecordingsProvider } from '../../context/recordings-context'
import useMediaRecorder from "../../hooks/useMediaRecorder";
import { renderHook, act } from '@testing-library/react-hooks'

jest.mock('../../hooks/useMediaRecorder')

/**
 * Following the Object mother pattern we have this small fn that generates a valid object
 * that matches the structure of a recording
 *
 * @param {{ idNumber?: number, name?: string }} options
 * @returns {{ stream: string, name: string, id: string }}
 */
function createMockRecording({
  idNumber = Math.floor(Math.random() * 100),
  name = new Date().toISOString().split('.')[0].split('T').join(' ')
}) {
  return {
    stream: "audioUrl",
    name,
    id: `id${idNumber}`
  }
}

/**
 * Applying the same pattern above we wrap the previous recording generator
 * to create a random list of recordings
 *
 * @param {number} length
 * @returns {{ stream: string, name: string, id: string }[]}
 */
function createMockRecordingList(length = 10) {
  const emptyList = new Array(length).fill(null);
  return emptyList.map(() => createMockRecording({}))
}

/**
 * We create a mocked version of our hook that will interact with the component in the same exact way
 * and will expose the same API too.
 *
 * This mock is typically placed in the same directory of the original hook within a folder called `__mocks__`
 * keeping the same file name as the original and jest will override the hook functionality automatically.
 * But in this case we would loose the option to pass it a default list of recordings or would be more difficult to do so.
 *
 * @param {{ stream: string, name: string, id: string }[]} defaultRecordings
 * An optional list of default recordings to that we don't need to interact with the component to create a previous list of recordings
 * having also control over the data of each one to be able to assert on the list data.
 *
 * @returns {{
 *  recorder: { stop: Function, start: Function },
 *  isRecording: boolean,
 *  recordings: any[],
 *  setRecordings: Function
 * }}
 */
const mockUseMediaRecorder = (defaultRecordings = []) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isRecording, setIsRecording] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [recordings, setRecordings] = renderHook(() => useContext(RecordingsContext))

  const recorder = {
    start: () => setIsRecording(true),
    stop: () => {
      setRecordings(currentList => [...currentList, createMockRecording({ idNumber: currentList.length })])
      setIsRecording(false)
    },
  };

  return {recorder, recordings, setRecordings, isRecording}
};

describe('With an empty list of recordings', () => {
  let realUseContext;
  let useContextMock;
  beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn();
    useMediaRecorder.mockImplementation(() => mockUseMediaRecorder());
    useContextMock.mockReturnValue([]);
    render(<RecordingsProvider value={{recordings: [], createList: jest.fn()}}><Recorder stream={{}}/></RecordingsProvider>);
  });
  afterEach(() => {
    React.useContext = realUseContext;
  });

  it('renders without crashing', () => {
    const button = screen.getByTestId('record')
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('record-play')
  });

  it('user can start a recording pressing the button', () => {
    const button = screen.getByTestId('record')
    expect(button).toHaveClass('record-play')
    fireEvent.click(button)
    expect(button).not.toHaveClass('recording-audio');
  });

  it('record button turns red while recording', () => {
    const button =  screen.getByTestId('record')
    expect(button).toHaveClass('record-play')
    fireEvent.click(button)
    expect(button).toHaveClass('record-play', 'recording-audio')
  })

  it('adds a new recording to the list when the user clicks stop', () => {
    const button = screen.getByTestId('record')
    fireEvent.click(button)
    expect(button).toHaveClass('record-play', 'recording-audio')
    fireEvent.click(button)
    expect(button).toHaveClass('record-play')
    const recordings = screen.getAllByTestId('edit')
    expect(recordings).toHaveLength(1)
  })
})

describe('With a list of recordings', () => {
  const recordingsList = createMockRecordingList()

  const originalPrompt = global.prompt
  const originalConfirm = global.confirm
  const mockPrompt = jest.fn()
  const mockConfirm = jest.fn()
  let realUseContext;
  let useContextMock;
  beforeAll(() => {
    global.prompt = mockPrompt
    global.confirm = mockConfirm
  })

  beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn();
    useContextMock.mockReturnValue(RecordingsContext);
    useMediaRecorder.mockImplementation(() => mockUseMediaRecorder(recordingsList))
    mockPrompt.mockReturnValue("new recording name")
    mockConfirm.mockReturnValue(true)

    render(<RecordingsProvider value={{recordings: recordingsList, createList: jest.fn()}}><Recorder stream={{}}/></RecordingsProvider>););
  })

  afterEach(() => {
    React.useContext = realUseContext;
  });

  afterAll(() => {
    global.prompt = originalPrompt
    global.confirm = originalConfirm
  })

  it('renders all of the recordings on screen', () => {
    const recordings = screen.getbytes
    expect(recordings).toHaveLength(recordingsList.length)
  })

  it('a new recording can be created', () => {
    const recordings = screen.getByTestId('edit')
    expect(recordings).toHaveLength(recordingsList.length)

    const button = creen.getByTestId('record')
    fireEvent.click(button)
    expect(button).toHaveClass('recording-audio')
    fireEvent.click(button)
    expect(button).not.toHaveClass('recording-audio')

    const newRecordings = screen.getAllByTestId('edit')
    expect(newRecordings).toHaveLength(recordings.length + 1)
  })

  it('a recording can be renamed', async () => {
    const recordings = screen.getAllByTestId('edit')
    const firstEditButton = recordings[0];

    fireEvent.click(firstEditButton);
    expect(mockPrompt).toHaveBeenCalledTimes(1)

    const updatedRecording = await screen.findByText(/new recording name/i);
    expect(updatedRecording).toBeInTheDocument()
  })

  it('a recording can be deleted', () => {
    const recordings = screen.getAllByTestId('delete')
    expect(recordings).toHaveLength(recordingsList.length)
    fireEvent.click(recordings[0]);

    const updatedRecordingsWrapper = screen.queryAllByRole("article")
    expect(mockConfirm).toHaveBeenCalledTimes(1)
    expect(mockConfirm).toHaveBeenCalledWith("Are you sure you want to delete this recording?")
    expect(mockConfirm).toHaveReturned()
    expect(updatedRecordingsWrapper[0]).toHaveClass('vanish')
  })
})
