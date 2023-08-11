import React from "react";
import { colors, data } from "../../constants";
import { useFireStore } from "../../hooks";
import { collections } from "../../firebase/collections";

const Card = () => {
  const { data: users, dataCount } = useFireStore(collections.users);
  const { dataCount: productCount } = useFireStore(collections.products);
  const { dataCount: listingCount } = useFireStore(collections.listing);

  const dataCounts = {
    users: dataCount,
    orders: users?.flat()?.length,
    products: productCount,
    listing: listingCount,
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {data?.overall?.map((item, index) => (
        <div
          key={index}
          style={{
            height: 200,
            width: 200,
            backgroundColor: colors.primary,
            margin: 10,
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: 34, marginBottom: 10 }}>{dataCounts[item.key]}</h2>
          <span style={{ fontSize: 16 }}>{item.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Card;
