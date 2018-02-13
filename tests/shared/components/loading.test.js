import React from 'react';
import renderer from 'react-test-renderer';
import Loading from 'OplaLibs/components/loading';

describe('Loading', () => {
  it('renders correctly', () => {
    const component = renderer.create(<Loading />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
