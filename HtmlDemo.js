import React from 'react';
import {CodeHighlighter} from 'components/atoms';
import * as demoStyles from './demo.module.css';

const styles = {
  tab: {
    display: 'flex',
    flex: '1',
    flexFlow: 'column nowrap',
    margin: '2px',
    minWidth: '380px',
  },
  code: {
    height: 230,
  },
  output: {
    height: 230,
    border: 'none',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: '0.3em',
  },
};

const codeBlocks = nodes =>
  nodes
    .filter(node => node.props.originalType === 'pre')
    .map(pre => pre.props.children)
    .filter(codeEl => codeEl.props.mdxType === 'code');

const makeSrcString = nodes => {
  return codeBlocks(nodes)
    .map(block => {
      if (block.props.className === 'language-js') {
        return `<script>\n${block.props.children}\n</script>`;
      } else if (block.props.className === 'language-css') {
        return `<style>\n${block.props.children}\n</style>`;
      } else if (block.props.className === 'language-html') {
        return block.props.children;
      } else {
        throw new Error('JsDemo code blocks must be html, css, or js');
      }
    })
    .join('\n\n');
};

const HtmlDemo = ({children, srcString, lineColors}) => {
  const src = srcString || makeSrcString(React.Children.toArray(children));
  const display = children || <CodeHighlighter lineColors={lineColors}>{src}</CodeHighlighter>;
  return (
    <div className={demoStyles.wrapper}>
      <div style={styles.tab}>
        <div className={demoStyles.label}>Code</div>
        <div className={demoStyles.code} style={styles.code}>
          {display}
        </div>
      </div>
      <div style={styles.tab}>
        <div className={demoStyles.label}>Result</div>
        <iframe style={styles.output} srcDoc={src}></iframe>
      </div>
    </div>
  );
};

export default HtmlDemo;
