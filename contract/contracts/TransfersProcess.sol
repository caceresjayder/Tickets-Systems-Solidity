// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ReceiveEther {
    receive() external payable {}

    function getBalance() public view returns(uint){
        return address(this).balance;
    }
}

contract SendEther {
    bool lock = false;
    function sendEther (address payable _to, uint256 _priceToPay) public payable returns(bool){
        require(!lock, 'Reentrancy Detected');
        lock = true;        
        require(msg.value == _priceToPay, "El monto del pago no es igual al precio");
        (bool sent, ) = _to.call{value: _priceToPay}("");
        require(sent, "Payment Failed");
        lock = false;
        return sent;
    }

    function withdrawEther (address payable _to, uint256 _amount) public payable returns(bool){
        require(!lock, 'Reentrancy Detected');
        lock = true;        
        require(msg.value == _amount, "El monto del pago no es igual al precio");
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Transaccion failed");
        lock = false;
        return sent;
    }
}
