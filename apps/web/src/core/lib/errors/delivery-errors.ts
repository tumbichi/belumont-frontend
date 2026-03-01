import { AppError } from './app-error';

export class UserNotFoundError extends AppError {
  constructor(details: { orderId: string; userId: string; paymentId: string }) {
    super(
      'User not found for approved payment',
      'USER_NOT_FOUND',
      404,
      details,
    );
  }
}

export class ProductNotFoundError extends AppError {
  constructor(details: {
    orderId: string;
    productId: string;
    paymentId: string;
  }) {
    super(
      'Product not found for approved payment',
      'PRODUCT_NOT_FOUND',
      404,
      details,
    );
  }
}

export class ProductNoDownloadUrlError extends AppError {
  constructor(details: {
    orderId: string;
    productId: string;
    productName: string;
    paymentId: string;
  }) {
    super(
      'Product does not have a download URL',
      'PRODUCT_NO_DOWNLOAD_URL',
      422,
      details,
    );
  }
}

export class OrderNotFoundForPaymentError extends AppError {
  constructor(details: {
    paymentId: string;
    orderId: string;
    hasPaymentId: boolean;
  }) {
    super(
      'Order not found for approved payment',
      'ORDER_NOT_FOUND_FOR_PAYMENT',
      404,
      details,
    );
  }
}
