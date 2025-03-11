
import * as React from "react"

type FormFieldContextValue = {
  name: string
}

type FormItemContextValue = {
  id: string
}

export const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)
export const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { id } = itemContext

  const formItemId = `${id}-form-item`
  const formDescriptionId = `${id}-form-item-description`
  const formMessageId = `${id}-form-item-message`

  return {
    id,
    name: fieldContext.name,
    formItemId,
    formDescriptionId,
    formMessageId,
    error: undefined
  }
}
