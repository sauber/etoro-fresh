# Domains of data

## Investor (by investorId)

Properties:

- chart
- portfolio
- stats

Aggregate: Community

## Transaction (by transactionId)

Properties:

- action (buy | close)
- instrument
- date
- amount
- fee

Aggregate: Book

## Instruments (by instrumentId)

Properties:

- name

Aggregate: Market

## Discover (value object)

Properties:

- community

## Strategy (value object)

Properties:

- ranking
- timing

Use Cases:

- learn()
- transaction[] = execute(community)

## Repository (value object)

Properties:

- config
- persistentBackend
- fetchBackend

Use Cases:

- refresh()
- delete()
- store(name, data)
- data = retreive(name)
