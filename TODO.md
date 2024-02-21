* In investor-assembly deal with charts ending with 6000
* In grid.ts module, square the displacement, to encourage shifting whole row/column instead of moving a single item far away. It's more important that relative rank is maintained, than absolute position.
* Change into one-liner:
```
const path: string = Deno.args[0];
const backend = new DiskBackend(path);
const repo = new CachingBackend(backend);
export const community = new Community(repo);
```
