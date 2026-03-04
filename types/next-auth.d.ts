import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: UserRole;
      image?: string;
      userType: "admin" | "cotista";
      cpf?: string;
      phone?: string;
    };
  }

  interface User {
    role?: UserRole;
    userType?: "admin" | "cotista";
    cpf?: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: UserRole;
    userType: "admin" | "cotista";
    cpf?: string;
    phone?: string;
  }
}
