import * as React from "react"
import { Controller, type ControllerProps, type FieldValues, FormProvider } from "react-hook-form"
import { FormFieldContext, FormItemContext } from "./form-context"
import {
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./form-primitives"

export const Form = FormProvider

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
>({ ...props }: ControllerProps<TFieldValues>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

export const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

export {
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
