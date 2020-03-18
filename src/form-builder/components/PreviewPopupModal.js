import React from 'react';
import PropTypes from 'prop-types';
import { Container as Container} from 'bahmni-form-controls';
import  'bahmni-form-controls/dist/helpers.js';

export default class PreviewPopupModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        formData: {},
        observations:[],
        records: {}};
    this.save = this.save.bind(this);
    this.formUpdated = this.formUpdated.bind(this);
  }

    save() {
        const metadata = JSON.parse(this.props.formData.resources[0].value);
        const form = {
            component: {
                state: {
                    data: this.state.formData
                },
                props:{
                    patient: undefined
                }
            },
            events: {
                onFormSave: metadata.events.onFormSave
            }
        };
        const temp = runScript(form);
        const obs = getObservations(temp);
        console.log('SAVE RENDERED', temp);
        this.setState({observations:obs});
        this.setState({state: this.state});
        this.setState({records: temp});
        // this.setState({formData: runScript(form)});
    }

    formUpdated(updatedForm, obs) {
        console.log(" for update ", obs);
        this.setState({formData: updatedForm});
        this.setState({observations: obs});
    }

  render() {
      console.log('rendered');
    if (this.props.showPreview && this.props.formData) {
        console.log("rendering ",this.state.observations);
        const metadata = JSON.parse(this.props.formData.resources[0].value);
        metadata.version=this.props.formData.version;
        return (
        <div>
          <div className="dialog preview-container">
            <div>
              <Container
              metadata={metadata}
              collapse={true}
              validate={true}
              translations={undefined}
              observations={this.state.observations}
              patient={undefined}
              validateForm={true}
              valueChanged={this.formUpdated}
              records={this.state.records}
              />
            </div>
            <button className="btn preview-close-btn"
                    onClick={this.props.closePreview}
                    type="reset">
              Close
            </button>
              <button className="success-btn preview-save-btn"
                      onClick={this.save}
                      type="reset">
                  Save
              </button>
          </div>
        </div>
      );
    }
    return null;

  }
}


PreviewPopupModal.propTypes = {
  closePreview: PropTypes.func.isRequired,
  showPreview: PropTypes.bool.isRequired,
  formData: PropTypes.object
};

