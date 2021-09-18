import { useState } from 'react';
import './App.css';
import { uiColors } from '@leafygreen-ui/palette';
import { H1, H3, Body } from '@leafygreen-ui/typography';
import Card from '@leafygreen-ui/card';
import { ReactComponent as Logo } from './MongoDB_Logo_Leaf.svg'
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import Modal from '@leafygreen-ui/modal';
import TextInput from '@leafygreen-ui/text-input';
import TextArea from '@leafygreen-ui/text-area';
import Button from '@leafygreen-ui/button';




// Load
let myNotes
if (!localStorage.getItem('myNotes')) {
  localStorage.setItem('myNotes', JSON.stringify([]))
} else {
  myNotes = JSON.parse(localStorage.getItem('myNotes'))
}


function saveNotesChanges() {
  localStorage.setItem('myNotes', JSON.stringify(myNotes))
}


function App() {

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [selectedNote, setSelectedNote] = useState(-1)

  function createNote() {
    myNotes.push({
      title: title,
      content: content
    })
    setOpen(curr => !curr)
    saveNotesChanges()
  }

  function editNote(selectedNoteIndex) {
    const note = myNotes[selectedNoteIndex]
    console.log(note)
    setTitle(note.title)
    setContent(note.content)
    myNotes[selectedNoteIndex] = {
      title: title,
      content: content
    }
    setOpen(curr => !curr)
    saveNotesChanges()
  }

  function deleteNote(selectedNoteIndex) {
    if (selectedNoteIndex > -1 && selectedNoteIndex !== null) {
      myNotes.splice(selectedNoteIndex, 1);
    }
    setOpen(curr => !curr)
    saveNotesChanges()
  }

  return (
    <div style={{ backgroundColor: uiColors.white }} className="App">
      <H1 className="header" style={{ color: uiColors.green.base }}>Leafy Green Notes
        <Logo className="logo" />
      </H1>


      <div className="notes">
        <div className="add-note">
          <Button className="add-icon" aria-label="Add Note" leftGlyph={<Icon glyph={'PlusWithCircle'} />} onClick={() => {
            setSelectedNote(-1)
            setOpen(curr => !curr)
          }}>
            Add Note
          </Button>
        </div>
        {myNotes ? myNotes.map((item, index) => {
          return <Card key={index} style={{ backgroundColor: uiColors.green.base }} className="card-styles note" as="article">
            <IconButton className="edit-icon" aria-label="Edit Note" onClick={() => {
              console.log(index)
              setSelectedNote(index)
              setOpen(curr => !curr)
            }}>
              <Icon glyph="Edit" size="small" fill="#0D324F" />
            </IconButton>
            <H3 style={{ color: uiColors.white }} className="note-title">{item.title}</H3>
            <Body style={{ color: uiColors.white }} weight="medium">{item.content}</Body>
          </Card>
        }) : null}

        <Modal className="edit-note" open={open} setOpen={setOpen}>
          <TextInput
            name="note-title"
            className="input"
            label="Note Title"
            placeholder="My Note"
            onChange={event => {
              setTitle(event.target.value)
            }}
            value={title}
          />
          <TextArea
            name="note-content"
            className="input"
            label="Note Content"
            placeholder="Reminder: Eat more vegetables!"
            onChange={event => {
              setContent(event.target.value)
            }}
            value={content}
          />
          <Button onClick={() => deleteNote(selectedNote)} className="delete-button" variant={'danger'}>Delete</Button>
          <Button onClick={() => selectedNote >= 0 ? editNote(selectedNote) : createNote()} variant={'primary'} className="save-button"> Save </Button>
        </Modal>
      </div>
    </div>
  );
}

export default App;
