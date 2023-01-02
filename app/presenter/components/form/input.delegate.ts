export type InputNotification = {
    element: HTMLInputElement
    name: string
    value: string
}

export interface InputDelegate {
    notifyInput(params: InputNotification): void
}