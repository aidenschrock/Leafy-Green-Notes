import { useEffect, useState } from 'react';
import Modal from '@leafygreen-ui/modal';
import TextInput from '@leafygreen-ui/text-input';
import TextArea from '@leafygreen-ui/text-area';
import Button from '@leafygreen-ui/button';

interface FuncProps {
    handleNoteSave({ title, content }): void;
    handleNoteDelete(): void;
    open: boolean;
    setOpen: any;
    data: any;
}

const Form: React.FC<FuncProps> = (props) => {
    const [title, setTitle] = useState(props.data?.title ?? '');
    const [content, setContent] = useState(props.data?.content ?? '');

    useEffect(() => {
        setTitle(props.data?.title)
        setContent(props.data?.content)
    }, [props.data?.title, props.data?.content])

    return (
        <Modal className="edit-note" open={props.open} setOpen={props.setOpen}>
            <TextInput
                name="note-title"
                className="input"
                label="Note Title"
                placeholder="My Note"
                value={title}
                onChange={event => {
                    setTitle(event.target.value)
                }}
            />
            <TextArea
                name="note-content"
                className="input"
                label="Note Content"
                placeholder="Reminder: Eat more vegetables!"
                value={content}
                onChange={event => {
                    setContent(event.target.value)
                }}
            />
            <Button onClick={() => props.handleNoteDelete()} className="delete-button" variant={'danger'}>Delete</Button>
            <Button onClick={() => props.handleNoteSave({
                title: title,
                content: content
            })} variant={'primary'} className="save-button"> Save </Button>
        </Modal>
    )
}



export default Form;