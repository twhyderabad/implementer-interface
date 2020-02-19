import React from 'react';
import { IntlProvider, createIntl } from 'react-intl';
const Adapter = require('enzyme-adapter-react-16');
const enzyme = require('enzyme');
enzyme.configure({ adapter: new Adapter() });
const { shallow, mount } = enzyme;

const messages = {  }; // en.json

const intl = createIntl({ locale: 'en', messages });


function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

const defaultLocale = 'en';
const locale = defaultLocale;

export function mountWithIntl(node) {
  return mount(nodeWithIntlProp(node), {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages,
    },
    context: { intl },
  });
}

export function shallowWithIntl(node) {
  return shallow(nodeWithIntlProp(node), {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages,
    },
    context: { intl },
  });
}
