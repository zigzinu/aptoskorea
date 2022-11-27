import { NextPage } from "next";
import { useRouter } from "next/router";
import Footer from "./Footer";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

type LayoutProps = {
  children: React.ReactNode; // 👈️ type children
};

const Layout: NextPage<LayoutProps> = (props) => {
  const router = useRouter();
  return (
    <>
      <NavBar />
      <div className="flex">

        { router.pathname.startsWith("/docs") ? <SideBar /> : <></> }
        <main className="flex-1 mx-auto max-w-7xl w-64 pt-28 p-10 overflow-hidden">{props.children}</main>
      </div>
      <div className="z-40">
        <Footer />
      </div>
    </>
  );
};

export default Layout;
