import type { CollapseProps } from "antd";
import { Button, Collapse } from "antd";
import React from "react";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div>Date</div>
          <span>Additional text</span>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div>2000 LE</div>
          <span>Additional text</span>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <Button type="primary" style={{ backgroundColor: "green", borderColor: "green" }}>
            Action
          </Button>
        </div>
      </div>
    ),
    children: <p>{text}</p>,
  },
];

const PaymentHistory = () => {
  return <Collapse accordion items={items} />;
};

export default PaymentHistory;
