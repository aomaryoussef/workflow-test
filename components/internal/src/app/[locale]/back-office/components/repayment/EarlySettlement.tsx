// export default EarlySettlement;
import React, { useEffect, useState } from "react";
import type { CollapseProps } from "antd";
import { Collapse, Badge, Button } from "antd";
import PaymentPopup from "./PaymentPopup";
import ConfirmationPopup from "./ConfirmationPopup";
import { useTypedTranslation } from "@/app/common/hooks/useTypedTranslation";

const EarlySettlement = ({ data }) => {
  const [loans, setLoans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const t = useTypedTranslation();

  const text = `
    test Data
  `;
  useEffect(() => {
    // Assuming `data` is defined somewhere in your scope
    setLoans(data);
  }, [data]);

  const handlePayClick = () => {
    setShowModal(true);
  };

  const handleClosePopup = () => {
    setShowModal(false);
    setShowConfirmation(true);
  };

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
            <Button type="primary" style={{ backgroundColor: "green", borderColor: "green" }} onClick={() => setShowModal(true)}>
              {t("general.action")}
            </Button>
            {/* {showModal && <PaymentPopup showModalProp={handlePayClick} onClose={handleClosePopup} paymentType="Monthly"></PaymentPopup>} */}
            {showModal && <PaymentPopup showModalProp={handlePayClick} onClose={handleClosePopup} paymentType="Monthly"></PaymentPopup>}
            {showConfirmation && <ConfirmationPopup></ConfirmationPopup>}
          </div>
        </div>
      ),
      children: <p>{text}</p>,
    },
    {
      key: "2",
      label: "This is panel header 2",
      children: <p>{text}</p>,
    },
    {
      key: "3",
      label: "This is panel header 3",
      children: <p>{text}</p>,
    },
  ];
  return (
    <div>
      <Collapse>
        {items.map((item, index) => (
          <Collapse.Panel header={item.label} key={index}>
            {item.children}
          </Collapse.Panel>
        ))}
      </Collapse>
      {/* <Button onClick={handlePayClick}>Pay</Button> */}
    </div>
  );
};

export default EarlySettlement;
