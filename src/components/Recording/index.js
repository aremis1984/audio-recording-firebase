import PropTypes from 'prop-types'
import { PlayFill, StopFill, PencilFill, TrashFill } from 'react-bootstrap-icons';
import './style.css'


const Recording = ({
    name,
    onDeleteHandler,
    onEditNameHandler,
    id,
    isSelected,
    onSelectHandler }) => {

    const deleteRecording = (e) => {
        onDeleteHandler(e)
    }

    const editName = (id) => {
        onEditNameHandler(id)
    }

    return (
        <article id={id} className={isSelected ? 'is-selected': ''}>
            <div className='displayed-items'>
                <div className='icon-box'>
                    {isSelected
                        ? <PlayFill />
                        : <StopFill />
                    }
                </div>
                <div className='item-name'>
                    <span className="name" role="presentation" onClick={() => onSelectHandler(id)}>{name}</span>
                </div>
                <div data-testid='edit' className='icon-box edit'>
                    <PencilFill onClick={() => editName(id)} />
                </div>
                <div data-testid='delete' className='icon-box delete'>
                    <TrashFill onClick={() => deleteRecording(id)} />
                </div>
            </div>
        </article>
    )
}

Recording.propTypes = {
    stream: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    onDeleteHandler: PropTypes.func,
    onEditNameHandler: PropTypes.func
}

export default Recording;