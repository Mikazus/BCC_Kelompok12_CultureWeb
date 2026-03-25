import api from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  LoginResult,
  MeResponse,
  MeResult,
  RegisterRequest,
  RegisterResponse,
  RegisterResult,
} from "@/types/api/auth";

const LOGIN_ENDPOINT = "/auth/login";
const ME_ENDPOINT = "/me";
const LOGOUT_ENDPOINT = "/auth/logout";

const extractToken = (response: LoginResponse) => {
  const fromTopLevel = response.token || response.access_token || response.accessToken || response.jwt;
  if (typeof fromTopLevel === "string" && fromTopLevel) {
    return fromTopLevel;
  }

  if (typeof response.data === "object" && response.data !== null) {
    const fromData =
      ("token" in response.data && typeof response.data.token === "string" && response.data.token) ||
      ("access_token" in response.data &&
        typeof response.data.access_token === "string" &&
        response.data.access_token) ||
      ("accessToken" in response.data &&
        typeof response.data.accessToken === "string" &&
        response.data.accessToken) ||
      ("jwt" in response.data && typeof response.data.jwt === "string" && response.data.jwt);

    if (fromData) {
      return fromData;
    }
  }

  return null;
};

export const registerUser = async (data: RegisterRequest) => {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    password_confirmation: data.confirmPassword,
    phone: data.phone,
    role: data.role || "user",
    gender: data.gender,
  };

  const res = await api.post<RegisterResponse>("/auth/register", payload);

  if (res.status !== 201) {
    throw new Error("Register gagal: server tidak mengembalikan status 201.");
  }

  const result: RegisterResult = {
    status: res.status,
    raw: res.data,
    message: typeof res.data.message === "string" && res.data.message ? res.data.message : "Akun berhasil dibuat.",
  };

  return result;
};

export const loginUser = async (data: LoginRequest) => {
  const res = await api.post<LoginResponse>(LOGIN_ENDPOINT, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const token = extractToken(res.data);

  if (!token) {
    throw new Error("Login berhasil tetapi token tidak ditemukan pada response.");
  }

  const result: LoginResult = {
    token,
    raw: res.data,
  };

  return result;
};

const extractUserProfile = (response: MeResponse) => {
  const userObject =
    (typeof response.user === "object" && response.user !== null && response.user) ||
    (typeof response.data === "object" && response.data !== null && response.data) ||
    response;

  const name =
    ("name" in userObject && typeof userObject.name === "string" && userObject.name.trim()) ||
    ("full_name" in userObject && typeof userObject.full_name === "string" && userObject.full_name.trim()) ||
    "Pengguna";

  const email =
    ("email" in userObject && typeof userObject.email === "string" && userObject.email.trim()) ||
    "";

  return {
    name,
    email,
  };
};

export const getMe = async (token: string) => {
  const res = await api.get<MeResponse>(ME_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const profile = extractUserProfile(res.data);

  const result: MeResult = {
    name: profile.name,
    email: profile.email,
    raw: res.data,
  };

  return result;
};

export const logoutUser = async (token: string) => {
  await api.post(
    LOGOUT_ENDPOINT,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};