// #region IMPORTS
import Menu from "@/config/Menu";
import { useSession } from "@/context/Session.context";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { BiLogOut } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { useToggle, useWindowSize } from "usehooks-ts";
import RoleCode from "@/data/RoleCode.data";
import { Role } from "@/domains/Types.domains";
// #endregion IMPORTS

// #region PROPS
const sidebarList = Object.values(Menu.sidebar);
// #endregion PROPS

// #region MAIN COMPONENT
export default function Sidebar() {
  const router = useRouter();
  const { pathname } = router;
  const { session, setSession } = useSession();
  const { width } = useWindowSize();
  const isTablet = width < 840;
  const [isCollapse, toggleCollapse] = useToggle(false);

  const userRoleCode = useMemo(
    () => (session ? RoleCode[session?.username] : Role.GUEST),
    [session]
  );

  const handleSignOut = useCallback(() => {
    setSession(undefined);
  }, [setSession]);

  if (isTablet)
    return (
      <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 w-5/6 z-[2] bg-white rounded-xl shadow-xl flex items-center justify-evenly">
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
    <nav
      className={`bg-primary-700 text-white font-semibold h-screen flex flex-col ${
        isCollapse ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-center cursor-pointer">
        {!isCollapse && (
          <Link href="/" className="flex-1 p-6 hover:bg-primary-800">
            LOGO
          </Link>
        )}
        <button onClick={toggleCollapse}>
          <RxHamburgerMenu className="w-16 h-16 py-4 px-6" />
        </button>
      </div>
      <div className={`flex-1 flex flex-col ${!isCollapse && "p-4"}`}>
        {sidebarList.map((data, index) =>
          data.access.has(userRoleCode) ? (
            <Link key={index} href={data.path} passHref>
              <div
                className={`w-full text-left px-6 py-4 border-l-4 hover:bg-primary-600 ${
                  pathname === data.path
                    ? "border-secondary-200 text-white"
                    : "border-transparent text-info-200"
                }`}
              >
                {isCollapse ? data.icon : data.name}
              </div>
            </Link>
          ) : null
        )}
      </div>
      <button
        className="px-6 py-4 bg-primary-600 hover:bg-primary-500 flex gap-4 items-center"
        onClick={handleSignOut}
      >
        <BiLogOut className="w-6 h-6" />
        {!isCollapse && <p>Sign Out</p>}
      </button>
    </nav>
  );
}
// #endregion MAIN COMPONENT
