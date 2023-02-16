// #region IMPORTS
import { useSession } from "@/context/Session.context";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { BiLogOut } from "react-icons/bi";
// #endregion IMPORTS

// #region MAIN COMPONENT
export default function Sidebar() {
  const router = useRouter();
  const { pathname } = router;
  const { setSession } = useSession();

  const sidebarList = [
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "Cart",
      path: "/carts",
    },
  ];

  const handleSignOut = useCallback(() => {
    setSession(undefined);
  }, [setSession]);

  return (
    <nav className="bg-primary-700 text-white font-semibold w-64 h-screen flex flex-col">
      <div className="py-6 flex items-center justify-center cursor-pointer bg-primary-800 hover:bg-primary-900">
        <Link href="/">LOGO</Link>
      </div>
      <div className="flex-1 flex flex-col p-4">
        {sidebarList.map((data, index) => (
          <Link key={index} href={data.path} passHref>
            <div
              className={`w-full text-left px-6 py-4 border-l-4 hover:bg-primary-600 ${
                pathname === data.path
                  ? "border-secondary-200"
                  : "border-transparent"
              }`}
            >
              {data.name}
            </div>
          </Link>
        ))}
      </div>
      <button
        className="px-6 py-4 hover:bg-primary-600 flex gap-4 items-center"
        onClick={handleSignOut}
      >
        <BiLogOut className="w-4 h-4" />
        <p>Sign Out</p>
      </button>
    </nav>
  );
}
// #endregion MAIN COMPONENT
