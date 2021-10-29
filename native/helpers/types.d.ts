enum OrderStatuses {
  "PREPAIRING",
  "TO_DELIVER",
  "DELIVERING",
  "DELIVERED",
}

export interface IAudit {
  createdAt?: string;
  updatedAt?: string;
}

export interface User extends IAudit {
  email: string;
  gender: "MALE" | "FEMALE";
  id: number;
  number: string;
  password: string;
  type: "ADMIN" | "CUSTOMER" | "SELLER";
  username: string;
  address?: Address;
  messagesMade: Message[];
  messagesReceived: Message[];
}

export interface Product extends IAudit {
  id: number;
  name?: string;
  sellerId?: number;
  description?: string;
  price?: number;
  ratings?: Rating[];
  images?: Image[];
  seller?: User;
}

export interface Address extends IAudit {
  id: number;
  name: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  postalCode: string;
  house: string;
  user?: User;
  userId: number;
}

export interface CartItem extends IAudit {
  id: number;
  quantity: number;
  product: Product;
  productId: number;
  customer: User;
  customerId: number;
  order: Order;
  orderId: number;
}

export interface Order extends IAudit {
  id: number;
  customer?: User;
  customerId: number;
  subOrders: SubOrder[];
  modeOfPayment: string;
}

export interface SubOrder extends IAudit {
  id: number;
  product?: Product;
  seller?: User;
  quantity: number;
  order?: Order;
  status:
    | "PREPAIRING"
    | "TO_DELIVER"
    | "DELIVERING"
    | "DELIVERED"
    | "DECLINED"
    | "CANCELLED";
}

export interface Order extends IAudit {
  id: number;
  customer: User;
  customerId: number;
  cartItems: CartItem[];
}

export interface Image extends IAudit {
  id: number;
  url: string;
  thumbUrl: string;
  product?: Product;
  productId?: number;
  owner?: User;
  ownerId: number;
}

export interface Rating extends IAudit {
  id: number;
  text: string;
  user?: User;
  userId: number;
  product?: Product;
  productId: number;
  rating: number;
  images?: Image[];
}

export interface IImgBBUpload {
  data: {
    id: string;
    url_viewer: string;
    url: string;
    display_url: string;
    title: string;
    time: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
      size: number;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
      size: number;
    };
    delete_url: string;
  };
  success: boolean;
  status: number | 200;
}

export interface Message extends IAudit {
  id: number;
  message: string;
  image?: Image[];
  from?: User;
  fromId?: number;
  to?: User;
  toId?: number;
}

export interface MessageReport {
  message: string;
}

export interface Notification extends IAudit {
  id: number;
  description: string;
  title: string;
  type: "ORDER_STATUS_UPDATE" | "NEW_ORDER" | "MESSAGE" | "REVIEW";
  read: boolean;
  urgent: boolean;
  url?: string;
  user?: User;
  userId: number;
  referencedId: number;
}

enum NotificationTypes {
  "ORDER_STATUS_UPDATE",
  "NEW_ORDER",
  "MESSAGE",
  "REVIEW",
}
