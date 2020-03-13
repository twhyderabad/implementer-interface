import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import jsBeautifier from 'js-beautify';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/edit/closebrackets.js';

window.JSHINT = JSHINT;

export default class ScriptEditorComponentModal extends Component {
  constructor(props) {
    super(props);
    this.validateScript = this.validateScript.bind(this);
    this.state = { script: this.props.script, notification: {}, codeMirrorEditor: {} };
    this.codeMirrorEditor = null;
    this.scriptEditorTextArea = null;
    this.setScriptEditorTextArea = element => {
      this.scriptEditorTextArea = element;
    };
    this.format = this.format.bind(this);
  }

  componentDidMount() {
    const scriptEditorTextArea = this.scriptEditorTextArea;
    this.codeMirrorEditor = CodeMirror.fromTextArea(scriptEditorTextArea, {
      mode: { name: 'javascript', globalVars: true },
      autoCloseBrackets: true,
      readOnly: true,
      indentWithTabs: true,
      tabSize: 2,
    });
  }

  validateScript() {
    try {
      this.format();
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

  format() {
    const beautifiedData = jsBeautifier.js_beautify(this.codeMirrorEditor.getValue(),
      { indent_size: 2, space_in_empty_paren: true });
    this.codeMirrorEditor.setValue(beautifiedData);
  }

  render() {
    let eventLabel = '';
    if (this.props.event.id !== undefined) {
      eventLabel = `Control ID:${this.props.event.id}   Name:`;
    }
    eventLabel = eventLabel + this.props.event.name;
    return (
      <div style={{ paddingLeft: '10px' }}>
        <label>{eventLabel}</label><br />
        <div className="comp1" style={{ 'border-style': 'solid', 'border-width': 'thin' }}>
          <textarea autoFocus className="editor-wrapper area-height--textarea"
            defaultValue={this.state.script} ref={this.setScriptEditorTextArea}
          >
          </textarea>
        </div>
      </div>
    );
  }
}

ScriptEditorComponentModal.propTypes = {
  close: PropTypes.func.isRequired,
  event: {
    id: PropTypes.any,
    name: PropTypes.string,
  },
  script: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};

ScriptEditorComponentModal.defaultProps = {
  script: '',
};
