import React from 'react';
import ReactDOM from 'react-dom';
import App, { convertTaskToArray } from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('convert obj to array', () => {
  const data = {'test': {
    name: 'someName',
    checked: true
  }}
  const output = [{
    name: 'someName',
    checked: true,
    id: 'test'
  }]
  expect(convertTaskToArray(data)).toEqual(output);
});


it('convert empty obj to array', () => {
  const data = {}
  const output = []
  expect(convertTaskToArray(data)).toEqual(output);
});

it('check orders', () => {
  const data = {
    'test': {
      name: 'firstName',
      order: 3
    },
    'test2': {
      name: 'secondName',
      order: 6
    },
    'test3': {
      name: 'thirdName',
      order: 1
    }
  }
  const output = [{
      name: 'thirdName',
      order: 1,
      id: 'test3'
    },
    {
      name: 'firstName',
      order: 3,
      id: 'test'
    },
    {
      name: 'secondName',
      order: 6,
      id: 'test2'
    }
  ]
  expect(convertTaskToArray(data)).toEqual(output);
});
