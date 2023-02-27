import './Header.css';

const Header = ({ currentAddress, connectWallet }) => {
    return (
        <div className="header">
            <div className='header_container'>
                <div className="header__left">Task Manager</div>
                <div className="header__right">
                    {currentAddress ? <h3 className="current_address"><span className="account">Account:</span> {`${currentAddress.slice(0,5)} ... ${currentAddress.slice(-4)}` }</h3> : <button onClick={() => connectWallet()} className="connect_wallet">Connect Wallet</button>}
                </div>
            </div>
        </div>
    );
}

export default Header;