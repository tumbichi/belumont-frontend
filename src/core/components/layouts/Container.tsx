import React from "react";

const Container = ({ children }: React.PropsWithChildren) => {
  return <div className="container px-4 mx-auto md:px-6 lg:px-8">{children}</div>;
};

export default Container;
