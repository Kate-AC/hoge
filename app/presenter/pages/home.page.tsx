import styled from "styled-components"
import { ProfileSection } from "presenter/components/profile.section"
import Link from "next/link"

const HomePageStyled = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`

export const HomePage = () => {
  const hoge = {
    accountId: 'hogefuga0000',
    name: 'けいとさん',
    iconUrl: 'https://pbs.twimg.com/profile_images/1596806191790759937/-bYuxnkL_400x400.jpg'
  }

  return (
    <HomePageStyled>
      <ProfileSection
        accountId={hoge.accountId}
        name={hoge.name}
        iconUrl={hoge.iconUrl}
      />
      <Link href='/contents/create'>
        <button>新規作成</button>
      </Link>
    </HomePageStyled>
  )
}
