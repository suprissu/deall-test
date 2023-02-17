// #region IMPORTS
import React, { useState } from "react";
import { useCallback } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button, Input } from "@/components/atoms";
import { MainTemplate } from "@/components/templates";
import { LoginParams, LoginResponse } from "@/domains/Types.domains";
import axios, { AxiosError } from "axios";
import { Endpoints } from "@/domains/Endpoints.domains";
import { useSession } from "@/context/Session.context";
// #endregion IMPORTS

const defaultUser = {
  username: "atuny0",
  password: "9uQFF1Lh",
};

// #region MAIN COMPONENT
export default function Login() {
  const { setSession } = useSession();
  const [isLoading, setLoading] = useState(false);

  const handleLogin: SubmitHandler<FieldValues> = useCallback(
    (value) => {
      const params = value as LoginParams;
      setLoading(true);
      axios
        .post(Endpoints.AUTH_LOGIN, params)
        .then(({ data }: { data: LoginResponse }) => {
          setSession(data);
        })
        .catch((e: AxiosError) => {
          if (e.response?.status === 400) {
            alert("Username or Password is not correct. Please try again!");
          }
          setLoading(false);
        });
    },
    [setSession]
  );

  const { register, handleSubmit } = useForm({
    defaultValues: defaultUser,
  });

  return (
    <MainTemplate title="Login" portal>
      <main className="w-full h-screen bg-info-100 flex items-center justify-center">
        <div className="bg-white w-96 p-4">
          <p className="text-info-400 text-sm text-center">
            you can use any account from user json in data folder or this api:{" "}
            <a
              href="https://dummyjson.com/users"
              target="_blank"
              rel="noreferrer"
              className="text-black hover:text-primary-500"
            >
              https://dummyjson.com/users.
            </a>
          </p>
          <p className="text-warning-600 text-sm text-center">
            Check role code in data folder!
          </p>
          <form
            className="flex flex-col gap-2 mt-4"
            onSubmit={handleSubmit(handleLogin)}
          >
            <Input
              label="username"
              {...register("username")}
              autoComplete="on"
            />
            <Input label="password" type="password" {...register("password")} />
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </div>
      </main>
    </MainTemplate>
  );
}
// #endregion MAIN COMPONENT
