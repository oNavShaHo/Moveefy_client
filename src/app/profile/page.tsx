"use client";
import axios from "axios";
import Link from "next/link";

import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React, { useState,useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Home from "@/components/home";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const [user, setUser] = useState(null);
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  const getData= async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setUser(res.data.data);
  }

  useEffect(()=>{
    getData();
  },[])

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
   
    router.push(`/profile/${data}`);
  };

  return (
    <div className="bg-gradient-to-r from-[rgb(165,142,255)] to-[#FF7AC2]">
      <nav className="flex justify-between items-center px-5 py-2 lg:px-6">
        <Image src="/moveefy.png" alt="img" height={60} width={60} />

        <div className="flex gap-3">
          <button
            onClick={logout}
            className="bg-white 
             hover:text-white
             hover:bg-[#BE76CF]
            text-[#BE76CF] font-bold py-1 px-3  rounded-lg"
          >
            Logout
          </button>

          <button
            onClick={getUserDetails}
            className="text-white hover:text-[#a837c1]
             "
          >
            <AccountCircleIcon fontSize="large" />
          </button>
        </div>
      </nav>
      <Home user={user} />

      <hr />
    </div>
  );
}

{
  /* <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >Logout</button>

         */
}
