import { render, screen, fireEvent } from '@testing-library/react';
import SignupForm from './SignupForm';
import { shallow } from 'enzyme';
import userEvent from '@testing-library/user-event'


  describe('SignupForm', () => {
    it('should render correctly', () => {
      const component = shallow(<SignupForm  open={true} setOpen={null} handleSubmit={null} />);
      expect(component).toMatchSnapshot();
    });
  });

  test('email type', async () => {
    render(<SignupForm  open={true} setOpen={null} handleSubmit={null}/>)
  const textbox = screen.getByTestId('email-input');
  userEvent.type(textbox, 'test@email.com');
  expect(await textbox).toHaveValue('test@email.com');
  });

  test('password type', async () => {
    render(<SignupForm  open={true} setOpen={null} handleSubmit={null}/>)
  const textbox = screen.getByTestId('password-input');
  userEvent.type(textbox, 'P@ssw3rd');
  expect(await textbox).toHaveValue('P@ssw3rd');
  });

  it('submits when clicked', () => {
    const mockCallBack = jest.fn();
    const wrapper = shallow(<SignupForm open={true} setOpen={null} handleSubmit={mockCallBack}/>);
    const buttonElement  = wrapper.find('#submit-button');
    buttonElement.simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });

  it('should send data when form is submitted', () => {
    const handleSubmit = jest.fn();
    render(<SignupForm open={true} setOpen={null} handleSubmit={handleSubmit} />)
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(emailInput, {target: {value: "test@email.com"}}) 
    fireEvent.change(passwordInput, {target: {value: "P@ssw3rd"}}) 

    const buttonElement  = screen.getByText(/Submit/i)
 
    fireEvent.click(buttonElement)
    expect(handleSubmit).toHaveBeenCalledWith('test@email.com','P@ssw3rd') 
  
  });
  