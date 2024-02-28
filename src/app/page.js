"use client"

import { useCookies } from 'next-client-cookies'
import { redirect } from 'next/navigation'
import HALO from "vanta/dist/vanta.halo.min";
import * as THREE from "three";
import React, { useState, useEffect, useRef } from "react";


export default function Home() {
  
  const cookies = useCookies();

  let publicKey = cookies.get('publicAddress')

  if (publicKey) {
    //router.push('/home')
    //router.refresh()
    redirect('/home')
  }

  const [vantaEffect, setVantaEffect] = useState(0)
  const myRef = useRef(null)
  useEffect(() => {
   if (!vantaEffect) {
      setVantaEffect(HALO({
        el: myRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        baseColor: 0x3a0a41,
        backgroundColor: 0x0,
        size: 1.50
    }))        
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])
  return (
    
    <div className="text-center grid place-items-center h-screen bg-black" ref={myRef}>
      <div className="">
        <div className="">
          <div className="text-white text-opacity-80">
            <h1 className="text-white text-6xl md:text-8xl px-10">Powering <span className="text-[#0fd7a9]">Flash Loans</span> On Soroban.</h1>
            <h3 className="text-base text-white px-1 pt-10 pb-5 md:pb-0 font-normal">Provide liquidity and borrow your flash loans on the <span className="text-[#0fd7a9] font-bold">Stellar-Soroban</span> ecosystem. Audited,
             efficient and with <span className="text-[#0fd7a9] font-bold">zero</span> protocol fees.</h3>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row mt-10 m-auto max-w-[450px]">
          <div className="my-4">
            <a href="https://docs.xycloans.app/" target="_blank" className="mx-4 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get Started</a>
          </div>
          <div className="my-4">
            <a href="https://github.com/xycloo/xycloans/" target="_blank" className="mx-4 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Github</a>
          </div>
          <div className="my-4">
            <a href="/pools" className="mx-4 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Explore Pools</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'