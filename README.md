# React Amelisa

React and React Native integration for [Amelisa](https://github.com/amelisa/amelisa)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

### Features

- HOC wrapper for declarative data subscriptions
- Input component which handles text selection while collaborative editing
- Helper components for passing model into context and serializing data from server
- Server rendering (POC, limited support)
- AsyncStorage and SqliteStorage for React Native
- Tests

### Installation

```
$ npm install react-amelisa
```

### Tests

```
$ npm test
```

### Usage

```js
import { createContainer } from 'react-amelisa'

let Container = createContainer(MyComponent)
```

Read [documentation](http://amelisajs.com/docs/react) for more information.

### Example
- [amelisa-crud-example](https://github.com/amelisa/amelisa-crud-example) example app with auth

### MIT License
Copyright (c) 2016 by Vladimir Makhaev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
