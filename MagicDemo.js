import React, {useState} from 'react';
import HtmlDemo from './HtmlDemo';

const styles = {
  wrapper: {display: 'flex', flexFlow: 'row wrap'},
  tab: {display: 'flex', flex: '1', flexFlow: 'column nowrap', margin: 16, maxWidth: '450px'},
  label: {
    border: '1px solid black',
    borderTopRadius: 2,
    borderBottom: 'none',
    padding: 4,
    margin: 4,
  },
};

const MagicDemo = ({input, template}) => {
  const [inputState, setInputState] = useState({});

  return (
    <>
      {input(inputState, setInputState)}
      <HtmlDemo srcString={template(inputState)} />
    </>
  );
};

export default MagicDemo;
