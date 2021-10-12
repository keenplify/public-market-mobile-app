export interface User {
  createdAt: string;
  email: string;
  gender: "MALE" | "FEMALE";
  id: number;
  number: string;
  password: string;
  type: "ADMIN" | "CUSTOMER" | "SELLER";
  updatedAt: string;
  username: string;
}

export interface Product {
  id: number;
  name: string;
  sellerId: number;
  description: string;
  price: string;
  ratings: Rating[];
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: number;
  url: string;
  thumbUrl: string;
  product?: Product;
  productId?: number;
  owner?: User;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: number;
  text: string;
  user?: User;
  userId: number;
  product?: Product;
  productId: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
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
