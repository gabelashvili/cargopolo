import type { InputHTMLAttributes, ReactNode } from 'react'
import { NumericFormat, type NumericFormatProps } from 'react-number-format'
import './input.scss'

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> & {
  value?: string | number
  onChange?: (value: number | string) => void
  label?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  required?: boolean
}

type InputProps = BaseInputProps &
  (
    | {
        type?: Exclude<InputHTMLAttributes<HTMLInputElement>['type'], 'number'>
      }
    | ({ type: 'number' } & Omit<NumericFormatProps, 'onValueChange' | 'customInput' | 'value' | 'type'>)
  )

const InputWrapper = (
  props: Omit<InputProps, 'onChange' | 'label'> & {
    onChange?: React.ChangeEventHandler<HTMLInputElement>
  }
) => {
  return <input {...props} />
}

const Input = (props: InputProps) => {
  const { label, placeholder, startIcon, endIcon, required, ...restProps } = props
  const hasValue = props.value !== undefined && props.value !== '' && props.value !== null
  const hasStartIcon = !!startIcon
  const hasEndIcon = !!endIcon

  const wrapperClasses = [
    'input-wrapper',
    hasValue ? 'has-value' : '',
    hasStartIcon ? 'has-start-icon' : '',
    hasEndIcon ? 'has-end-icon' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (props.type === 'number') {
    const { onChange, ...numericProps } = restProps
    return (
      <div className="input-root">
        {label && <label className="input-label">{label}</label>}
        <div className={wrapperClasses}>
          {startIcon && <span className="input-icon input-icon-start">{startIcon}</span>}
          <NumericFormat
            {...(numericProps as NumericFormatProps)}
            onValueChange={values => {
              onChange?.(values.value)
            }}
            customInput={InputWrapper}
            placeholder=" "
          />
          {placeholder && (
            <label className="input-placeholder">
              {placeholder}
              {required && <span className="input-required">*</span>}
            </label>
          )}
          {endIcon && <span className="input-icon input-icon-end">{endIcon}</span>}
        </div>
      </div>
    )
  }

  const { onChange, ...inputProps } = restProps
  return (
    <div className="input-root">
      {label && <label className="input-label">{label}</label>}
      <div className={wrapperClasses}>
        {startIcon && <span className="input-icon input-icon-start">{startIcon}</span>}
        <InputWrapper {...inputProps} onChange={e => onChange?.(e.target.value)} placeholder=" " />
        {placeholder && (
          <label className="input-placeholder">
            {placeholder}
            {required && <span className="input-required">*</span>}
          </label>
        )}
        {endIcon && <span className="input-icon input-icon-end">{endIcon}</span>}
      </div>
    </div>
  )
}

export default Input
