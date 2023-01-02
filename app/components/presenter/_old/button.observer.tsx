import { SelectButtonDelegate } from "components/presenter/_old/select.button"
import { useState } from "react"

export type ButtonObserverValue = {
    id: number
    text: string
}

export class ButtonObserver implements SelectButtonDelegate {

    private static instance: ButtonObserver
    buttonObserverValue?: ButtonObserverValue
    hoge: string = ""

    private constructor() {}

    static create(): ButtonObserver {
        if (!this.instance) {
            this.instance = new ButtonObserver
        }

        return this.instance
    }

    // Delegate
    clicked(id: number, text: string) {
        //useButtonObserver({ id, text })
        this.buttonObserverValue = { id, text }
    }
}
