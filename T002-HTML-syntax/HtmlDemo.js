import React from 'react';
import {CodeHighlighter} from 'components/atoms';

const styles = {
  wrapper: {display: 'flex', flexFlow: 'row wrap'},
  tab: {display: 'flex', flexFlow: 'column nowrap', margin: 16},
  label: {
    border: '1px solid black',
    borderTopRadius: 2,
    borderBottom: 'none',
    padding: 4,
    margin: 4,
  },
};

const HtmlDemo = ({srcString}) => {
  console.log(srcString);
  return (
    <div style={styles.wrapper}>
      <div style={styles.tab}>
        <div style={styles.label}>Code</div>
        <CodeHighlighter>{srcString}</CodeHighlighter>
      </div>
      <div style={styles.tab}>
        <div style={styles.label}>Result</div>
        <iframe srcDoc={srcString}></iframe>
      </div>
    </div>
  );
};

export default HtmlDemo;
