import React from 'react';
import {CodeHighlighter} from 'components/atoms';
import * as styles from './demo.module.css';

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

const HtmlDemo = ({children, srcString, lineColors, extra, replace = {}}) => {
  let src = srcString || makeSrcString(React.Children.toArray(children));
  const display = children || <CodeHighlighter lineColors={lineColors}>{src}</CodeHighlighter>;
  for (let key in replace) {
    src = src.replaceAll(key, replace[key]);
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.tab}>
        <div className={styles.label}>Code</div>
        <div className={styles.code}>{display}</div>
      </div>
      <div className={styles.tab}>
        <div className={styles.label}>Result</div>
        <iframe className={styles.output} srcDoc={[src, extra].join('\n')}></iframe>
      </div>
    </div>
  );
};

export default HtmlDemo;
