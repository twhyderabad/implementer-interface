import React from 'react';
import PropTypes from 'prop-types';
import { Container as Container} from 'bahmni-form-controls';
import  'bahmni-form-controls/dist/helpers.js';

export default class PreviewPopupModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        formData: {},
        observations:{observations: []}};
    this.save = this.save.bind(this);
    this.updateForm = this.updateForm.bind(this);
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
        this.setState({formData: runScript(this.state.formData)});
    }

    updateForm(updatedForm, obs) {
        this.setState({formData: updatedForm});
        this.setState({observations: obs});
    }

  render() {
    if (this.props.showPreview && this.props.formData) {
        const metadata = JSON.parse(this.props.formData.resources[0].value);
        metadata.version=this.props.formData.version;
        return (
        <div>
          <div className="dialog preview-container">
            <div>
              <Container
              metadata={metadata}
              collapse={false}
              validate={false}
              translations={undefined}
              observations={this.state.observations.observations}
              patient={undefined}
              validateForm={false}
              updateForm={this.updateForm}
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

