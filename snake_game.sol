pragma solidity ^0.4.26;

contract snakePoints {

    uint points=0;
    string playerName="Player";
    
    function getPoints() public view returns(uint){
        return points;
    }
    function getName() public view returns (string){
        return playerName;
    }
    function setPoints(uint _points, string _playerName) public {
        if(_points>points){
                    points=_points;
        playerName=_playerName;
        }
        else revert();

    }
}