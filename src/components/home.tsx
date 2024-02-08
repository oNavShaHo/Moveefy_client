"use client"
import React from 'react'

type Props = {user:Props}

function Home({user}: Props) {
  console.log(user);
  return (
    <main className="bg-gradient-to-r from-[rgb(165,142,255)] to-[#FF7AC2] h-screen flex flex-col justify-center items-center">
      <div className="flex gap-8">
        <div
          className="bg-[#BE76CF]
     min-h-[25rem] min-w-[20rem] flex justify-center items-center   border-2 rounded-xl border-[#CF94DD] hover:border-white"
        >
          <p>create room</p>
        </div>
        <div
          className="bg-[#BE76CF]
     min-h-[25rem] min-w-[20rem] flex justify-center shadow-md items-center
     border-2 rounded-xl border-[#CF94DD] hover:border-white
     "
        >
          <p>join room</p>
        </div>
      </div>
    </main>
  )
}

export default Home