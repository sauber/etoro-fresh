# Etoro-Fresh

Displaying investor profile data on a webpage. Using Deno fresh as web frame work.

## Profiling

```
deno task profile
node --prof-process isolate-*-v8.log > profile.txt
more profile.txt
rm profile.txt
rm isolate-*-v8.log
```
