import React, { Component, PropTypes } from 'react';
import FormList from 'form-builder/components/FormList.jsx';
import CreateFormModal from 'form-builder/components/CreateFormModal.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import { FormBuilderBreadcrumbs } from 'form-builder/components/FormBuilderBreadcrumbs.jsx';


export default class FormBuilder extends Component {

  constructor() {
    super();
    this.state = { showModal: false, exportDisabled: true};
    this.setState = this.setState.bind(this);
  }

  openFormModal() {
    this.setState({ showModal: true });
  }

  closeFormModal() {
    this.setState({ showModal: false });
  }

  createForm(formName) {
    const form = {
      name: formName,
      version: '1',
      published: false,
    };
    this.props.saveForm(form);
  }

  updateExportStatus(isChecked, index) {
    this.props.data[index].checked = isChecked;
    const checkedItems = this.props.data.filter(item => item.checked);
    this.setState({ exportDisabled: (checkedItems.length <= 0) });
  }

  render() {
    return (
      <div>
        <FormBuilderHeader />
        <div className="breadcrumb-wrap">
          <div className="breadcrumb-inner">
            <div className="fl">
              <FormBuilderBreadcrumbs routes={this.props.routes} />
            </div>
            <button
              accessKey="n" className="btn--highlight fr"
              onClick={() => this.openFormModal()}
            >Create a Form</button>
            <button className="highlight fr" disabled={this.state.exportDisabled}>
              Export
            </button>
          </div>
        </div>
          <CreateFormModal
            closeModal={() => this.closeFormModal()}
            createForm={(formName) => this.createForm(formName)}
            showModal={this.state.showModal}
          />
      <div className="container-content-wrap">
          <div className="container-content">
            <div className="container-main form-list">
              <h2 className="header-title">Observation Forms</h2>
              <FormList data={this.props.data} isChecked={(isChecked, index) => this.updateExportStatus(isChecked, index)}/>
            </div>
          </div>
      </div>
      </div>
    );
  }
}

FormBuilder.propTypes = {
  data: PropTypes.array.isRequired,
  routes: PropTypes.array,
  saveForm: PropTypes.func.isRequired,
};
