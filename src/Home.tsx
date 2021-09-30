import { useState} from 'react';
import React from "react";
import './App.css';
import { uiColors } from '@leafygreen-ui/palette';
import { H1, H3 } from '@leafygreen-ui/typography';
import {
    LogoMark
} from '@leafygreen-ui/logo';
import Icon from '@leafygreen-ui/icon';
import Button from '@leafygreen-ui/button';
import Form from './components/Form';
import Note from './components/Note';
import * as Realm from "realm-web";
import Modal from '@leafygreen-ui/modal';
import TextInput from '@leafygreen-ui/text-input';
import Banner from '@leafygreen-ui/banner';

const REALM_APP_ID = "leafy-green-notes-uwhsz";
const app: Realm.App = new Realm.App({ id: REALM_APP_ID });
const mongodb = app.currentUser.mongoClient("mongodb-atlas");
const notesCollection=mongodb.db('Leafy-Green-Notes').collection("Notes")

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

var assert = require('assert')

function Home() {
    const [user, setUser] = React.useState<Realm.User | null>(app.currentUser);
    const [openSignup, setOpenSignup] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openBanner, setOpenBanner] = useState(false)
    const [open, setOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(-1)
    const [notes, setNotes] = useState([])

    window.onload = function exampleFunction() {
        
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        // const urlParams = new URLSearchParams(window.location.search);
        if (window.location.href.indexOf("token") > -1) {
            console.log('token')
            console.log(urlParams.get('token'));
            console.log(urlParams.get('tokenId'));
            const token = urlParams.get('token');
            const tokenId = urlParams.get('tokenId');
            app.emailPasswordAuth.confirmUser(token, tokenId)
        }
    }


    function signupUser(email, password) {
        app.emailPasswordAuth.registerUser(email, password);
        setOpenSignup(curr => !curr)
        setOpenBanner(curr => !curr)
    }

    async function loginUser(email: string, password: string) {
        // Create an anonymous credential
        const credentials = Realm.Credentials.emailPassword(email, password);
        try {
            // Authenticate the user
            const user: Realm.User = await app.logIn(credentials);
            // `App.currentUser` updates to match the logged in user
            assert(user.id === app.currentUser.id)
            setUser(user)
            setOpenLogin(curr => !curr)
            return user
        } catch (err) {
            console.error("Failed to log in", err);
        }
    }
   
    function getUserNotes(){
        notesCollection.find().then(notes => setNotes(notes))
    }
    

    function createNote(title, content) {
        notesCollection.insertOne({"title": title, "content": content, "owner_id":app.currentUser.id})
        setOpen(curr => !curr)
        saveNotesChanges()
    }

    function editNote(selectedNoteIndex, title, content) {
        const currentTitle=notes[selectedNoteIndex].title
        const currentContent=notes[selectedNoteIndex].content
        notesCollection.updateOne({"title": currentTitle, "content": currentContent}, {$set: {"title": title, "content": content}})
        setOpen(curr => !curr)
        saveNotesChanges()
    }

    function handleNoteDelete() {
        console.log(notes[selectedNote])
        const currentTitle=notes[selectedNote].title
        const currentContent=notes[selectedNote].content
        notesCollection.deleteOne({"title": currentTitle, "content": currentContent})
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



    // Create a component that displays the given user's details
    const UserDetail: React.FC<{ user: Realm.User }> = ({ user }) => {
        return (
            <div>
                <H3>Current User: {user.profile.email}</H3>
            </div>
        );
    }

    return (

        <div style={{ backgroundColor: uiColors.white }} className="App">
            {openBanner ?
                <Banner dismissible={true} variant="warning" onClose={() => setOpenBanner(curr => !curr)}>Confirm your email address. Check your inbox for the email address associated with your Leafy Green Notes account.</Banner>
                : null}
            <div className="header">
                <H1 style={{ color: uiColors.green.base }}>Leafy Green Notes
                </H1>
                <LogoMark height={60} className="logo" />
            </div>
            <div>
                <div className="current-user">
                    {user ? <UserDetail user={user} /> : null}
                </div>
            </div>
                <Button onClick={getUserNotes}>Testing Button</Button>
            <Button className="signup-button" onClick={() => setOpenSignup(curr => !curr)}>Sign Up</Button>
            <Modal open={openSignup} setOpen={setOpenSignup}>
                <TextInput
                    className="input"
                    type="email"
                    label="Email"
                    description="Enter your email below"
                    placeholder="your.email@example.com"

                    onChange={event => {
                        setEmail(event.target.value)
                    }}

                />
                <TextInput
                    className="input"
                    type="password"
                    label="Password"
                    description="Enter your password below"

                    onChange={event => {
                        setPassword(event.target.value)
                    }}

                />
                <Button variant={'primary'} onClick={() => signupUser(email, password)}>Submit</Button>
            </Modal>
            <Button className="login-button" onClick={() => setOpenLogin(curr => !curr)}>Login</Button>
            <Modal open={openLogin} setOpen={setOpenLogin}>
                <TextInput
                    className="input"
                    type="email"
                    label="Email"
                    description="Enter your email below"
                    placeholder="your.email@example.com"

                    onChange={event => {
                        setEmail(event.target.value)
                    }}

                />
                <TextInput
                    className="input"
                    type="password"
                    label="Password"
                    description="Enter your password below"

                    onChange={event => {
                        setPassword(event.target.value)
                    }}

                />
                <Button variant={'primary'} onClick={() => loginUser(email, password)}>Submit</Button>
            </Modal>
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
                {notes ? notes.map((item, index) => {
                    return <Note key={index} cardId={index} data={item} handleEdit={handleNoteEdit} />
                }) : null}
            </div>
            <Form open={open} setOpen={setOpen} data={myNotes[selectedNote]} handleNoteSave={handleNoteSave} handleNoteDelete={handleNoteDelete} />



        </div>
    );
}


export default Home;