import React from "react";
import { colors, data } from "../../constants";
import { useFireStore } from "../../hooks";
import { collections } from "../../firebase/collections";

const Card = () => {
  const { data: users, dataCount } = useFireStore(collections.users);
  const { dataCount: productCount } = useFireStore(collections.products);
  const { dataCount: listingCount } = useFireStore(collections.orders);
  const { dataCount: companyCount } = useFireStore(collections.CompanyName);




  const dataCounts = {
    users: dataCount,
    orders: listingCount || 0,
    products: productCount || 0,
    listing: companyCount,
  };
  console.log(dataCounts)

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {data?.overall?.map((item, index) => (
        <div
          key={index}
          style={{
            height: 120,
            width: 240,
            backgroundColor: index == 0 ? colors.purple: colors.white ,
            margin: 10,
            borderRadius: 10,
            padding: 20,
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ fontSize: 16, color: index !== 0 ? 'rgb(153 153 153)' : colors.white}}>{item.title}</p>
          <div style={{display:"flex",flexDirection:"row",alignItems:"baseline",justifyContent:"space-between"}}>
            <h1
              style={{
                fontSize: 38,
                marginBottom: 10,
                color:index !== 0 ? colors.black: colors.white,
                fontWeight: 500,
              }}
            >
              {dataCounts[item.key]}
            </h1>
            <p style={{color:'rgb(20,207,151)'}}>+8%</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
