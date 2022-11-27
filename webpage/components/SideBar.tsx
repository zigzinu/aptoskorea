import { NextPage } from "next";
import fs from "fs";
import matter from "gray-matter";
import { useState } from "react";

interface SideBarProps {
  posts: Post[];
}

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    metaTitle: string;
    metaDesc: string;
    image: string;
    date: string;
    tags: string[];
    socialImage: string;
  };
  content: any;
}

const SideBar: NextPage = () => {
  const [open, setOpen] = useState(true);
  const [openMenuIndex, setOpenMenuIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const Menus = [
    { title: "Aptos Developer Documents", md: "Aptos_Developer_Documentation.md"},
    { title: "Whats New in Docs", md: "Whats_New_in_Docs.md"},
    { title: "Getting Started", md: "Getting_Started.md"},
    { title: "Aptos Quickstarts", md: "Aptos_Quickstarts/index.md", children: [
      { title: "Your First Transaction", md: "Your_First_Transaction.md"},
      { title: "Your First Move_Module", md: "Your_First_Move_Module.md"},
      { title: "Your First Dapp", md: "Your_First_Dapp.md"},
      { title: "Your First Coin", md: "Your_First_Coin.md"},
      { title: "Your First NFT", md: "Your_First_NFT.md"},
    ]},
    { title: "Aptos Quickstarts", md: "Aptos_Quickstarts/index.md", children: [
      { title: "Your First Transaction", md: "Your_First_Transaction.md"},
      { title: "Your First Move_Module", md: "Your_First_Move_Module.md"},
      { title: "Your First Dapp", md: "Your_First_Dapp.md"},
      { title: "Your First Coin", md: "Your_First_Coin.md"},
      { title: "Your First NFT", md: "Your_First_NFT.md"},
    ]},
  ]
  return (
      <aside
        className={`${
          open ? "w-72" : "w-10"
        } flex-none`}
      >
        <div className={`${
          open ? "w-72" : "w-10"
        } fixed z-10 pt-16 min-h-screen pl-1 pr-4 top-2 bg-gray-800 duration-300`}>
          <div onClick={() => setOpen(!open)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${!open && 'rotate-180'} h-7 w-7 absolute -right-3 top-24 stroke-gray-800 bg-white cursor-pointer rounded-full border-4 border-gray-800`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
          </div>
          <div className="pt-5 grid gap-y-1">
            {Menus.map((menu, index) => (
              <div
                className="text-white text-base z-30"
              >
                <div 
                  className={`${!open && 'hidden'} ${selectedIndex == index && selectedChildIndex == -1 ? "bg-gray-600" : ""} origin-left overflow-hidden mx-1 px-4 py-1 text-white text-base cursor-pointer hover:bg-gray-600 rounded-lg flex justify-between`}
                  onClick={() => {
                    if (menu.children) {
                      console.log(index);
                      setOpenMenuIndex(index);
                    }
                    setSelectedIndex(index);
                    setSelectedChildIndex(-1);
                  }}  
                >
                  {menu.title}
                  {menu.children ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className={`flex h-5 w-5 ${openMenuIndex == index ? "rotate-90" : ""} transition-transform duration-500`}fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    :
                    <></> 
                  }
                  {menu.children && openMenuIndex == index ? 
                    <div className="grid gap-y-1">
                      {menu.children.map((childMenu, childIndex) => (
                        <div
                          className={`${childIndex == 0 ? "mt-1" : ""} ${selectedIndex == index && selectedChildIndex == childIndex ? "bg-gray-600" : ""} text-white text-base cursor-pointer mx-1 ml-6 py-1 px-4 hover:bg-gray-600 rounded-lg`}
                          onClick={() => {
                            setSelectedIndex(index);
                            setSelectedChildIndex(childIndex);
                          }}>
                          <span className={`${!open && 'hidden'} origin-left duration-1000 px-2`}>{childMenu.title}</span>
                        </div>
                      ))}
                    </div> : 
                    <></>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="space-y-3">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white">Documents</h2>
          </div>
          <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center py-4">
                              <button
                                  type="submit"
                                  className="p-2 focus:outline-none focus:ring"
                              >
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 h-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                  >
                                      <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                      />
                                  </svg>
                              </button>
                          </span>
                          <input
                              type="search"
                              name="Search"
                              placeholder="Search..."
                              className="w-full py-2 pl-10 text-base rounded-md focus:outline-none"
                          />
                      </div>
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-base">
              <li className="rounded-sm">
                <a
                  href="#"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="text-gray-100">Home</span>
                </a>
              </li>
              <li className="rounded-sm">
                <a
                  href="#"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span className="text-gray-100">Inbox</span>
                </a>
              </li>
              <li className="rounded-sm">
                <a
                  href="#"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="text-gray-100">Orders</span>
                </a>
              </li>
              <li className="rounded-sm">
                <a
                  href="#"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-100">Settings</span>
                </a>
              </li>
              <li className="rounded-sm">
                <a
                  href="#"
                  className="flex items-center p-2 space-x-3 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-gray-100">Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </div> */}
      </aside>
  );
};

// export async function getStaticProps() {
//   const files = fs.readdirSync("posts");
//   console.log("files", files);
//   const posts = files.map((fileName) => {
//     const slug = fileName.replace(".md", "");
//     const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
//     const { data: frontmatter, content } = matter(readFile);

//     return {
//       slug,
//       frontmatter,
//       content,
//     };
//   });
//   return {
//     props: {
//       posts,
//     },
//   };
//   // Get all our posts
// }

export default SideBar;
