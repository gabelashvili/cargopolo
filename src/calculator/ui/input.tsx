import type { InputHTMLAttributes } from "react"
import { NumericFormat, type NumericFormatProps } from "react-number-format"
import './input.scss'

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> & {
  value?: string | number 
  onChange?: (value: number | string) => void
  label?: string
}

type InputProps = BaseInputProps & (
  | { type?: Exclude<InputHTMLAttributes<HTMLInputElement>['type'], 'number'> }
  | ({ type: 'number' } & Omit<NumericFormatProps, 'onValueChange' | 'customInput' | 'value' | 'type'>)
)

const InputWrapper = (props: Omit<InputProps, 'onChange' | 'label'> & { onChange?: React.ChangeEventHandler<HTMLInputElement> }) => {
  return <input {...props} />
}

const Input = (props: InputProps) => {
  const { label, placeholder, ...restProps } = props
  const hasValue = props.value !== undefined && props.value !== '' && props.value !== null

  if (props.type === 'number') {
    const { onChange, ...numericProps } = restProps
    return (
      <div>
        {label && <label className="input-label">{label}</label>}
        <div className={`input-wrapper ${hasValue ? 'has-value' : ''}`}>
        <NumericFormat
          {...(numericProps as NumericFormatProps)}
          onValueChange={(values) => {
            onChange?.(values.value)
          }}
          customInput={InputWrapper}
          placeholder=" "
        />
        {placeholder && <label className="input-placeholder">{placeholder}</label>}
      </div>
      </div>
    )
  }
  
  const { onChange, ...inputProps } = restProps
  return (
     <div className="input-root">
         {label && <label className="input-label">{label}</label>}
    <div className={`input-wrapper ${hasValue ? 'has-value' : ''}`}>
      <InputWrapper
        {...inputProps}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder=" "
      />
      {placeholder && <label className="input-placeholder">{placeholder}</label>}
    </div>
     </div>
  )
}

export default Input