import React from 'react'
import transaction from "../../assets/transactions.svg";
function noTransaction() {
    return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexDirection: "column",
            marginBottom: "2rem",
          }}
        >
          <img src={transaction} style={{ width: "400px", margin: "4rem" }} />
          <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
            You Have No Transactions Currently
          </p>
        </div>
      );
}

export default noTransaction;