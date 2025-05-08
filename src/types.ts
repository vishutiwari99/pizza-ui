export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  tenant: Tenant | null;
};

export type CreateUserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
  tenantId: number;
};

export interface Tenant {
  id: string;
  name: string;
  address: string;
}

export type FieldsData = {
  name: string[];
  value?: string;
};
