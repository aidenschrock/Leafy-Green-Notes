import { useEffect, useState } from 'react';
import Modal from '@leafygreen-ui/modal';
import TextInput from '@leafygreen-ui/text-input';
import TextArea from '@leafygreen-ui/text-area';
import Button from '@leafygreen-ui/button';

interface FuncProps {
    handleNoteSave({ title, content }): void;
    handleCancel(): void;
    open: boolean;
    setOpen: any;
}

const AddNoteForm: React.FC<FuncProps> = (props) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <Modal className="edit-note" open={props.open} setOpen={props.setOpen}>
            <TextInput
                name="note-title"
                className="input"
                label="Note Title"
                placeholder="My Note"
                // value={title}
                onChange={event => {
                    setTitle(event.target.value)
                }}
            />
            <TextArea
                name="note-content"
                className="input"
                label="Note Content"
                placeholder="Reminder: Eat more vegetables!"
                // value={content}
                onChange={event => {
                    setContent(event.target.value)
                }}
            />
            <Button onClick={() => props.handleCancel()} className="delete-button">Cancel</Button>
            <Button onClick={() => props.handleNoteSave({
                title: title,
                content: content
            })} variant={'primary'} className="save-button"> Save </Button>
        </Modal>
    )
}



export default AddNoteForm;