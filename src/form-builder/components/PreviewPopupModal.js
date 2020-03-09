import React from 'react';
import PropTypes from 'prop-types';
import { Container as Container} from 'bahmni-form-controls';

export default class PreviewPopupModal extends React.Component {

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
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
              observations={[]}
              patient={undefined}
              validateForm={false}
              />
            </div>
            <button className="btn preview-close-btn"
                    onClick={this.props.closePreview}
                    type="reset">
              Close
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

