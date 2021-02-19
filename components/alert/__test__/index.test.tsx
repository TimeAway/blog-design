import React from 'react';
import { mount } from 'enzyme';
import Alert from '..';

describe('Alert', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('could be closed', () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <Alert
        message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
        type="warning"
        closable
        onClose={onClose}
      />,
    );
    wrapper.find('.ant-alert-close-icon').simulate('click');
    jest.runAllTimers();
    expect(onClose).toHaveBeenCalled();
  });
});
