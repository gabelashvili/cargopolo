import { useState } from 'react'
import Input from '../ui/input'
import Autocomplete, { type AutocompleteOption } from '../ui/autocomplete'
import Radio from '../ui/radio'
import { DollarIcon, ClearIcon, SearchIcon } from '../ui/icons'
import './calculator.scss'
import Header from './header/Header'
import Label from '../ui/label'

const currencyOptions: AutocompleteOption[] = [
  { value: 'usd', label: 'USD - US Dollar' },
  { value: 'eur', label: 'EUR - Euro' },
  { value: 'gbp', label: 'GBP - British Pound' },
  { value: 'jpy', label: 'JPY - Japanese Yen' },
  { value: 'cny', label: 'CNY - Chinese Yuan' },
  { value: 'gel', label: 'GEL - Georgian Lari' },
]

const Calculator = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<AutocompleteOption | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | number>('option1')

  return (
    <div className="calculator">
      <Header />
      <div>
        <div>b</div>
        <div>c</div>
        <div>d</div>
        <Label>Amount</Label>
        <Input
          startIcon={<DollarIcon />}
          endIcon={<ClearIcon />}
          onChange={e => {
            console.log(e)
          }}
          type="text"
          label="Amount"
          placeholder="Enter amount"
          required
        />
        <Autocomplete
          options={currencyOptions}
          value={selectedCurrency}
          onChange={setSelectedCurrency}
          label="Currency"
          placeholder="Select currency"
          startIcon={<SearchIcon />}
          // renderOption={({ option, isHighlighted, isSelected }) => (
          //   <div>
          //     <span>{option.label}</span>
          //     <span>{option.value} ae</span>
          //   </div>
          // )}
          required
        />
        <Radio
          label="Select Option"
          name="calculator-radio"
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
          value={selectedOption}
          onChange={setSelectedOption}
        />
        <div>+</div>
        <div>+</div>
        <div>+</div>
      </div>
    </div>
  )
}

export default Calculator
