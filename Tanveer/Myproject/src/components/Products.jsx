import React from "react";

const data = [
  { id: 1, name: "Product 1", price: "$20" },
  { id: 2, name: "Product 2", price: "$30" },
  { id: 3, name: "Product 3", price: "$40" },
  { id: 4, name: "Product 4", price: "$50" },
];

function Products() {
  return (
    <section className="products">
      {data.map((item) => (
        <div className="card" key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.price}</p>
          <button className="btn">Add to Cart</button>
        </div>
      ))}
    </section>
  );
}

export default Products;
