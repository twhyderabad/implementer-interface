import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotificationContainer from 'common/Notification';
import { commonConstants } from 'common/constants';
import CodeMirror from 'codemirror';
import { JSHINT } from 'jshint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/javascript-lint.js';

window.JSHINT = JSHINT;

export default class ScriptEditorModal extends Component {
  constructor(props) {
    super(props);
    this.validateScript = this.validateScript.bind(this);
    this.state = { script: this.props.script, notification: {}, codeMirrorEditor: {} };
    this.codeMirrorEditor = null;
    this.scriptEditorTextArea = null;
    this.setScriptEditorTextArea = element => {
      this.scriptEditorTextArea = element;
    };
  }

  componentDidMount() {
    const scriptEditorTextArea = this.scriptEditorTextArea;
    this.codeMirrorEditor = CodeMirror.fromTextArea(scriptEditorTextArea, {
      lineNumbers: true,
      mode: { name: 'javascript', globalVars: true },
      gutters: ['CodeMirror-lint-markers'],
      lint: true,
    });
  }

  validateScript() {
    try {
      const script = this.codeMirrorEditor.getValue().trim();
      /* eslint-disable no-eval*/
      if (script.trim().length > 0) eval(`(${script})`);
      this.props.updateScript(script);
    } catch (ex) {
      const errorNotification = {
        message: 'Please Enter valid javascript function',
        type: commonConstants.responseType.error,
      };
      this.setState({ notification: errorNotification });

      setTimeout(() => {
        this.setState({ notification: {} });
      }, commonConstants.toastTimeout);
    }
  }


  render() {
    return (
      <div>
        <NotificationContainer
          notification={this.state.notification}
        />
        <div className="dialog-wrapper"></div>
        <div className="dialog area-height--dialog script-editor-container">
          <h2 className="header-title">Editor</h2>
          <textarea autoFocus className="editor-wrapper area-height--textarea"
            defaultValue={this.state.script} ref={this.setScriptEditorTextArea}
          >
          </textarea>
          <div className="script-editor-button-wrapper">
            <button className="button btn--highlight"
              onClick={() => this.validateScript(this.state.script)}
              type="submit"
            >
              Save
            </button>
            <button className="btn"
              onClick={() => this.props.close()}
              type="reset"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ScriptEditorModal.propTypes = {
  close: PropTypes.func.isRequired,
  script: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};

ScriptEditorModal.defaultProps = {
  script: '',
};
