import styled from "styled-components"

const ProfileSectionStyled = styled.section`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;

  img {
    display: block;
    border-radius: 100px;
    height: 100px;
    width: 100px;
  }

  .profile-text {
    margin-left: 20px;

    &__name {
      font-size: 1.8rem;
      font-weight: bold;
    }

    &__account-id {
      color: #aaa;
    }
  }
`

export const ProfileSection = (props: {
  iconUrl: string
  name: string
  accountId: string
}) => {
  return (
    <ProfileSectionStyled>
      <img src={props.iconUrl} />
      <div className='profile-text'>
        <div className='profile-text__name'>
          {props.name}
        </div>
        <div className='profile-text__account-id'>
          {props.accountId}
        </div>
      </div>
    </ProfileSectionStyled>
  )
}
