// #########################################################
// #########################################################
// ######################  Marc Tests #########3############
// #########################################################
// #########################################################

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer'

import LoginForm from './components/Registration/LoginForm';
import SearchListings from './components/Listings/SearchListings';
import ListingsCreate from './components/Listings/ListingsCreate';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

describe('LoginForm', () => {
  const noop = () => {};

  it('renders without crashing when props passed in', () => {
    shallow(<LoginForm setAuth={noop} />);
  });

  it('renders correct heading', () => {
    const wrapper = shallow(<LoginForm setAuth={noop} />);
    const title = 'Login';
    const header = <h1 className="text-center padding-bottom-xl">{title}</h1>;
    expect(wrapper.contains(header)).toBe(true);
  });

  it('renders 1 button which has text "Log in"', () => {
    render(<LoginForm setAuth={noop} />);
    const items = screen.getAllByRole('button')
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Log in');
  });

  it('button element has a succestful click feature', () => {
    const foo = jest.fn();
    const button = shallow((<Button onClick={foo}>Log in</Button>));
    button.find('button').simulate('click');
    expect(foo.mock.calls.length).toEqual(1);
  });

  it('renders 1 textbox which has placeholder text "Enter email"', () => {
    render(<LoginForm setAuth={noop} />);
    const items = screen.getAllByRole('textbox')
    expect(items).toHaveLength(1);
    expect(screen.getByPlaceholderText('Enter email') === items[0]);
  });

  it('checkbox is initally unchecked unless clicked then becomes checked', () => {
    render(<LoginForm setAuth={noop} />);
    const checkboxs = screen.getAllByRole('checkbox')
    expect(checkboxs).toHaveLength(1);
    expect(checkboxs[0].checked).toEqual(false)
    fireEvent.click(checkboxs[0])
    expect(checkboxs[0].checked).toEqual(true)
  });

  it('button initally disabled & only actives when valid email is input in form', () => {
    const { getByText } = render(<LoginForm setAuth={noop} />);
    const button = getByText(/Log in/i).closest('button');
    const email = screen.getByPlaceholderText('Enter email');
    const password = screen.getByPlaceholderText('Password');
    fireEvent.change(email, { target: { value: 'a' } })
    fireEvent.change(password, { target: { value: 'a' } })
    expect(button).toHaveAttribute('disabled');
    fireEvent.change(email, { target: { value: 'a@a.com' } })
    expect(button).not.toBeDisabled();
  });
});

describe('ViewListings', () => {
  it('renders 6 buttons, 4 are searching buttons, 2 are calendar button', () => {
    render(<SearchListings
        getState={[0, 0]}
        buttonFlag={[0, 0]}
        setStates={[0, 0, 0, 0, 0]}
      />);
    const items = screen.getAllByRole('button')
    expect(items).toHaveLength(6);
    expect(items[0].className.split(' ').includes('searchButton')).toBe(true);
    expect(items[1].className.split(' ').includes('searchButton')).toBe(true);
    expect(items[2].className.split(' ').includes('MuiButtonBase-root')).toBe(true);
    expect(items[3].className.split(' ').includes('searchButton')).toBe(true);
    expect(items[4].className.split(' ').includes('MuiButtonBase-root')).toBe(true);
    expect(items[5].className.split(' ').includes('searchButton')).toBe(true);
  });

  it('renders 2 non-linear sliders of max-val 1024 & min val 32', () => {
    render(<SearchListings
        getState={[0, 0]}
        buttonFlag={[0, 0]}
        setStates={[0, 0, 0, 0, 0]}
      />);
    const items = screen.getAllByRole('slider')
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('aria-labelledby', 'non-linear-slider');
    expect(items[1]).toHaveAttribute('aria-labelledby', 'non-linear-slider');
    expect(items[0]).toHaveAttribute('aria-valuemax', '1024');
    expect(items[1]).toHaveAttribute('aria-valuemax', '1024');
    expect(items[0]).toHaveAttribute('aria-valuemin', '32');
    expect(items[1]).toHaveAttribute('aria-valuemin', '32');
  });

  it('renders 4 textboxes, 2 for the date-inputs, 2 for strings', () => {
    render(<SearchListings
        getState={[0, 0]}
        buttonFlag={[0, 0]}
        setStates={[0, 0, 0, 0, 0]}
      />);
    const items = screen.getAllByRole('textbox')
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveAttribute('id', 'outlined-basic');
    expect(items[1]).toHaveAttribute('id', 'outlined-basic');
    expect(items[2]).toHaveAttribute('placeholder', 'dd/mm/yyyy');
    expect(items[3]).toHaveAttribute('placeholder', 'dd/mm/yyyy');
  });
});

describe('CreateListing', () => {
  it('renders succestfully and the same each time', () => {
    const create = renderer.create(<ListingsCreate/>).toJSON();
    expect(create).toMatchSnapshot();
  });

  it('renders correct heading', () => {
    const wrapper = shallow(<ListingsCreate/>);
    const title = 'Listings Create';
    const header = <h1 className="text-center padding-bottom-xl">{title}</h1>;
    expect(wrapper.contains(header)).toBe(true);
  });

  it('drop down menus trigger function on change', () => {
    const _onClick = jest.fn();
    const event = { target: ['House'] };
    shallow(
      <Form.Select autoFocus onChange={e => _onClick()}>
        <option>House</option>
        <option>Villa</option>
      </Form.Select>).simulate('change', event);
    expect(_onClick).toHaveBeenCalledTimes(1)
  });

  it('number inputs trigger function on change when event is number', () => {
    const _onClick = jest.fn();
    const event = { target: [4] };
    shallow(<Form.Control autoFocus type="number"
      onChange={e => _onClick()}/>).simulate('change', event);
    expect(_onClick).toHaveBeenCalledTimes(1)
  });

  it('string inputs do not trigger function on change when event change is a string', () => {
    const _onClick = jest.fn();
    const event = { target: ['Apples'] };
    shallow(<Form.Control autoFocus type="string"
      onChange={e => _onClick()}/>).simulate('change', event);
    expect(_onClick).toHaveBeenCalledTimes(1)
  });

  it('renders 4 spinbuttons', () => {
    render(<ListingsCreate/>);
    const items = screen.getAllByRole('spinbutton')
    expect(items).toHaveLength(4);
  });
});

// #########################################################
// #########################################################
// ####################  Matthew Tests #####################
// #########################################################
// #########################################################

// import React from 'react';
// // import { render, screen } from '@testing-library/react';
// import { shallow } from 'enzyme';
// // import components to be tested
// import {NavBar} from "./components/NavBar/NavBar"

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// describe('NavBar', () => {
//   // const noop = () => {};

//   const onClick = jest.fn();

//   it('triggers onClick event handler when clicked', () => {
//     const onClick = jest.fn();
//     shallow(<NavBar onClick={onClick} open={false} />).simulate('click');
//     expect(onClick).toBeCalledTimes(1);
//   });

// });

// following is example code from tut09

// import { shallow } from 'enzyme';
// import * as React from 'react';
// import {Menu, MenuButton, MenuItem} from './Menu';

// describe('MenuButton', () => {
//   const noop = () => {};

//   it('triggers onClick event handler when clicked', () => {
//     const onClick = jest.fn();
//     shallow(<MenuButton onClick={onClick} open={false} />).simulate('click');
//     expect(onClick).toBeCalledTimes(1);
//   });

//   it('aria-label attribute is defined', () => {
//     const button = shallow(<MenuButton onClick={noop} open={false} />);
//     expect(button.props()['aria-label']).toBeDefined();
//   });

//   it('sets aria-expanded to false when closed', () => {
//     const button = shallow(<MenuButton onClick={noop} open={false} />);
//     expect(button.props()['aria-expanded']).toBe(false);
//   });

//   it('sets aria-expanded to true when open', () => {
//     const button = shallow(<MenuButton onClick={noop} open={true} />);
//     expect(button.props()['aria-expanded']).toBe(true);
//   });
// });

// describe('MenuItem', () => {
//   const noop = () => {};

//   it('triggers onClick event handler with title when clicked', () => {
//     const onClick = jest.fn();
//     shallow(<MenuItem onClick={onClick} title={'A title'} />).simulate('click');
//     expect(onClick).toBeCalledWith('A title');
//   });

//   it('renders with custom title', () => {
//     const title = 'My custom title';
//     const button = shallow(<MenuItem onClick={noop} title={title} />);
//     expect(button.text()).toBe(title);
//   })
// });

// describe('Menu', () => {
//   const noop = () => {};
//   const items = ['Item 1', 'Item 2', 'Item 3'];

//   it('is closed by default', () => {
//     const menu = shallow(<Menu onClick={noop} items={items} />);
//     expect(menu.find(MenuButton).first()).toBeDefined();
//     expect(menu.find(MenuItem).length).toBe(0);
//   });

//   it('creates a MenuItem for every provided item', () => {
//     const menu = shallow(<Menu onClick={noop} items={items} />);
//     expect(menu.find(MenuItem).length).toBe(0);
//     menu.find(MenuButton).first().simulate('click');
//     expect(menu.find(MenuItem).length).toBe(3);
//   });
// });
