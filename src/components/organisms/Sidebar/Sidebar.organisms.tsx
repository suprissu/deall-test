// #region IMPORTS
import Link from "next/link";
import { useRouter } from "next/router";
// #endregion IMPORTS

// #region MAIN COMPONENT
export default function Sidebar() {
  const router = useRouter();
  const { pathname } = router;

  const sidebarList = [
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "Cart",
      path: "/cart",
    },
  ];

  return (
    <nav className="bg-primary-700 text-white font-semibold w-64 h-screen flex flex-col">
      <div className="py-6 flex items-center justify-center cursor-pointer bg-primary-800 hover:bg-primary-900">
        <Link href="/">LOGO</Link>
      </div>
      <div className="flex-1 flex flex-col p-4">
        {sidebarList.map((data, index) => (
          <Link key={index} href={data.path} passHref>
            <div
              className={`px-6 py-4 border-l-4 hover:bg-primary-600 ${
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
    </nav>
  );
}
// #endregion MAIN COMPONENT
