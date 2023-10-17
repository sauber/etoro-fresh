# High level Data Domain Design

## Entities

### Investor (by investorId)

Properties:

- chart
- portfolio
- stats

Aggregate: Community

### Transaction (by transactionId)

Properties:

- action (buy | close)
- instrument
- date
- amount
- fee

Aggregate: Book

### Instruments (by instrumentId)

Properties:

- name

Aggregate: Market

### Discover (value object)

Properties:

- community

### Strategy (value object)

Properties:

- ranking
- timing

### Repository (value object)

Properties:

- config
- persistentBackend
- fetchBackend

## High Level Use Cases

- refresh() // Download new data
- investor() // Display detailed information of an investor
- community() // Display list of all investors
- ranking() // Ranking of investors
- timing() // Timing of investors
- recommend() // Suggest changes to copyinvestment
- simulation() // Display results of using current model
- train() // Improve model
