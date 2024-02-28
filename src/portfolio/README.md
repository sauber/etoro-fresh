# Portfolio Management

Run a number of portfolio management strategies against a current portfolio, and
suggest current positions to close or new positions to open.

## High Level Process

1. Decide how much money should be invested, and how much should be available cash
2. Identify which positions are currently open
3. Close positions with expired data
4. Close positions at takeprofit and stoploss limits
5. Identify how the ideal portfolio would look like, based on ranking of investors.
6. Desired investors where not enough investment
7. Identify 

| Desired                 | Undesired |
| ---  | --- |
| buy: Desired and buy signal  | ignore: Undesired and buy signal |
| sell2: Desired and sell signal | sell1: Undesired and sell signal |

8. Close undesired with sell signal (sell1)
9. If necesseary to meet currently desired investment level, also close off desired with sell signal (sell2)
10. Buy desired with buy signal. Amount depends on strength of buy signal. Skip too small investments. Stay within desired investment level.


