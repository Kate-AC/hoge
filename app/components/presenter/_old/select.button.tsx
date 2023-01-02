import { isPropertySignature } from "typescript"
import { ButtonObserverValue } from "./button.observer";
import { useEffect, useState } from "react";
import { setUncaughtExceptionCaptureCallback } from "process";

export interface SelectButtonDelegate {
  buttonObserverValue?: ButtonObserverValue
  clicked: (id: number, text: string) => void
}
export const SelectButton = (
    props: { id: number, text: string; delegate?: SelectButtonDelegate; }
): JSX.Element => {
  const [value, setValue] = useState({id: 0, text: ''})
  useEffect(() => {
    props.delegate?.clicked(props.id, props.text)
  }, [value])

  return (
    <button onClick={() => {
        //props.delegate?.clicked(props.id, props.text)
        setValue({id: props.id, text: props.text})
      }}>
      {props.text}
    </button>
  )
}

export const useButtonObserver = (buttonObserverValue: ButtonObserverValue) => {
  const [value, setValue] = useState(buttonObserverValue)
  
  return value
}