import React from "react";
import Container from "@core/components/layouts/Container";

const Layout = ({ children }: React.PropsWithChildren) => {
  return <Container>{children}</Container>;
};

export default Layout;
