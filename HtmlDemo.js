import React from 'react';
import {CodeHighlighter} from 'components/atoms';

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
  output: {
    height: '100%',
  },
};

const HtmlDemo = ({srcString, highlightLines}) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.tab}>
        <div style={styles.label}>Code</div>
        <CodeHighlighter>{srcString}</CodeHighlighter>
      </div>
      <div style={styles.tab}>
        <div style={styles.label}>Result</div>
        <iframe style={styles.output} srcDoc={srcString}></iframe>
      </div>
    </div>
  );
};

export default HtmlDemo;
