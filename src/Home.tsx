import { useEffect, useState } from 'react';
import React from "react";
import './App.css';
import { uiColors } from '@leafygreen-ui/palette';
import { H1, H3 } from '@leafygreen-ui/typography';
import {
    LogoMark
} from '@leafygreen-ui/logo';
import Icon from '@leafygreen-ui/icon';
import Button from '@leafygreen-ui/button';
import AddNoteForm from './components/AddNoteForm';
import EditNoteForm from './components/EditNoteForm';
import Note from './components/Note';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import * as Realm from "realm-web";
import Banner from '@leafygreen-ui/banner';

const REALM_APP_ID = "leafy-green-notes-uwhsz";
const app: Realm.App = new Realm.App({ id: REALM_APP_ID });

var assert = require('assert')

function Home() {
    const [user, setUser] = React.useState<Realm.User | null>(app.currentUser);
    const [openSignup, setOpenSignup] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [openConfirmEmailBanner, setOpenConfirmEmailBanner] = useState(false)
    const [openLoginBanner, setOpenLoginBanner] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAddNote, setOpenAddNote] = useState(false);
    const [selectedNote, setSelectedNote] = useState(-1);
    const [notes, setNotes] = useState([]);
    const [openInvalidLoginBanner, setOpenInvalidLoginBanner] = useState(false);
    const [openInvalidSignupBanner, setOpenInvalidSignupBanner] = useState(false);
    let currentURL = window.location;

    useEffect(() => {
        confirmEmail()
    }, [currentURL])

    useEffect(() => {
        if (app.currentUser) {
            let mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const notesCollection = mongodb.db('Leafy-Green-Notes').collection("Notes")
            notesCollection.find().then(notes => setNotes(notes))
        }

    }, [notes])



    function confirmEmail() {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (window.location.href.indexOf("token") > -1) {
            console.log("token")
            const token = urlParams.get('token');
            const tokenId = urlParams.get('tokenId');
            app.emailPasswordAuth.confirmUser(token, tokenId)
            setOpenLoginBanner(curr => !curr)
            window.history.replaceState({}, document.title, "/Leafy-Green-Notes");
        }
    }


    function signupUser(email, password) {
        app.emailPasswordAuth.registerUser(email, password).then(() => {
            setOpenSignup(curr => !curr)
            setOpenConfirmEmailBanner(curr => !curr)
            setOpenInvalidSignupBanner(false)
        }, (err) => {
            console.error("Failed to register user", err);
            setOpenInvalidSignupBanner(true)
        })

    }
    function cancelNoteAdd() {
        setOpenAddNote(curr => !curr)
    }

    async function loginUser(email: string, password: string) {

        const credentials = Realm.Credentials.emailPassword(email, password);
        try {
            // Authenticate the user
            const user: Realm.User = await app.logIn(credentials);
            // `App.currentUser` updates to match the logged in user
            assert(user.id === app.currentUser.id)
            setUser(user)

            getUserNotes()
            setOpenLoginBanner(false)
            setOpenInvalidLoginBanner(false)
            setOpenLogin(curr => !curr)
            return user
        } catch (err) {
            console.error("Failed to log in", err);
            setOpenInvalidLoginBanner(true)
        }
    }

    function logoutUser() {
        if (app.currentUser) {
            app.currentUser.logOut()
        }
        setNotes([])
        setUser(null)
    }

    function getUserNotes() {
        let mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const notesCollection = mongodb.db('Leafy-Green-Notes').collection("Notes")
        notesCollection.find().then(notes => setNotes(notes))
    }


    function createNote(title, content) {
        let mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const notesCollection = mongodb.db('Leafy-Green-Notes').collection("Notes")
        notesCollection.insertOne({ "title": title, "content": content, "owner_id": app.currentUser.id }).then(() =>
            getUserNotes()
        )
        setOpen(false)
        setOpenAddNote(false)

    }

    function editNote(selectedNoteIndex, title, content) {
        let mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const notesCollection = mongodb.db('Leafy-Green-Notes').collection("Notes")
        const currentTitle = notes[selectedNoteIndex].title
        const currentContent = notes[selectedNoteIndex].content
        notesCollection.updateOne({ "title": currentTitle, "content": currentContent }, { $set: { "title": title, "content": content } })
            .then(() =>
                getUserNotes()
            )
        setOpen(curr => !curr)

    }

    function handleNoteDelete() {
        let mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const notesCollection = mongodb.db('Leafy-Green-Notes').collection("Notes")
        const currentTitle = notes[selectedNote].title
        const currentContent = notes[selectedNote].content
        notesCollection.deleteOne({ "title": currentTitle, "content": currentContent }).then(() =>
            getUserNotes()
        )

        setOpen(false)
        setOpenAddNote(false)
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
            
            {openConfirmEmailBanner ?
                <Banner dismissible={true} variant="warning" onClose={() => setOpenConfirmEmailBanner(curr => !curr)}>Confirm your email address. Check your inbox for the email address associated with your Leafy Green Notes account.</Banner>
                : null}
            {openLoginBanner ?
                <Banner dismissible={true} variant="success" onClose={() => setOpenLoginBanner(curr => !curr)}>Email confirmed! Please login to your account.</Banner>
                : null}
            {openInvalidLoginBanner ?
                <Banner dismissible={true} variant="danger" onClose={() => setOpenInvalidLoginBanner(curr => !curr)}>Invalid login credentials. Please try again.</Banner>
                : null}
            {openInvalidSignupBanner ?
                <Banner dismissible={true} variant="danger" onClose={() => setOpenInvalidSignupBanner(curr => !curr)}>Could not register user. Please make sure to enter a valid email address and password.</Banner>
                : null}
            <div className="source-code-badge">
                <a target="_blank" rel="noreferrer" href="https://github.com/aidenschrock/Leafy-Green-Notes">
                    <img alt="Made With Love Badge" src="https://img.shields.io/badge/Made With-♥-brightgreen"/>
                </a>
            </div>
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

            {user ? <Button onClick={() => logoutUser()}>Logout</Button> : <Button className="login-button" onClick={() => setOpenLogin(curr => !curr)}>Login</Button>}
            {!user ? <Button className="signup-button" onClick={() => setOpenSignup(curr => !curr)}>Sign Up</Button> : null}

            <SignupForm open={openSignup} setOpen={setOpenSignup} handleSubmit={signupUser}/>

            <LoginForm open={openLogin} setOpen={setOpenLogin} handleSubmit={loginUser}/>
               
            <div className="notes">
                {user ? <div className="add-note">
                    <Button className="add-icon" aria-label="Add Note" leftGlyph={<Icon glyph={'PlusWithCircle'} />} onClick={() => {
                        setSelectedNote(-1)
                        setOpenAddNote(curr => !curr)
                    }}>
                        Add Note
                    </Button>
                </div> : null}

                {(notes && user) ? notes.map((item, index) => {
                    return <Note key={index} cardId={index} data={item} handleEdit={handleNoteEdit} />
                }) : null}
            </div>

            <EditNoteForm open={open} setOpen={setOpen} data={notes[selectedNote]} handleNoteSave={handleNoteSave} handleNoteDelete={handleNoteDelete} />
            <AddNoteForm open={openAddNote} setOpen={setOpenAddNote} handleNoteSave={handleNoteSave} handleCancel={cancelNoteAdd} />

        </div>
    );
}


export default Home;