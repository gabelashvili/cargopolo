import Input from '../ui/input'
import { DollarIcon, ClearIcon } from '../ui/icons'
import './calculator.scss'
import Header from './header/Header'

const Calculator = () => {
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
        <div>+</div>
        <div>+</div>
        <div>+</div>
      </div>
    </div>
  )
}

export default Calculator
