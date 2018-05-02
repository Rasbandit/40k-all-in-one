import React from 'react';

const Input = props => (
  <div className="input">
    <h2>{props.label}: </h2>
    <input
      id={props.property}
      type="text"
      value={props.data}
      onChange={({ target: { id, value } }) => {
        props.handleChange(id, value);
      }}
    />
  </div>
);

export default Input;
