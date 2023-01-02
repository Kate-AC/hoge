import styled from "styled-components"

const TopPageStyled = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`

const TwitterRelationButton = styled.button`
  color: #fff;
  cursor: pointer;
  padding: 10px;
  border: none;
  border-radius: 30px;
  background: rgb(112,246,255);
  background: linear-gradient(270deg, rgba(112,246,255,1) 0%, rgba(0,124,231,1) 100%);
  width: 200px;
  transition: all 0.2s 0s ease;

  :hover {
    filter: contrast(120%);
  }
`

export const TopPage = () => {
  return (
    <TopPageStyled>
        <h2>Twinacious</h2>
        <div>
          <TwitterRelationButton
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_FUNCTIONS_PATH as string}/authRedirect`}
          >
            Twitterと連携する
          </TwitterRelationButton>
        </div>
    </TopPageStyled>
  )
}
