// #region IMPORTS
import React from "react";
import { useCallback } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button, Input } from "@/components/atoms";
import { MainTemplate } from "@/components/templates";
import { LoginParams, LoginResponse } from "@/domains/Types.domains";
import axios, { AxiosError } from "axios";
import { Endpoints } from "@/domains/Endpoints.domains";
// #endregion IMPORTS

// #region MAIN COMPONENT
export default function Login() {
  const handleLogin: SubmitHandler<FieldValues> = useCallback((value) => {
    const params = value as LoginParams;
    axios
      .post(Endpoints.AUTH_LOGIN, params)
      .then(({ data }: { data: LoginResponse }) => {
        // TODO: STORE LOGIN DATA TO STORAGE
      })
      .catch((e: AxiosError) => {
        if (e.response?.status === 400) {
          alert("Username or Password is not correct. Please try again!");
        }
      });
  }, []);

  const { register, handleSubmit } = useForm();

  return (
    <MainTemplate title="Login" portal>
      <main className="w-full h-screen bg-info-100 flex items-center justify-center">
        <div className="bg-white w-96 p-4">
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(handleLogin)}
          >
            <Input label="username" {...register("username")} />
            <Input label="password" type="password" {...register("password")} />
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>
        </div>
      </main>
    </MainTemplate>
  );
}
// #endregion MAIN COMPONENT
