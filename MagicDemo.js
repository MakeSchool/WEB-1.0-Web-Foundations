import React, {useState} from 'react';
import HtmlDemo from './HtmlDemo';
import * as styles from './demo.module.css';

const MagicInput = ({name, color, type = 'text', state, updateState}) => (
  <div>
    <label style={{textDecorationColor: color}} htmlFor={name}>
      {name}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={state[name]}
      style={{borderColor: color}}
      onChange={e => updateState({...state, [name]: e.target.value})}
    />
  </div>
);

const magicColors = [
  // https://coolors.co/90f1ef-ffc2d1-9ef6a6-ffee99-ffd199-7389ae-e8b0be-e0f5a2-c1fba4-7bf1a8
  '#90f1efff', // electric-blue
  '#ffc2d1ff', // pink
  '#9ef6a6ff', // light-green
  '#ffee99ff', // green-yellow-crayola
  '#ffd199ff', // deep-champagne
  '#7389aeff', // shadow-blue
  '#e8b0beff', // cameo-pink
  '#e0f5a2ff', // key-lime
  '#c1fba4ff', // mint-green
  '#7bf1a8ff', // light-green-2
];

const type = value => {
  if (typeof value === 'number') {
    return 'number';
  } else if (value.match(/#\w{3,6}/)) {
    return 'color';
  } else {
    return 'text';
  }
};

const MagicDemo = ({template, initialState = {}}) => {
  // map each input to a color
  const names = Object.keys(initialState);
  const colorMap = names.reduce((map, name, i) => {
    map[name] = magicColors[i];
    return map;
  }, {});

  const [inputState, setInputState] = useState(initialState);

  const inputs = names.map(name => (
    <MagicInput
      type={type(initialState[name])}
      color={colorMap[name]}
      name={name}
      state={inputState}
      updateState={setInputState}
    />
  ));

  let srcString = template(inputState);
  let lineColors = {};
  let lines = srcString.split(/\n/);
  lines.forEach((line, index) => {
    for (let name of names) {
      let value = inputState[name];
      if (value && value.toString().length > 2 && line.match(value)) {
        lineColors[index + 1] = colorMap[name];
        break;
      }
    }
  });

  // please excuse this hack
  // it's styling the elements in the iframe with the magic colors
  // it's evaluating a script in the iframe
  // the script uses an xpath to find the elements with matching text :o
  // and adds a border to those nodes, with the matching color
  let extra = `
 <script>

  function highlight(value, color) {
    let result = document.evaluate('//*[text()="' + value + '"]', document, null, XPathResult.ANY_TYPE);
    let found = [];
    while(res = result.iterateNext()) {
      found.push(res);
    }
    found.forEach(node => {node.style.border = '4px solid ' + color})
  }

  ${names.map(name => `highlight("${inputState[name]}", "${colorMap[name]}")`).join(';\n\t')};
</script>`;

  return (
    <div className={styles.magic}>
      <div className={styles.label}>Playground</div>
      <div className={styles.hint}>
        Try changing these values. See what changes in the code and in the output.
      </div>
      <div className={styles.inputs}>{inputs}</div>
      <HtmlDemo lineColors={lineColors} srcString={srcString} extra={extra} />
    </div>
  );
};

export default MagicDemo;
export {MagicInput};
