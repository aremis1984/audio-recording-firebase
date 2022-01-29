import {useContext, useState, useEffect} from "react";
import PropTypes from 'prop-types'
import Recording from '../Recording'
import { RecordingsContext } from '../../context/recordings-context'
import {getData, writeData, deleteData} from '../../api'
    
const RecordingsList = ({onSelectedId}) => {
    const {recordings, createList} = useContext(RecordingsContext);
    const [selectedItem, setSelectedItem] = useState(undefined)

    useEffect(() => {
        getData().then((data) => {
            createList(data)
        }).catch(err => {
            console.log(err)
        })
    })

    const editRecordingName = (id) => {
        let newRecordings = [...recordings]
        let targetItem = recordings.filter((item) => {
            if( item.id === id ) {
                return item
            }
            return false
        })
        let index = recordings.indexOf(targetItem[0])
        let newName = window.prompt('Enter a new name', targetItem[0].name) ?? targetItem[0].name // necessary because this returns null if the user doesn't enter anything
        targetItem[0].name = newName
        newRecordings.splice(index, 1, targetItem[0])
        writeData(targetItem).then(() => {
            console.log('Saved to the cloud!')
        }).catch(err => console.log(err))
        createList(newRecordings)
    }

    const deleteRecording = (id) => {
        let deleteRecording = window.confirm('Are you sure you want to delete this recording?')
        if (deleteRecording === true) {
            let newRecordings = recordings.filter((item) => {
                if (id !== item.id) {
                    return true
                }
                return false
            })
            document.getElementById(id).classList.add('vanish')
            setTimeout(() => {
                deleteData(id).then(() => {
                   console.log('Deleted from the cloud!')
                }).catch(err => console.log(err))
                createList(newRecordings)
            }, 900)
        }
    }

    const selectItem = (id) => {
        onSelectedId(id)
        setSelectedItem(id)
    }

    if (recordings.length === 0) {
       return (<h3 className='text-center'>No items stored.</h3>)
    }

    return (
        <>
            {recordings.length > 0 && recordings.map(recording => (
                <Recording
                    key={recording.id} 
                    name={recording.name} 
                    id={recording.id} 
                    onDeleteHandler={deleteRecording} 
                    onEditNameHandler={editRecordingName}
                    onSelectHandler={selectItem}
                    isSelected={selectedItem === recording.id}
                />
            ))}
        </>
    )


}

RecordingsList.propTypes = {
    recordings: PropTypes.array,
    setRecordings: PropTypes.func
};

export default RecordingsList
