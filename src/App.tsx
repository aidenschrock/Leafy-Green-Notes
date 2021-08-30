import React from 'react';
import './App.css';
import { uiColors } from '@leafygreen-ui/palette';
import { H1, H3, Body } from '@leafygreen-ui/typography';
import Card from '@leafygreen-ui/card';
import { ReactComponent as Logo } from './MongoDB_Logo_Leaf.svg'
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';

function App() {
  return (
<div style={{ backgroundColor: uiColors.white }} className="App">
     <H1 className="header" style={{ color: uiColors.green.base }}>Leafy Green Notes
     <Logo className="logo"/>
     </H1>
    <div className="notes">
    <Card style={{ backgroundColor: uiColors.green.base}} className="card-styles note" as="article">
      <IconButton className="edit-icon" aria-label="Edit Note">
      <Icon glyph="Edit" size="small" fill="#0D324F"/>
      </IconButton>
    
      <H3 style={{ color: uiColors.white }} className="note-title">Note Title</H3>
      <Body style={{ color: uiColors.white }} weight="medium">This is a note</Body>
  
  </Card>;
    </div>
     
    </div>
  );
}

export default App;
