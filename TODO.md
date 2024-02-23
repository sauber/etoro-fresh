* In investor-assembly deal with charts ending with 6000
* In grid.ts module, square the displacement, to encourage shifting whole row/column instead of moving a single item far away. It's more important that relative rank is maintained, than absolute position.
* Change into one-liner:
```
const path: string = Deno.args[0];
const backend = new DiskBackend(path);
const repo = new CachingBackend(backend);
export const community = new Community(repo);
```
* Class files should not import modules from other directories. Import should only be from mod.ts
* Test files should not import modules or data from other directories. Import should only be from testdata.ts
* Strategy, book and simulation should use same Portfolio module.
* Simulation is incomplete and broken
* Move /utils/time to /time