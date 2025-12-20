import Input from '../ui/input'
import './calculator.scss'
import Header from './header/Header'

const Calculator = () => {
  return (
    <div className="calculator">
      <Header />
      <div>
        <div>a</div> qwd qwd qwd qwd wqd wqd qwd qwd qwd qwd qwd qwd qwd qwd qwdqwd qwd wd wqdq wdqw wqdwq wqd wq qwd
        qwd qwd qw qwd qw dqw dqw dqwd qwd qwdd qw dqwd qwd qwd qwd qwd qwd qw dqw
        <div>b</div>
        <div>c</div>
        <div>d</div>
        <Input
          onChange={e => {
            console.log(e)
          }}
          type="text"
          label="Amount"
          placeholder="Enter amount"
        />
      </div>
    </div>
  )
}

export default Calculator
