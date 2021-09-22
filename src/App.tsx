import { useState } from 'react';
import './App.css';
import { uiColors } from '@leafygreen-ui/palette';
import { H1 } from '@leafygreen-ui/typography';
import { ReactComponent as Logo } from './MongoDB_Logo_Leaf.svg'
import Icon from '@leafygreen-ui/icon';
import Button from '@leafygreen-ui/button';
import Form from './components/Form';
import Note from './components/Note';


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
  const [selectedNote, setSelectedNote] = useState(-1)

  function createNote(title, content) {
    myNotes.push({
      title: title,
      content: content
    })
    setOpen(curr => !curr)
    saveNotesChanges()
  }

  function editNote(selectedNoteIndex, title, content) {
    myNotes[selectedNoteIndex] = {
      title: title,
      content: content
    }
    setOpen(curr => !curr)
    saveNotesChanges()
  }

  function handleNoteDelete() {

    console.log(selectedNote)
    if (selectedNote > -1 && selectedNote !== null) {
      myNotes.splice(selectedNote, 1);
    }
    setOpen(curr => !curr)
    saveNotesChanges()
  }

  function handleNoteSave({ title, content }) {
    console.log({ title }, { content })
    console.log(selectedNote)
    if (selectedNote >= 0) {
      editNote(selectedNote, title, content)
    } else {
      createNote(title, content)
    }
  }

  function handleNoteEdit(noteIndex: number) {
    setSelectedNote(noteIndex);
    setOpen(curr => !curr)
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
          return <Note key={index} cardId={index} data={item} handleEdit={handleNoteEdit} />
        }) : null}

      </div>
      <Form open={open} setOpen={setOpen} data={myNotes[selectedNote]} handleNoteSave={handleNoteSave} handleNoteDelete={handleNoteDelete} />
    </div>
  );
}

export default App;