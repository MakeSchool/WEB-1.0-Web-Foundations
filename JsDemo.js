import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import * as styles from './demo.module.css';

/*
  Renders child code blocks as children and as an embedded iframe.
*/

const codeBlocks = nodes =>
  nodes
    .filter(node => node.props.originalType === 'pre')
    .map(pre => pre.props.children)
    .filter(codeEl => codeEl.props.mdxType === 'code');

const makeSrcString = blocks =>
  blocks
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

// global count of jsDemos as an id
// so that we can match up the log messages from embedded frames with the correct parents
let demoId = 1;

const JsDemo = ({children, defer = false}) => {
  let [run, setRun] = useState(!defer);
  const blocks = codeBlocks(React.Children.toArray(children));
  const srcString = makeSrcString(blocks);
  const hasJs = blocks.some(block => block.props.className === 'language-js');
  const hasHtml = blocks.some(block => block.props.className === 'language-html');

  // capture console output and show the log messages
  const [captured, setCaptured] = useState(['']);
  const [id, setId] = useState(null);

  useEffect(() => {
    let componentId = demoId++;
    setId(componentId);
    const logChildFrameMessage = event => {
      if (event.data.id && event.data.id === componentId) {
        if (event.data.message === 'clearConsole') {
          setCaptured([]);
        } else if (event.data.message === 'frameConsoleLog') {
          setCaptured(messages => [...messages, ...event.data.value]);
        } else if (event.data.message === 'frameError') {
          setCaptured(messages => [...messages, event.data.error]);
        }
      }
    };
    window.addEventListener('message', logChildFrameMessage);
    return () => window.removeEventListener('message', logChildFrameMessage);
  }, []);

  /*
  Inject two handlers to the embedded iframe
    1 - post a message to the parent window on error
    2 - post a message to the parent window on a console log
  Then, post a message to the parent window clearing the console
  That way, if the iframe runs twice, we don't get double logs
   */
  const injectCaptureConsole = `<script>
    window.parent.postMessage({message: 'clearConsole', id: ${id}}, '*');
    const originalLog = console.log;
    console.log = function (...args) {
      window.parent.postMessage({message: 'frameConsoleLog', id: ${id}, value: args}, '*');
      originalLog(...args);
    };
    window.onerror = function(message, source, lineno, colno, error) {
      window.parent.postMessage({message: 'frameError', id: ${id}, error: error}, '*');
      return true;
    }
  </script>`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tab}>
        <div className={styles.label}>Code</div>
        <div className={styles.code}>{children}</div>
      </div>
      <div className={`${styles.tab} ${styles.result}`}>
        <div className={styles.label}>Result</div>
        {defer && (
          <button
            className={'MuiButtonBase-root MuiButton-root MuiButton-containedPrimary'}
            onClick={() => setRun(true)}
          >
            Run
          </button>
        )}
        <div className={styles.content}>
          <iframe
            className={clsx(styles.frame, !hasHtml && styles.hide)}
            srcDoc={
              run ? [injectCaptureConsole, srcString].join('\n') : 'Click run to see the result'
            }
          ></iframe>
          {hasJs && (
            <div className={clsx(styles.frame, styles.console)}>
              {captured.map((message, index) =>
                message instanceof Error ? (
                  <div key={index} className={styles.error}>
                    &raquo; {message.toString()}
                  </div>
                ) : (
                  <div key={index}>&raquo; {message}</div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsDemo;
