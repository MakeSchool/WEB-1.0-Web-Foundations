import React, {useState} from 'react';

/*
  Renders child code blocks as children and as an embedded iframe.
*/

const codeBlocks = nodes =>
  nodes
    .filter(node => node.props.originalType === 'pre')
    .map(pre => pre.props.children)
    .filter(codeEl => codeEl.props.mdxType === 'code');

const makeSrcString = nodes =>
  codeBlocks(nodes)
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

const JsDemo = ({children, defer = false}) => {
  let [run, setRun] = useState(!defer);
  const srcString = makeSrcString(children);
  return (
    <div>
      <div>{children}</div>
      <button onClick={() => setRun(true)}>Run</button>
      <div>
        <iframe srcDoc={run ? srcString : 'Click run to see the result'}></iframe>
      </div>
    </div>
  );
};

export default JsDemo;
