
'use client';

import { Dropdown } from 'flowbite-react';
import { HiLogout } from 'react-icons/hi';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation'

export default function DropdownButton(props) {

  const cookiesStore = useCookies()
  const router = useRouter()

  function handleLogout() {
    cookiesStore.remove('publicAddress')
    router.push('/')
    router.refresh()
  }

  return (
    <Dropdown color="green" label={props._publicKey}>
      <Dropdown.Item icon={HiLogout} onClick={handleLogout} >Sign out</Dropdown.Item>
    </Dropdown>
  );
}
