import type { InputHTMLAttributes } from "react"
import { NumericFormat, type NumericFormatProps } from "react-number-format"

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> & {
  value?: string | number 
  onChange?: (value: number | string) => void
}

type InputProps = BaseInputProps & (
  | { type?: Exclude<InputHTMLAttributes<HTMLInputElement>['type'], 'number'> }
  | ({ type: 'number' } & Omit<NumericFormatProps, 'onValueChange' | 'customInput' | 'value' | 'type'>)
)

const InputWrapper = (props: Omit<InputProps, 'onChange'> & { onChange?: React.ChangeEventHandler<HTMLInputElement> }) => {
  return <input {...props} />
}

const Input = (props: InputProps) => {
  if (props.type === 'number') {
    const { onChange, ...numericProps } = props
    return (
      <NumericFormat
        {...(numericProps as NumericFormatProps)}type
        onValueChange={(values) => {
          onChange?.(values.value)
        }}
        customInput={InputWrapper}
      />
    )
  }
  
  const { onChange, ...inputProps } = props
  return (
    <InputWrapper
      {...inputProps}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}

export default Input