import { useState } from 'react'
import Input from '../ui/input'
import Autocomplete, { type AutocompleteOption } from '../ui/autocomplete'
import { DollarIcon, ClearIcon, SearchIcon } from '../ui/icons'
import './calculator.scss'
import Header from './header/Header'

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

  return (
    <div className="calculator">
      <Header />
      <div>
        <div>b</div>
        <div>c</div>
        <div>d</div>
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
        <div>+</div>
        <div>+</div>
        <div>+</div>
      </div>
    </div>
  )
}

export default Calculator
