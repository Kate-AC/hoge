import { ButtonObserver } from "components/presenter/_old/button.observer"
import { useButtonObserver } from "./select.button"
import { useState, useEffect } from "react"

export const InputBox = () => {
  const buttonObserver = ButtonObserver.create()
  const hoge = useButtonObserver({id: 0, text: ""})
  const [text, setText] = useState("")

  useEffect(() => {
    console.log(hoge)
  }, [hoge])

  return <div>
    <input value={text} />
  </div>
}