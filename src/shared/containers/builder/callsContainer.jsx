/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Explorer from "../../components/explorer";

class CallsContainer extends Component {
  handleSelect = () => {
    // TODO
  };

  render() {
    const items = this.props.calls;
    return (
      <Explorer
        items={items}
        name="Calls"
        icon="/"
        selectedBotId={this.props.selectedBotId}
        selectedItemIndex={this.props.selectedCallIndex}
        onSelect={this.handleSelect}
      />
    );
  }
}

CallsContainer.defaultProps = {
  calls: [],
  selectedCallIndex: 0,
  selectedBotId: null,
};

CallsContainer.propTypes = {
  selectedBotId: PropTypes.string,
  calls: PropTypes.arrayOf(PropTypes.shape({})),
  selectedCallIndex: PropTypes.number,
};

const mapStateToProps = (state) => {
  const selectedEntityIndex = state.app ? state.app.selectedEntityIndex : 0;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const entities = state.app.entities ? state.app.entities : null;
  const { admin } = state.app;
  const bot = admin ? admin.bots[0] : null;

  return {
    entities,
    selectedEntityIndex,
    selectedBotId,
    bot,
  };
};

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(CallsContainer);