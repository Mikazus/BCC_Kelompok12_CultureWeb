export type UserRole = "user" | "promotor";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  role?: UserRole;
  gender: "male" | "female";
};

export type RegisterResponse = {
  message?: string;
  data?: unknown;
  [key: string]: unknown;
};

export type RegisterResult = {
  status: number;
  raw: RegisterResponse;
  message: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message?: string;
  data?: unknown;
  token?: string;
  access_token?: string;
  accessToken?: string;
  jwt?: string;
  [key: string]: unknown;
};

export type LoginResult = {
  token: string;
  raw: LoginResponse;
};

export type MeResponse = {
  data?: unknown;
  user?: unknown;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

export type MeResult = {
  name: string;
  email: string;
  role: UserRole | null;
  raw: MeResponse;
};
