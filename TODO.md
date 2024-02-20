* In investor-assembly deal with charts ending with 6000
* In grid.ts module, square the displacement, to encourage shifting whole row/column instead of moving a single item far away. It's more important that relative rank is maintained, than absolute position.
* In deno.json remove these lines, except first $std/ line:
```
     "$std/": "https://deno.land/std@0.211.0/",
    "base64": "https://deno.land/std@0.206.0/encoding/base64.ts",
    "dotenv": "https://deno.land/std@0.201.0/dotenv/mod.ts",
    "difference": "https://deno.land/std@0.200.0/datetime/difference.ts",
    "format": "https://deno.land/std@0.200.0/datetime/mod.ts",
    "fs": "https://deno.land/std@0.200.0/fs/mod.ts",
    "path": "https://deno.land/std@0.200.0/path/mod.ts",
    "printf": "https://deno.land/std@0.200.0/fmt/printf.ts",
    "yaml": "https://deno.land/std@0.200.0/yaml/mod.ts",
```

* In deno.json remove this line:
```
    "preact/": "https://esm.sh/preact@10.19.2/",
```

* Write tests for web pages. Checking for return code 200 is good enough.
* In stats.ts deal with StatsExport vs StastImport