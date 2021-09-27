import * as React from "react";


class Authentication extends React.Component {

    confirmUser() {
        // console.log(qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).token)
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams)
        const REALM_APP_ID = "leafy-green-notes-uwhsz";
        const app: Realm.App = new Realm.App({ id: REALM_APP_ID });
        const token = '';
        const tokenId = '';
        app.emailPasswordAuth.confirmUser(token, tokenId)
    }
    render() {
        return (
            <h1>Email confirmed!</h1>
        );
    }
}

export default Authentication;