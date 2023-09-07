# totpjs

[![Version](https://img.shields.io/npm/v/node-totpjs.svg)](https://www.npmjs.com/package/node-totpjs) 
[![Stars](https://img.shields.io/github/stars/sumithemmadi/totpjs)](https://github.com/sumithemmadi/totpjs/stargazers) 
[![weekly Download](https://img.shields.io/npm/dt/node-totpjs.svg)](https://github.com/sumithemmadi/totpjs) 
[![License](https://img.shields.io/npm/l/node-totpjs.svg)](https://github.com/sumithemmadi/totpjs/blob/main/LICENSE)
[![Maintenance](https://img.shields.io/npms-io/maintenance-score/node-totpjs)](https://github.com/sumithemmadi/totpjs) 
[![issues](https://img.shields.io/github/issues/sumithemmadi/totpjs)](https://github.com/sumithemmadi/totpjs/issues)

`totpjs`/`node-totpjs` is a cli which generate 2FA One Time Passwords.

![VIDEO](https://raw.githubusercontent.com/sumithemmadi/totpjs/main/example/example.gif)

# INSTALLATION

- To install globally
```
npm install -g node-totpjs
```

- To use it in nodejs
```
npm install node-totpjs
```
and use it like.
```js
import { get_totp } from "node-totpjs";
console.log(get_totp("BSGSALKSNFASFASF"))
// 929926
```

# CLI-USAGE
- Install it globally
```
npm install -g node-totpjs
```

```
~$ totpjs --help
Usage:
totpjs add (Add a 2FA key)
totpjs remove (Remove a 2FA key)

Options:
      --version      Show version number                [boolean]
  -i, --interactive  Interactively select 2FA account   [boolean]
  -h, --help         Show help                          [boolean]
```

### Adding new 2FA Key

```
~$ totpjs add
```
![IMAGE](https://raw.githubusercontent.com/sumithemmadi/totpjs/main/example/add.png)

### Removing 2FA Key
example/interactive.gif
```
~$ totpjs remove
```
![IMAGE](https://raw.githubusercontent.com/sumithemmadi/totpjs/main/example/remove.png)


### Select a particular  account
```bash
~$ totpjs -i # Select a particular  account
```
![IMAGE](https://raw.githubusercontent.com/sumithemmadi/totpjs/main/example/interactive.gif)

# LICENSE

MIT License

Copyright (c) 2022 Emmadi Sumith Kumar
## 💝 Sponsor and support me

If you find my projects helpful or inspiring, consider supporting me through GitHub Sponsors. Your sponsorship helps me dedicate more time and effort to open source development and creating impactful projects.

[:heart: Sponsor me on github](https://github.com/sponsors/sumithemmadi?o=sd&sc=t)

<a href='https://ko-fi.com/W7W4OZNLF' target='_blank'><img height='40' style='border:0px;height:40px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

<a href="https://www.buymeacoffee.com/sumithemmadi"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="40" width="180" alt="sumithemmadi" /></a><br><br>

### 💖 Sponsors

[![Sponsors](https://sumithemmadi.github.io/sponsors.svg)](https://github.com/sponsors/sumithemmadi/)

- I want to extend my sincere gratitude to all my sponsors for their generous support.



