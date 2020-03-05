import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'bahmni-form-controls';

export default class PreviewPopupModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = { close: false };
    this.closeDialog = this.closeDialog.bind(this);
    const metadata = {controls : [], id :{}, uuid : {}, name : {}, version :{}}
  }

  closeDialog() {
    this.props.closeModal();
  }


  render() {
    console.log('PreviewPopupModal', this.state);
    if (this.props.showModal) {
      return (

        <div>

          <div className="dialog-wrapper"></div>
          <div className="dialog area-height--dialog script-editor-container">
            <h1>abcd</h1>
            <div>
              <Container collapse={false}
                         locale="en"
                         metadata={this.props.formData}
                         observations={[]}

              />
            </div>
            <button className="btn"
                    onClick={this.props.closeModal}
                    type="reset"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }
    return null;

  }
}


PreviewPopupModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  formData: PropTypes.object
};

