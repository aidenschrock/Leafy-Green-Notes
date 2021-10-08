import { render, screen, fireEvent } from '@testing-library/react';
import AddNoteForm from './AddNoteForm';
import { shallow } from 'enzyme';
import userEvent from '@testing-library/user-event'


  describe('AddNoteForm', () => {
    it('should render correctly', () => {
      const component = shallow(<AddNoteForm  open={true} setOpen={null} handleNoteSave={null} handleCancel={null} />);
      expect(component).toMatchSnapshot();
    });
  });

  test('title type', async () => {
    render(<AddNoteForm  open={true} setOpen={null} handleNoteSave={null} handleCancel={null}/>)
  const textbox = screen.getByTestId('title-input');
  userEvent.type(textbox, 'Title');
  expect(await textbox).toHaveValue('Title');
  });

  test('content type', async () => {
    render(<AddNoteForm  open={true} setOpen={null} handleNoteSave={null} handleCancel={null}/>)
  const textbox = screen.getByTestId('content-input');
  userEvent.type(textbox, 'content');
  expect(await textbox).toHaveValue('content');
  });

  it('submits when clicked', () => {
    const mockSave = jest.fn();
    const mockCancel = jest.fn();
    const wrapper = shallow(<AddNoteForm open={true} setOpen={null} handleNoteSave={mockSave} handleCancel={mockCancel}/>);
    const saveButtonElement  = wrapper.find('#save-button');
    const cancelButtonElement  = wrapper.find('#cancel-button');
    saveButtonElement.simulate('click');
    cancelButtonElement.simulate('click');
    expect(mockSave.mock.calls.length).toEqual(1);
    expect(mockCancel.mock.calls.length).toEqual(1);
  });

  it('should send data when note is saved', () => {
    const handleSubmit = jest.fn();
    render(<AddNoteForm open={true} setOpen={null} handleNoteSave={handleSubmit} handleCancel={null} />)
    const titleInput = screen.getByTestId('title-input');
    const contentInput = screen.getByTestId('content-input');

    fireEvent.change(titleInput, {target: {value: "Note Title"}}) 
    fireEvent.change(contentInput, {target: {value: "contents"}}) 

    const buttonElement  = screen.getByText(/Save/i)
 
    fireEvent.click(buttonElement)
    expect(handleSubmit).toHaveBeenCalledWith({"content":'contents',"title":"Note Title"}) 
  
  });
  