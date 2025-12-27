/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance";

export const addEmployee = async (data: any) => {
  try {
    console.log(data);

    const res = await axiosInstance.post("/employees/add", data);

    toast.success("Employee Added successfully!");
    return res;
  } catch (error) {
    //@ts-ignore
    toast.error(error.response.data.message);
    return error;
  }
};

export const listEmployee = async () => {
  try {
    const res = await axiosInstance.get("/employees");
    toast.success("Employee list successfully");
    return res;
  } catch (e) {
    //@ts-ignore
    toast.error(e.response.data.message);
    return e;
  }
};

export const getGovernmentEntity = async () => {
  try {
    const res = await axiosInstance.get("/governmentEntites");
    toast.success("GovernmentEntity list successfully");
    return res;
  } catch (e) {
    //@ts-ignore
    toast.error(e.response.data.message);
    return e;
  }
};

export const addGovernmentEntity = async (data: any) => {
  try {
    const res = await axiosInstance.post("/governmentEntites", data);
    toast.success("GovernmentEntity Added successfully");
    return res;
  } catch (e) {
    //@ts-ignore
    toast.error(e.response.data.message);
    return e;
  }
};
