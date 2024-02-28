'use client'

import { useCookies } from 'next-client-cookies'
import Logo from "/public/xycloans_logo-removebg-preview.png"
import Image from 'next/image'
import { Button, Navbar } from 'flowbite-react';
import { useRouter } from 'next/navigation'
import { Keypair } from "@stellar/stellar-sdk"
import DropdownButton from './dropdownButton';

export default function AppNavbar() {
  
  const cookies = useCookies();
  const router = useRouter()

  let publicKey = cookies.get('publicAddress')

  const simpleSignerUrl = 'https://sign-testnet.bigger.systems';

  function openConnectWindow() {
    window.open(
      `${simpleSignerUrl}/connect`,
      'Connect_Window',
      'width=360, height=450',
    );
  }

  function handleMessage(e) {
    // Reject messages that are not coming from simple signer (tailor this according to your needs)
    if (e.origin !== simpleSignerUrl) {
      return;
    }

    const messageEvent = e.data;

    if (messageEvent.type === 'onConnect') {
      const publicKey = messageEvent.message.publicKey;
      // Validate the public key received. This is just good practice.
      if (Keypair.fromPublicKey(publicKey)) {
        cookies.set('publicAddress', publicKey)
        router.refresh()
      }
    }
  }

  if (typeof window !== "undefined") {
  window.addEventListener('message', handleMessage);
  }

  return (
    <Navbar fluid className="py-3 ">
      <Navbar.Brand href="/">
        <Image
          src={Logo}
          width="170"
          className="h-[30px] sm:h-[32px] w-[150px] sm:w-[160px] mb-1"
          alt="xycloans Logo"
        />
      </Navbar.Brand>
      <div className="flex md:order-2">
        {!publicKey && <Button onClick={openConnectWindow} className="mr-2 bg-[#12eab7] enabled:hover:bg-primary font-semibold text-black">Connect Wallet</Button>}
        {publicKey && <DropdownButton _publicKey={publicKey.substring(0, 4) + "..." + publicKey.slice(-4)}></DropdownButton>}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" className="md:hover:text-[#14b780]">
          Home
        </Navbar.Link>
        <Navbar.Link href="/pools" className="md:hover:text-[#14b780]">Pools</Navbar.Link>
        <Navbar.Link href="/ecosystem" className="md:hover:text-[#14b780]">Explorer</Navbar.Link>
        <Navbar.Link target="_blank" href="https://docs.xycloans.app" className="md:hover:text-[#14b780]">Documentation</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>

  )
}

