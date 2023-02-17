// #region IMPORTS
import { useSession } from "@/context/Session.context";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { AiOutlineShoppingCart, AiTwotoneShop } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { useScreen, useWindowSize } from "usehooks-ts";
// #endregion IMPORTS

// #region MAIN COMPONENT
export default function Sidebar() {
  const router = useRouter();
  const { pathname } = router;
  const { setSession } = useSession();
  const { width } = useWindowSize();
  const isTablet = width < 840;

  const sidebarList = [
    {
      name: "Products",
      path: "/products",
      icon: <AiTwotoneShop className="w-6 h-6" />,
    },
    {
      name: "Cart",
      path: "/carts",
      icon: <AiOutlineShoppingCart className="w-6 h-6" />,
    },
  ];

  const handleSignOut = useCallback(() => {
    setSession(undefined);
  }, [setSession]);

  if (isTablet)
    return (
      <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 w-5/6 z-index-[2] bg-white rounded-xl shadow-xl flex items-center justify-evenly">
        {sidebarList.map((data, index) => (
          <Link
            className="flex-1 flex items-center justify-center"
            key={index}
            href={data.path}
            passHref
          >
            <div
              className={`py-4 flex flex-col items-center gap-2 ${
                pathname === data.path && "text-primary-500"
              }`}
            >
              {data.icon}
              <p className="text-xs">{data.name}</p>
            </div>
          </Link>
        ))}
        <button
          className="flex-1 flex items-center justify-center"
          onClick={handleSignOut}
        >
          <div className={`py-4 flex flex-col items-center gap-2`}>
            <BiLogOut className="w-6 h-6 text-error-500" />
            <p className="text-xs">Sign Out</p>
          </div>
        </button>
      </nav>
    );

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
        className="px-6 py-4 bg-primary-600 hover:bg-primary-500 flex gap-4 items-center"
        onClick={handleSignOut}
      >
        <BiLogOut className="w-4 h-4" />
        <p>Sign Out</p>
      </button>
    </nav>
  );
}
// #endregion MAIN COMPONENT
