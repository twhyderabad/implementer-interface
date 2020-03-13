import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { JSHINT } from 'jshint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/edit/closebrackets.js';
import ScriptEditorComponentModal from 'form-builder/components/ScriptEditorComponentModal';

window.JSHINT = JSHINT;

export default class FormConditionsModal extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }
  render() {
    // eslint-disable-next-line no-unused-vars
    const controlEvents = {
      values: [
        {
          id: 0,
          name: 'Control Event 1',
        },
        {
          id: 1,
          name: 'Control Event 2',
        },
      ],
    };
    return (
      <div>
        <div className="dialog-wrapper"></div>
        <div className="dialog area-height--dialog script-conditions-editor-container">
          <h2 className="header-title">Form Conditions Modal</h2>
          <div style={{ width: '100%', height: '90%' }}>
            <div className="form-details-1" style={{ width: '50%', float: 'left' }}>
              <br />
              <ScriptEditorComponentModal
                close={this.props.close}
                event={{ name: 'Form Event' }}
                updateScript={this.props.updateScript}
              />
              <br />
              <ScriptEditorComponentModal
                close={this.props.close}
                event={{ name: 'Save Event' }}
                updateScript={this.props.updateScript}
              />
              <br />
            </div>
            <div className="form-details-2" style={{ marginLeft: '50%' }}>
             <br />
             <div>
               <label style={{ width: '20%', float: 'left' }}>Control Events:</label>
               <select style={{ marginLeft: '20%', width: '40%' }}>
                 { controlEvents.values.map((e) => <option key={e.id} >{e.name}</option>)}
               </select>
               <button style={{ float: 'right' }}>Show</button>
             </div><br /><br />
              {
                controlEvents.values.map((e) =>
                  <div>
                    <ScriptEditorComponentModal
                      close={this.props.close}
                      event={e}
                      updateScript={this.props.updateScript}
                    />
                    <br /><br />
                  </div>
                )
              }
            </div>
          </div>
          <div className="script-editor-button-wrapper" >
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

FormConditionsModal.propTypes = {
  close: PropTypes.func.isRequired,
  script: PropTypes.string,
  updateScript: PropTypes.func.isRequired,
};

FormConditionsModal.defaultProps = {
  script: '',
};
