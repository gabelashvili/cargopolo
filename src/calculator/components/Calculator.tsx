import Input from '../ui/input'
import './calculator.scss'
import Header from './header/Header'

const Calculator = () => {
  return (
    <div className="calculator">
      <Header />
      <div>
        <div>a</div>
        <div>b</div>
        <div>c</div>
        <div>d</div>
        <Input onChange={(e) => {console.log(e)}} type="text" label="Amount" placeholder='Enter amount' />
      </div>
    </div>
  )
}

export default Calculator