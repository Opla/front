/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import ActionsEditable from "shared/components/actionsEditable";

describe("components/actionsEditable", () => {
  const defaultProps = {
    id: "action-editor-content",
    editable: true,
    content: "* foo *",
    onChange: () => {},
    onSelected: () => {},
    style: {
      overflow: "hidden",
      fontSize: "16px",
      letterSpacing: "0.04em",
      lineHeight: "1",
      color: "#757575",
      margin: "16px",
    },
    selectedItem: -1,
    onFocus: () => {},
    onAction: () => {},
    // placeholder: null,
    // caretPosition: 0
  };

  const testActionIdAndContent = (wrapper, id, length, text) => {
    const selector = `ActionEditable[actionId="${id}"]`;
    expect(wrapper.find(selector)).toHaveLength(length);
    if (text) {
      expect(wrapper.find(selector).props().text).toEqual(text);
    }
  };

  it("renders correctly", () => {
    const wrapper = shallow(<ActionsEditable {...defaultProps} />);
    expect(wrapper.state("items")).toHaveLength(5);
    expect(wrapper.find("#ae_content")).toHaveLength(1);
    testActionIdAndContent(wrapper, "ae_1", 1, "*");
    testActionIdAndContent(wrapper, "ae_2", 1, " foo ");
    testActionIdAndContent(wrapper, "ae_3", 1, "*");
    testActionIdAndContent(wrapper, "ae_4", 1, "");
    testActionIdAndContent(wrapper, "ae_5", 0);
  });

  describe("build()", () => {
    it("should build an intent from html items", () => {
      const items = [
        {
          textContent: "",
          getAttribute: () => "text", // mock function
        },
        {
          textContent: "any",
          getAttribute: () => "any", // mock function
        },
        {
          textContent: " bon gestes ",
          getAttribute: () => "text", // mock function
        },
        {
          textContent: "any",
          getAttribute: () => "any", // mock function
        },
        {
          textContent: "",
          getAttribute: () => "text", // mock function
        },
      ];
      expect(ActionsEditable.build(items, true)).toEqual("* bon gestes *");
    });

    it("should build an intent from html items with entityname", () => {
      const items = [
        {
          textContent: "Vous pouvez ",
          getAttribute: () => "text", // mock function
        },
        {
          textContent: "entityname=value",
          getAttribute: () => "variable", // mock function
        },
      ];
      expect(ActionsEditable.build(items, true)).toEqual(
        "Vous pouvez <<entityname%3Dvalue>>",
      );
    });

    it("should escape special characters like `{`, `}`, `<` and `>`", () => {
      const items = [
        {
          textContent: "any",
          getAttribute: () => "any", // mock function
        },
        {
          textContent: "{{text}}",
          getAttribute: () => "output_var", // mock function
        },
        {
          textContent: "<<var>>",
          getAttribute: () => "variable", // mock function
        },
        {
          getAttribute: () => "br", // mock function
        },
        {
          textContent: "text",
          getAttribute: () => "button", // mock function
        },
        {
          textContent: "text",
          getAttribute: () => "text", // mock function
        },
      ];
      expect(ActionsEditable.build(items, true)).toEqual(
        [
          "*",
          `{{${encodeURIComponent("{{text}}")}}}`,
          `<<${encodeURIComponent("<<var>>")}>>`,
          "<br/><button>text</button>text",
        ].join(""),
      );
    });

    it("should build an intent from items with entityname", () => {
      const items = [
        {
          text: "Vous pouvez ",
          type: "text", // mock function
        },
        {
          text: "entityname%3Dvalue",
          type: "variable", // mock function
        },
      ];
      expect(ActionsEditable.build(items, false)).toEqual(
        "Vous pouvez <<entityname%3Dvalue>>",
      );
    });
  });

  describe("get items length", () => {
    it("should get array size with spacers", () => {
      expect(
        ActionsEditable.getLengthWithSpacer([
          { type: "any", text: "*" },
          { type: "any", text: "*" },
        ]),
      ).toEqual(5);
      expect(
        ActionsEditable.getLengthWithSpacer([
          { type: "any", text: "*" },
          { type: "text", text: "hello" },
          { type: "any", text: "*" },
        ]),
      ).toEqual(5);
      expect(
        ActionsEditable.getLengthWithSpacer([
          { type: "any", text: "*" },
          { type: "text", text: "hello" },
          { type: "any", text: "*" },
        ]),
      ).toEqual(5);

      // with spacers already in place
      expect(
        ActionsEditable.getLengthWithSpacer([
          { type: "text", text: "" },
          { type: "any", text: "*" },
          { type: "text", text: "hello" },
          { type: "any", text: "*" },
          { type: "text", text: "" },
        ]),
      ).toEqual(5);

      // with spacers partialy in place
      expect(
        ActionsEditable.getLengthWithSpacer([
          { type: "text", text: "" },
          { type: "any", text: "*" },
          { type: "text", text: "hello" },
          { type: "any", text: "*" },
        ]),
      ).toEqual(5);
    });

    it("should get items size without spacer", () => {
      expect(
        ActionsEditable.getLengthWithoutSpacer([
          { type: "text", text: "" },
          { type: "any", text: "*" },
          { type: "text", text: "hello" },
          { type: "any", text: "*" },
          { type: "text", text: "" },
        ]),
      ).toEqual(3);
      expect(
        ActionsEditable.getLengthWithoutSpacer([
          { type: "text", text: "" },
          { type: "any", text: "*" },
          { type: "text", text: "hello" },
        ]),
      ).toEqual(2);
      expect(
        ActionsEditable.getLengthWithoutSpacer([
          { type: "text", text: "" },
          { type: "any", text: "*" },
          { type: "text", text: "" },
        ]),
      ).toEqual(1);
    });
  });

  describe("InsertItemsSpacer()", () => {
    it("should insert text item arround non text items", () => {
      const items = [{ type: "any", text: "*" }, { type: "any", text: "*" }];
      const newItems = ActionsEditable.insertItemsSpacer(items);
      expect(newItems).toHaveLength(5);
      expect(newItems).toEqual([
        { type: "text", text: "" },
        { type: "any", text: "*" },
        { type: "text", text: "" },
        { type: "any", text: "*" },
        { type: "text", text: "" },
      ]);
    });
    it("should not insert text item arround text items", () => {
      const items = [
        { type: "text", text: "foo" },
        { type: "undef", text: "undef" },
        { type: "any", text: "*" },
        { type: "text", text: "bar" },
      ];
      const newItems = ActionsEditable.insertItemsSpacer(items);
      expect(newItems).toHaveLength(5);
      expect(newItems).toEqual([
        { type: "text", text: "foo" },
        { type: "undef", text: "undef" },
        { type: "text", text: "" },
        { type: "any", text: "*" },
        { type: "text", text: "bar" },
      ]);
    });
  });

  it("should insert an item", () => {
    const onChangeSpy = jest.fn();
    const wrapper = shallow(
      <ActionsEditable {...defaultProps} onChange={onChangeSpy} />,
    );
    expect(wrapper.state("items")).toHaveLength(5);
    testActionIdAndContent(wrapper, "ae_0", 1, "");
    testActionIdAndContent(wrapper, "ae_1", 1, "*");
    testActionIdAndContent(wrapper, "ae_2", 1, " foo ");
    testActionIdAndContent(wrapper, "ae_3", 1, "*");
    testActionIdAndContent(wrapper, "ae_4", 1, "");
    testActionIdAndContent(wrapper, "ae_5", 0);

    wrapper.instance().insertItem({ text: "*", type: "any" }, 1);
    wrapper.update();
    expect(wrapper.state("items")).toEqual([
      { type: "text", text: "" },
      { type: "any", text: "*" },
      { type: "text", text: "" },
      { type: "any", text: "*" },
      { type: "text", text: " foo " },
      { type: "any", text: "*" },
      { type: "text", text: "" },
    ]);
    expect(onChangeSpy).toHaveBeenCalledWith("** foo *");
    testActionIdAndContent(wrapper, "ae_0", 1, "");
    testActionIdAndContent(wrapper, "ae_1", 1, "*");
    testActionIdAndContent(wrapper, "ae_2", 1, "");
    testActionIdAndContent(wrapper, "ae_3", 1, "*");
    testActionIdAndContent(wrapper, "ae_4", 1, " foo ");
    testActionIdAndContent(wrapper, "ae_5", 1, "*");
    testActionIdAndContent(wrapper, "ae_6", 1, "");
    testActionIdAndContent(wrapper, "ae_7", 0);
  });

  it("should request to move focus after item inserted", () => {
    const wrapper = shallow(<ActionsEditable {...defaultProps} />);
    expect(wrapper.state("items")).toHaveLength(5);
    // result
    // _*foo*_
    // 01 2 34

    wrapper.instance().insertItem({ text: "*", type: "any" }, 2);
    wrapper.update();
    expect(wrapper.state("items")).toEqual([
      { type: "text", text: "" },
      { type: "any", text: "*" },
      { type: "text", text: "" },
      { type: "any", text: "*" },
      { type: "text", text: " foo " },
      { type: "any", text: "*" },
      { type: "text", text: "" },
    ]);
    expect(wrapper.state("itemToFocus")).toEqual(3);
    // result
    // _*_*foo*_
    // 0123 4 56
    //    |

    wrapper.update();
    wrapper.instance().insertItem({ text: "*", type: "any" }, 5);
    wrapper.update();
    expect(wrapper.state("itemToFocus")).toEqual(5);
    // result
    // _*_*foo*_*_
    // 0123 4 5678
    //        |

    wrapper.update();
    wrapper.instance().insertItem({ text: "*", type: "any" }, 8);
    wrapper.update();
    expect(wrapper.state("itemToFocus")).toEqual(9);
    // result
    // _*_*foo*_*_*_
    // 0123 4 5678910
    //            |
  });

  it("should insert an item at beginning", () => {
    const onChangeSpy = jest.fn();
    const wrapper = shallow(
      <ActionsEditable
        {...defaultProps}
        content="* foo"
        onChange={onChangeSpy}
      />,
    );

    expect(wrapper.state("items")).toHaveLength(3);
    testActionIdAndContent(wrapper, "ae_0", 1, "");
    testActionIdAndContent(wrapper, "ae_1", 1, "*");
    testActionIdAndContent(wrapper, "ae_2", 1, " foo");
    testActionIdAndContent(wrapper, "ae_3", 0);

    wrapper.setState({ selectedItem: 0 });
    wrapper.instance().insertItem({ text: "*", type: "any" }, 0);
    wrapper.update();

    expect(onChangeSpy).toHaveBeenCalledWith("** foo");
  });

  it("should insert an item at end", () => {
    const onChangeSpy = jest.fn();
    const wrapper = shallow(
      <ActionsEditable
        {...defaultProps}
        content="* foo *"
        onChange={onChangeSpy}
      />,
    );

    expect(wrapper.state("items")).toHaveLength(5);
    testActionIdAndContent(wrapper, "ae_0", 1, "");
    testActionIdAndContent(wrapper, "ae_1", 1, "*");
    testActionIdAndContent(wrapper, "ae_2", 1, " foo ");
    testActionIdAndContent(wrapper, "ae_3", 1, "*");
    testActionIdAndContent(wrapper, "ae_4", 1, "");
    testActionIdAndContent(wrapper, "ae_5", 0);

    wrapper.setState({ selectedItem: 4 });
    wrapper.instance().insertItem({ text: "*", type: "any" });
    wrapper.update();
    expect(onChangeSpy).toHaveBeenCalledWith("* foo **");
  });

  it("should delete an item", () => {
    const onChangeSpy = jest.fn();
    const wrapper = shallow(
      <ActionsEditable
        {...defaultProps}
        content="* foo **"
        onChange={onChangeSpy}
      />,
    );
    expect(wrapper.state("items")).toHaveLength(7);
    testActionIdAndContent(wrapper, "ae_0", 1, "");
    testActionIdAndContent(wrapper, "ae_1", 1, "*");
    testActionIdAndContent(wrapper, "ae_2", 1, " foo ");
    testActionIdAndContent(wrapper, "ae_3", 1, "*");
    testActionIdAndContent(wrapper, "ae_4", 1, "");
    testActionIdAndContent(wrapper, "ae_5", 1, "*");
    testActionIdAndContent(wrapper, "ae_6", 1, "");
    testActionIdAndContent(wrapper, "ae_7", 0);

    wrapper.instance().deleteItem(5);
    wrapper.update();
    expect(onChangeSpy).toHaveBeenCalled();
    expect(onChangeSpy).toHaveBeenCalledWith("* foo *");
  });

  it("should clear state content on clear()", () => {
    const wrapper = shallow(
      <ActionsEditable {...defaultProps} content={null} isNew />,
    );

    // no content rendered
    expect(wrapper.state("items")).toHaveLength(0);

    // set state to simulate actionsEditable updates
    const state = {
      content: "* bons gestes composteur *",
      items: [
        { type: "any", text: "*" },
        { type: "text", text: " bons gestes composteur " },
        { type: "any", text: "*" },
      ],
      selectedItem: 1,
      caretPosition: 3,
      noUpdate: false,
      startSpan: null,
      endSpan: null,
      itemToFocus: null,
    };
    wrapper.setState(state);

    // after state update, 3 items are rendered
    expect(wrapper.state("items")).toHaveLength(3);
    expect(wrapper.find("#ae_content")).toHaveLength(1);
    testActionIdAndContent(wrapper, "ae_1", 1, " bons gestes composteur ");

    wrapper.instance().clear();
    // after clear no content rendered
    expect(wrapper.state("items")).toHaveLength(0);
  });
});
