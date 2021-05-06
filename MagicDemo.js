import React, {useState} from 'react';
import HtmlDemo from './HtmlDemo';
import * as styles from './demo.module.css';

const MagicInput = ({name, type = 'text', state, updateState}) => (
  <div>
    <label for={name}>{name}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={state[name]}
      onChange={e => updateState({...state, [name]: e.target.value})}
    />
  </div>
);

const MagicDemo = ({input, template, initialState = {}}) => {
  const [inputState, setInputState] = useState(initialState);

  return (
    <div className={styles.magic}>
      <div className={styles.label}>Playground</div>
      <div className={styles.hint}>
        Try changing these values. See what changes in the code and in the output.
      </div>
      <div className={styles.inputs}>{input(inputState, setInputState)}</div>
      <HtmlDemo srcString={template(inputState)} />
    </div>
  );
};

export default MagicDemo;
export {MagicInput};
