// #region IMPORTS
// #endregion IMPORTS

import { Button, Input } from "@/components/atoms";
import { MainTemplate } from "@/components/templates";

// #region MAIN COMPONENT
export default function Login() {
  return (
    <MainTemplate title="Login">
      <main className="w-full h-screen bg-info-100 flex items-center justify-center">
        <div className="bg-white w-96 p-4">
          <form>
            <Input />
            <Input />
          </form>
          <Button className="w-full">Login</Button>
        </div>
      </main>
    </MainTemplate>
  );
}
// #endregion MAIN COMPONENT
