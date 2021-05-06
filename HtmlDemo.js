import React from 'react';
import {CodeHighlighter} from 'components/atoms';
import * as demoStyles from './demo.module.css';

const styles = {
  wrapper: {
    display: 'flex',
    flexFlow: 'row wrap',
    margin: '16px 0',
    padding: '4px 4px 8px',
    border: '1px solid #2D3748',
    backgroundColor: '#2D3748',
    borderRadius: '4px',
  },
  tab: {
    display: 'flex',
    flex: '1',
    flexFlow: 'column nowrap',
    margin: '2px',
    minWidth: '380px',
  },
  label: {
    width: 'max-content',
    padding: 6,
    margin: '0 4px 4px 4px',
    textTransform: 'uppercase',
    color: 'rgb(238, 238, 239)',
    fontWeight: 'bold',
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

const HtmlDemo = ({children, srcString}) => {
  const src = srcString || makeSrcString(React.Children.toArray(children));
  const display = children || <CodeHighlighter>{src}</CodeHighlighter>;
  return (
    <div style={styles.wrapper}>
      <div style={styles.tab}>
        <div style={styles.label}>Code</div>
        <div className={demoStyles.code} style={styles.code}>
          {display}
        </div>
      </div>
      <div style={styles.tab}>
        <div style={styles.label}>Result</div>
        <iframe style={styles.output} srcDoc={src}></iframe>
      </div>
    </div>
  );
};

export default HtmlDemo;
