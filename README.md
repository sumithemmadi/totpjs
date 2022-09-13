# totpjs
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
totpjs add  (Add to 2FA key)
totpjs remove  (Add to 2FA key).

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

```
~$ totpjs remove
```
![IMAGE](https://raw.githubusercontent.com/sumithemmadi/totpjs/main/example/remove.png)

# LICENSE

MIT License

Copyright (c) 2022 Emmadi Sumith Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
