import { cookies } from "next/headers";
import path from "path";

const API_URL = process.env.QUEUE_URL!;

export class API {
  static async get<T>(
    input: string,
    init?: RequestInit
  ): Promise<T | undefined> {
    try {
      const response = await fetch(path.join(API_URL, input), {
        ...init,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${cookies().get("token")?.value}`,
          ...init?.headers,
        },
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  static async post<T>(input: string, init?: RequestInit): Promise<T> {
    try {
      const response = await fetch(path.join(API_URL, input), {
        ...init,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${cookies().get("token")?.value}`,
          ...init?.headers,
        },
      });

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async put<T>(input: string, init?: RequestInit): Promise<T> {
    try {
      const response = await fetch(path.join(API_URL, input), {
        ...init,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${cookies().get("token")?.value}`,
          ...init?.headers,
        },
      });

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async delete<T>(input: string, init?: RequestInit): Promise<T> {
    try {
      const response = await fetch(path.join(API_URL, input), {
        ...init,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${cookies().get("token")?.value}`,
          ...init?.headers,
        },
      });

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
