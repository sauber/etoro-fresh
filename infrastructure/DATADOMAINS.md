# Domains of data

## Repository

Objects:

- config
- persistentBackend
- fetchBackend

Use Cases:

- refresh()
- delete()
- store(name, data)
- data = retreive(name)

## Chart

Objects:

- timeseries

Use Cases:

- validate(dto)
- extend(chart)

## Portfolio

Objects:

- positions

Use Cases:

- validate(dto)
- pctOverlap(portfolio)

## Stats

Objects:

- stats

Use Cases:

- validate(dto)

## Discover

Objects:

- portfolio

Use Cases:

- validate(dto)

## Instruments

Objects:

- instrument

Use Cases:

- validate(dto)

## Investor

Objects:

- chart
- portfolio
- stats

Use Cases:

- getCommunity(date)
- getInvestor(date)

## Book

Objects:

- transaction

Use Cases:

- placeorder()

## Tradingmodel

Objects:

- ranking
- timing

Use Cases:

- learn()
- store()
- retrieve()
