import { render, screen, fireEvent } from '@testing-library/react';
import EditNoteForm from './EditNoteForm';
import { shallow } from 'enzyme';
import userEvent from '@testing-library/user-event'


  describe('EditNoteForm', () => {
    it('should render correctly', () => {
      const component = shallow(<EditNoteForm  open={true} setOpen={null} data={null} handleNoteSave={null} handleNoteDelete={null} />);
      expect(component).toMatchSnapshot();
    });
  });

  test('title type', async () => {
    render(<EditNoteForm  open={true} setOpen={null} data={null} handleNoteSave={null} handleNoteDelete={null}/>)
  const textbox = screen.getByTestId('title-input');
  userEvent.type(textbox, 'Title');
  expect(await textbox).toHaveValue('Title');
  });

  test('content type', async () => {
    render(<EditNoteForm  open={true} setOpen={null} data={null} handleNoteSave={null} handleNoteDelete={null}/>)
  const textbox = screen.getByTestId('content-input');
  userEvent.type(textbox, 'content');
  expect(await textbox).toHaveValue('content');
  });

  it('submits when clicked', () => {
    const mockSave = jest.fn();
    const mockDelete = jest.fn();
    const wrapper = shallow(<EditNoteForm open={true} setOpen={null} data={null} handleNoteSave={mockSave} handleNoteDelete={mockDelete}/>);
    const saveButtonElement  = wrapper.find('#save-button');
    const deleteButtonElement  = wrapper.find('#delete-button');
    saveButtonElement.simulate('click');
    deleteButtonElement.simulate('click');
    expect(mockSave.mock.calls.length).toEqual(1);
    expect(mockDelete.mock.calls.length).toEqual(1);
  });

  it('should send data when note is saved', () => {
    const handleSubmit = jest.fn();
    render(<EditNoteForm open={true} setOpen={null} data={null} handleNoteSave={handleSubmit} handleNoteDelete={null} />)
    const titleInput = screen.getByTestId('title-input');
    const contentInput = screen.getByTestId('content-input');

    fireEvent.change(titleInput, {target: {value: "Note Title"}}) 
    fireEvent.change(contentInput, {target: {value: "contents"}}) 

    const buttonElement  = screen.getByText(/Save/i)
 
    fireEvent.click(buttonElement)
    expect(handleSubmit).toHaveBeenCalledWith({"content":'contents',"title":"Note Title"}) 
  
  });
  