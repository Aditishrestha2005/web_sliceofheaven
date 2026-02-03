"use server";

import { register, login, whoami, updateProfile } from "../api/auth";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookies";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const handleRegister = async (formData: any) => {
  try {
    const result = await register(formData);
    if (result) {
      return { success: true, message: "Registration successful", data: result.data };
    }
    return { success: false, message: result.message || "Registration failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Registration failed" };
  }
};

export const handleLogin = async (formData: any) => {
  try {
    const result = await login(formData);
    if (result) {
      await setAuthToken(result.token);
      await setUserData(result.data);
      return { success: true, message: "Login successful", data: result.data };
    }
    return { success: false, message: result.message || "Login failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Login failed" };
  }
};

export const handleWhoAmI = async () => {
  try {
    const result = await whoami({});
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "failed to fetch data" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "failed to fetch data" };
  }
};

export const handleUpdateProfile = async (formData: any) => {
  try {
    const result = await updateProfile(formData);
    if (result.success) {
      await setUserData(result.data);
      revalidatePath("/user/profile");
      return {
        success: true,
        message: "Profile updated successfully",
        data: result.data,
      };
    }
    return { success: false, message: result.message || "Failed to update profile" };
  } catch (err: Error | any) {
    return { success: false, message: err.message || "Failed to update profile" };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  redirect("/login");
};