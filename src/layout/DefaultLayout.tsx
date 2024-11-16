import React, { useState, ReactNode } from 'react';
import Sidebar from '../components/Sidebar/index';
import Header from "../components/Header";
import Footer from "./Footer.tsx";



const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      {/*<div className="flex h-screen overflow-hidden">*/}
      <div className="flex h-screen ">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        {/*<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">*/}
        <div className=" overflow-y-auto overflow-x-auto">
          {/* <!-- ===== Header Start ===== --> */}
          <Header />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className={`pb-20 sm:pb-0`}>
            {/*<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">*/}
            <div className=" duration-300 ease-linear pt-[40px] md:pt-0 ">
              {children}
            </div>

            <Footer/>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
