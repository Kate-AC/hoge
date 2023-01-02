import { InputDelegate } from "presenter/components/form/input.delegate"
import { ChangeEvent } from "react"

export type FileInput = {
    name: string
    delegate?: InputDelegate
}

export const FileInput = (props: FileInput) => {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget)
        props.delegate?.notifyInput({ element: e.target, name: e.target.name, value: e.target.value})
    }

    return <input
        type='file'
        name={props.name}
        onChange={onChange}
    />
}