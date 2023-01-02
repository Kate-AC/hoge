import { InputDelegate } from "presenter/components/form/input.delegate"
import { ChangeEvent, useState } from "react"

export type TextInput = {
    name: string
    value?: string
    placeholder?: string
    delegate?: InputDelegate
}

export const TextInput = (props: TextInput) => {
    const [value, setValue] = useState<string>(props.value ?? '')

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        props.delegate?.notifyInput({ element: e.target, name: e.target.name, value: e.target.value})
    }

    return <input
        type='text'
        value={value}
        name={props.name}
        onChange={onChange}
    />
}