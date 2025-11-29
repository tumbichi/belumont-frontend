import React from 'react';

interface ProductsPageLayoutProps {
  children: {
    header: React.ReactNode;
    content: React.ReactNode;
  };
}

function ProductsPageLayout({ children }: ProductsPageLayoutProps) {
  return (
    <div>
      {children.header}
      {children.content}
    </div>
  );
}

export default ProductsPageLayout;
