import { render, screen } from '@testing-library/react';
import Home from './Home';

test('Does Home Render', ()=> {
    render(<Home/>)
    screen.debug();
  })
