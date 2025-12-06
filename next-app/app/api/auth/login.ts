export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

const backApiKey = process.env.NEXT_PUBLIC_BACK_API_KEY;

export async function login(
  request: LoginRequest
): Promise<LoginResponse | null> {
  try {
    if (!backApiKey) {
      return null;
    }

    const res = await fetch(`${backApiKey}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (data.token && typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
    }

    return { token: data.token };
  } catch (error) {
    return null;
  }
}
