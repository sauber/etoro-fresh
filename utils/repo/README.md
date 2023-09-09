# Design for repo class

## Date requests

* *recent*: If still valid, serve existing file, otherwise fetch new
* *latest*: Most recent file, without fetching
* *on(date)*: Lastest file on or prior to date. Null if no files available on or later.


## Example of requests:

```
// Load existing file, or fetch if too old
const discover: json = await repo.discover.recent();

// Load chart for an investor
// All charts extended as far back in time as possible
const chart: json = await repo.investor(name).recent.chart();

// Load most recent stats and portfolio for an investor
const chart: json = await repo.investor(name).recent.stats();
const portfolio: json = await repo.investor(name).recent.portfolio();

// Get first and last date of investor
const range: json = await repo.investor(name).range();

// Get stats and portfolio on a specific date
const chart: json = await repo.investor(name).on(date).stats();
const portfolio: json = await repo.investor(name).on(date).portfolio();

// List all investors
const investors: json = await repo.investors.all();

// List investors available on a certain date
const investors: json = await repo.investors.on(date);

// Get or set config value
const value: json = await repo.config.set(key. value);
repo.config.set(key. value);

// Most recent instruments file
const instruments: json = await repo.instruments.latest();
```