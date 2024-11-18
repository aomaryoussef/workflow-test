import { Button, Collapse, Divider } from "antd";
import { useLocale } from "next-intl";
import React, { useEffect, useState } from "react";

import { useTypedTranslation } from "@/app/common/hooks/useTypedTranslation";

import { LoanDetails as Loans } from "../../private/repay/types";
import ConfirmationPopup from "./ConfirmationPopup";
import PaymentPopup from "./PaymentPopup";
import PayPopup from "./PayPopup";

const LoanDetails = ({ data }: { data: Loans[] }) => {
  const [loans, setLoans] = useState<Loans[]>([]);
  const [showModalIndex, setShowModalIndex] = useState<null | number>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loans>(data[0]);

  const t = useTypedTranslation();
  useEffect(() => {
    setLoans(data);
  }, [data]);

  // const handlePayClick = () => {
  //   setShowModalIn(true);
  // };

  const handleClosePopup = () => {
    setShowModalIndex(null);
  };

  const lang = useLocale();

  function groupLoanSchedulesByDueDate(loanSchedules: Loans[]) {
    if (Array.isArray(loanSchedules)) {
      return loanSchedules.reduce(
        (acc, item) => {
          const dueDate = item.dueDate;

          // Check if there is already a group for this due_date
          const existingGroup = acc.find((group) => group.dueDate === dueDate);
          if (existingGroup) {
            // If the group exists, push the current item to that group
            existingGroup.items.push(item);
            // Update the total principal
            existingGroup.totalPrincipal += item.duePrincipal + item.dueInterest;
          } else {
            // If not, create a new group
            acc.push({
              dueDate: dueDate,
              items: [item],
              totalPrincipal: item.duePrincipal + item.dueInterest, // Initialize total principal with current item's principal
            });
          }

          return acc;
        },
        [] as { dueDate: string; items: Loans[]; totalPrincipal: number }[]
      );
    } else {
      return [];
    }
  }

  const formatNumberWithCommas = (number: string | number) => {
    const roundNumber = Math.round(parseFloat(number.toString()) / 100);
    return roundNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const translateNumbers = (number: string, lang: string) => {
    if (lang === "ar") {
      return number.toString().replace(/\d/g, (digit: string) => "٠١٢٣٤٥٦٧٨٩"[parseInt(digit)]);
    } else {
      return number;
    }
  };

  const duePrincipalCalculation = (
    duePrincipal: string | number,
    dueInterest: string | number,
    dueLateFee: string | number,
    lang: string
  ) => {
    const totalNumber = Math.round(
      (parseFloat(duePrincipal.toString()) + parseFloat(dueInterest.toString()) + parseFloat(dueLateFee.toString())) /
        100
    );
    const formattedPrincipal = new Intl.NumberFormat("en-US").format(totalNumber);
    if (lang === "ar") {
      return formattedPrincipal.replace(/\d/g, (digit: string) => "٠١٢٣٤٥٦٧٨٩"[parseInt(digit)]);
    } else {
      return formattedPrincipal;
    }
  };

  const checkInstallementName = (count: number, lang: string): string => {
    if (lang === "ar") {
      if (count === 1) {
        return "قسط";
      } else if (count >= 2 && count <= 10) {
        return "أقساط";
      } else {
        return "قسط";
      }
    } else {
      if (count === 1) {
        return "installement";
      } else {
        return "installements";
      }
    }
  };
  const groupedSchedules = groupLoanSchedulesByDueDate(loans);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (lang == "ar") {
      return new Intl.DateTimeFormat("ar-EG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    } else {
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    }
  };

  const items = groupedSchedules.map((loan, index) => ({
    key: index.toString(),
    label: (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ flex: 1, fontSize: "20px", fontWeight: "bold" }}>
          {lang == "en" ? "installement" : "قسط"} {formatDate(loan.dueDate)}
        </span>
        <span style={{ flex: 1, textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
          {translateNumbers(formatNumberWithCommas(loan?.totalPrincipal), lang)} {lang == "en" ? "EGP" : "جنيه"}
          <span style={{ fontSize: "14px" }}>
            {" "}
            ({translateNumbers(loan.items.length.toString(), lang)} {checkInstallementName(loan.items.length, lang)})
          </span>
          {/* <span style={{ display:"block",fontSize:"14px",color:"red"}}> تتضمن غرامة ضرر بقيمة ٧٢٥ جنيه</span> */}
        </span>
        <span style={{ flex: 1, textAlign: "center" }}>
          <Button
            type="primary"
            onClick={() => setShowModalIndex(index)}
            style={
              index !== 0
                ? { padding: "15px 40px", backgroundColor: "#eee", borderColor: "grey", color: "grey", opacity: ".5" }
                : { padding: "15px 40px", backgroundColor: "green", borderColor: "green", color: "white" }
            }
            disabled={index !== 0}
          >
            {t("repay.pay")}
          </Button>
          {showModalIndex === index && (
            <PayPopup
              visible={showModalIndex === index}
              onClose={handleClosePopup}
              loan={loan.items}
              totalPrincipal={translateNumbers(formatNumberWithCommas(loan?.totalPrincipal), lang)}
              // paymentType="Monthly"
            ></PayPopup>
          )}
          {showConfirmation && <ConfirmationPopup successProp={false}></ConfirmationPopup>}
        </span>
      </div>
    ),
    children: loan.items.map((item, itemIndex) => (
      <div key={item.id}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          <div style={{ flex: 1, marginLeft: "22px", marginRight: "22px" }}>
            <span>{item.loan.partner.name}</span>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span>
              {duePrincipalCalculation(item.duePrincipal, item.dueInterest, item.dueLateFee, lang)}{" "}
              {lang == "en" ? "EGP" : "جنيه"}
            </span>
          </div>
        </div>
        {itemIndex < loan.items.length - 1 && <Divider />}
      </div>
    )),
  }));

  return <Collapse items={items} />;
};

export default LoanDetails;
