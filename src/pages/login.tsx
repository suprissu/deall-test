// #region IMPORTS
// #endregion IMPORTS

import { Button, Input } from "@/components/atoms";
import { MainTemplate } from "@/components/templates";

// #region MAIN COMPONENT
export default function Login() {
  return (
    <MainTemplate title="Login" portal>
      <main className="w-full h-screen bg-info-100 flex items-center justify-center">
        <div className="bg-white w-96 p-4 flex flex-col gap-6">
          <form className="flex flex-col gap-2">
            <Input label="username" />
            <Input label="password" type="password" />
          </form>
          <Button className="w-full">Login</Button>
        </div>
      </main>
    </MainTemplate>
  );
}
// #endregion MAIN COMPONENT
