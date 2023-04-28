// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
import "../amm/interfaces/IPancakeRouter.sol";
import "../libraries/token/IERC20.sol";
import "../staking/RewardRouterV2.sol";
import "../libraries/math/SafeMath.sol";
import "../libraries/access/Ownable.sol";
import "../libraries/utils/ReentrancyGuard.sol";
import "../tokens/interfaces/IWETH.sol";

contract OapRouter is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    address public pancakeRouter;
    address public rewardRouter;
    address public weth;

    mapping(address => bool) public whitelistTokenOut;
    mapping(address => bool) public whitelistTokenIn;

    constructor(
        address _pancakeRouter,
        address _rewardRouter,
        address _weth
    ) public {
        pancakeRouter = _pancakeRouter;
        rewardRouter = _rewardRouter;
        weth = _weth;
    }

    function swapAndStakeETH(
        address tokenOut,
        uint256 amountOutMin,
        uint256 minUsdo,
        uint256 minOap
    ) external payable nonReentrant {
        require(msg.value > 0, "OapRouter: invalid msg.value");
        IWETH(weth).deposit{value: msg.value}();
        address tokenIn = weth;
        uint256 amountIn = msg.value;
        require(
            IERC20(tokenIn).balanceOf(address(this)) >= amountIn,
            "OapRouter: balance exceed"
        );
        require(
            whitelistTokenOut[tokenOut] && whitelistTokenIn[tokenIn],
            "OapRouter: Not whitelist token"
        );
        IERC20(tokenIn).approve(pancakeRouter, amountIn);
        uint256 _beforeBalance = IERC20(tokenOut).balanceOf(msg.sender);

        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        IPancakeRouter(pancakeRouter).swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            msg.sender,
            block.timestamp + 120
        );

        uint256 _afterBalance = IERC20(tokenOut).balanceOf(msg.sender);

        RewardRouterV2(payable(rewardRouter)).mintAndStakeOapForAccount(
            tokenOut,
            _afterBalance.sub(_beforeBalance),
            minUsdo,
            minOap,
            msg.sender
        );
    }

    function swapAndStake(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint256 minUsdo,
        uint256 minOap
    ) public nonReentrant {
        require(
            IERC20(tokenIn).balanceOf(msg.sender) >= amountIn,
            "OapRouter: balance exceed"
        );

        require(
            whitelistTokenOut[tokenOut] && whitelistTokenIn[tokenIn],
            "OapRouter: Not whitelist token"
        );
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(pancakeRouter, amountIn);
        uint256 _beforeBalance = IERC20(tokenOut).balanceOf(msg.sender);

        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        IPancakeRouter(pancakeRouter).swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            msg.sender,
            block.timestamp + 120
        );

        uint256 _afterBalance = IERC20(tokenOut).balanceOf(msg.sender);

        RewardRouterV2(payable(rewardRouter)).mintAndStakeOapForAccount(
            tokenOut,
            _afterBalance.sub(_beforeBalance),
            minUsdo,
            minOap,
            msg.sender
        );
    }

    function setPancakeRouter(address _router) public onlyOwner {
        pancakeRouter = _router;
    }

    function setRewardRouter(address _router) public onlyOwner {
        rewardRouter = _router;
    }

    function setWhitelistToken(
        address _token,
        bool _isWhitelist,
        bool _isTokenIn
    ) public onlyOwner {
        if (_isTokenIn) {
            whitelistTokenIn[_token] = _isWhitelist;
        } else {
            whitelistTokenOut[_token] = _isWhitelist;
        }
    }
}
