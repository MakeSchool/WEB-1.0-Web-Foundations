import React, {useState} from 'react';
import HtmlDemo from './HtmlDemo';

const MagicDemo = ({input, template, initialState = {}}) => {
  const [inputState, setInputState] = useState(initialState);

  return (
    <>
      {input(inputState, setInputState)}
      <HtmlDemo srcString={template(inputState)} />
    </>
  );
};

export default MagicDemo;
