import './header.scss'
import logo from '../../../assets/logo.svg'

const Header = () => {
  return (
    <div className="calculator-header">
      <img src={logo} alt="logo" />
    </div>
  )
}

export default Header
