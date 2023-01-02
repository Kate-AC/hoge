import { InputDelegate, InputNotification } from 'presenter/components/form/input.delegate'
import { TextInput } from 'presenter/components/form/text.input'
import { FileInput } from 'presenter/components/form/file.input'

export class FormObserver implements InputDelegate {

    private formValues: { [key: string]: InputNotification } = {}

    notifyInput(params: InputNotification): void {
        this.formValues[params.name] = {
            element: params.element,
            name: params.name,
            value: params.value
        }
    }

    async createFormData(): Promise<FormData> {
        const formData = new FormData

        await Promise.all(Object.keys(this.formValues).map(async formKey => {
            const input = this.formValues[formKey]

            switch(input.element.getAttribute('type')) {
            case 'text':
                formData.append(input.name, input.value)
                break
            case 'file':
                const files = input.element.files
                if (files != null) {
                    formData.append(input.name, files.item(0) ?? '', input.name)
                }
                break
            }
        }))

        return formData
    }
}