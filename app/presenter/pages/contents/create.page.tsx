import styled from "styled-components"
import { FormEvent, useState } from "react"
import axios from "axios"

import { FileInput } from "presenter/components/form/file.input"
import { TextInput } from "presenter/components/form/text.input"
import { FormObserver } from "presenter/components/form/form.observer"

const ContentsCreatePageStyled = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  form {
    input {
      display: block;
    }
  }
`

export const ContentsCreatePage = () => {
  const [formObserver] = useState<FormObserver>(new FormObserver)

  const submitEvent = (e: FormEvent<HTMLFormElement>) => {
    (async () => {
      const formData = await formObserver.createFormData()
      await axios.post(
        `${process.env.NEXT_PUBLIC_FUNCTIONS_PATH as string}/contentsCreate`,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
          },
        }
      )
    })()

    e.stopPropagation()
    e.preventDefault()

    return false
  }

  return (
    <ContentsCreatePageStyled>
        <h2>新規作成</h2>
        <form encType="multipart/form-data" onSubmit={submitEvent}>
            <TextInput name='sampleText' delegate={formObserver} />
            <FileInput name='sampleFile' delegate={formObserver} />
            <button>作成する</button>
        </form>
    </ContentsCreatePageStyled>
  )
}
