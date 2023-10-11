<div align="center">

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f411d8e7d24448f3a7fa9be3e8eb8e97)](https://app.codacy.com/gh/nktnet1/jewire?utm_source=github.com&utm_medium=referral&utm_content=nktnet1/jewire&utm_campaign=Badge_Grade)
# [![Jewire](logo.svg)](https://github.com/nktnet1/jewire)

[![pipeline](https://github.com/nktnet1/jewire/actions/workflows/pipeline.yml/badge.svg)](https://github.com/nktnet1/jewire/actions/workflows/pipeline.yml)
&nbsp;
[![codecov](https://codecov.io/gh/nktnet1/jewire/branch/main/graph/badge.svg?token=RAC7SKJTGU)](https://codecov.io/gh/nktnet1/jewire)
&nbsp;
[![Maintainability](https://api.codeclimate.com/v1/badges/3ec8c0ddebe848926277/maintainability)](https://codeclimate.com/github/nktnet1/jewire/maintainability)
&nbsp;
[![Snyk Security](https://snyk.io/test/github/nktnet1/jewire/badge.svg)](https://snyk.io/test/github/nktnet1/jewire)
&nbsp;
[![GitHub top language](https://img.shields.io/github/languages/top/nktnet1/jewire)](https://github.com/search?q=repo%3Anktnet1%2Fjewire++language%3ATypeScript&type=code)

[![NPM Version](https://img.shields.io/npm/v/jewire?logo=npm)](https://www.npmjs.com/package/jewire?activeTab=versions)
&nbsp;
[![install size](https://packagephobia.com/badge?p=jewire)](https://packagephobia.com/result?p=jewire)
&nbsp;
[![Depfu Dependencies](https://badges.depfu.com/badges/6c4074c4d23ad57ee2bfd9ff90456090/overview.svg)](https://depfu.com/github/nktnet1/jewire?project_id=39032)
&nbsp;
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fnktnet1%2Fjewire.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fnktnet1%2Fjewire?ref=badge_shield)
&nbsp;
[![NPM License](https://img.shields.io/npm/l/jewire)](https://opensource.org/license/mit/)
&nbsp;
[![GitHub issues](https://img.shields.io/github/issues/nktnet1/jewire.svg?style=social)](https://github.com/nktnet1/jewire/issues)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=nktnet1_jewire&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=nktnet1_jewire)
&nbsp;
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f222c2e572fc41b7b45c3591c3575a9d)](https://app.codacy.com/gh/nktnet1/jewire/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
&nbsp;
[![DeepSource](https://app.deepsource.com/gh/nktnet1/jewire.svg/?label=active+issues&show_trend=true&token=OTP6tE2be4X1kvxZRsxRh25e)](https://app.deepsource.com/gh/nktnet1/jewire/)
&nbsp;
[![codebeat badge](https://codebeat.co/badges/8bdb4562-0492-4c1c-8b02-e69c94373d60)](https://codebeat.co/projects/github-com-nktnet1-jewire-main)
&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/nktnet1/jewire.svg?style=social)](https://github.com/nktnet1/jewire/stargazers)

[![Downloads Total](https://badgen.net/npm/dt/jewire)](https://moiva.io/?npm=jewire)
&nbsp;
[![Downloads Total](https://badgen.net/npm/dy/jewire)](https://moiva.io/?npm=jewire)
&nbsp;
[![Downloads Monthly](https://badgen.net/npm/dm/jewire)](https://moiva.io/?npm=jewire)
&nbsp;
[![Downloads Weekly](https://badgen.net/npm/dw/jewire)](https://moiva.io/?npm=jewire)
&nbsp;
[![Downloads Daily](https://badgen.net/npm/dd/jewire)](https://moiva.io/?npm=jewire)

---

Access private functions, variables and classes from CommonJS modules

Enable named exports with relative paths identical to CommonJS [require](https://nodejs.org/api/modules.html#requireid)

Clone objects at runtime to remove false negatives in expect[.toStrictEqual](https://jestjs.io/docs/expect#tostrictequalvalue)

</div>

---

- [1. Installation](#1-installation)
- [2. Usage](#2-usage)
    - [2.1. relativePath](#21-relativepath)
    - [2.2. Options](#22-options)
- [3. License](#3-license)
- [4. Limitations](#4-limitations)
- [5. Caveats](#5-caveats)

## 1. Installation

```
npm install jewire
```

## 2. Usage

<!-- Try with [replit](). -->

```
jewire(relativePath, options);
```

<details closed>
<summary>Examples (click to view)</summary>

<br/>

Importing from the same directory

```javascript
const { privateVariable, privateFunction } = jewire('private-module');
```

Importing `.cjs` file from a different directory

```javascript
const { privateFunction  } = jewire('../src/private-module.cjs');
```

Using a different basePath

```javascript
const { privateFunction } = jewire(
  '../src/private-module.cjs',
  { basePath: process.cwd() }
);
```

Using a different clone function from the default `clone.objectClone`:

```javascript
const { privateFunction } = jewire(
  '../src/private-module.cjs',
  { objectClone: (obj) => JSON.parse(JSON.stringify(obj)) }
);
```

</details>

<br/>


### 2.1. relativePath

Path to the module relative to the current file, similar to CommonJS [require](https://nodejs.org/api/modules.html#requireid).
  - e.g. `'../animals/cats.js'`

### 2.2. options

<table>
  <tr>
    <th>Option</th>
    <th>Description</th>
    <th>Example</th>
    <th>Default</th>
  </tr>

  <tr>
    <td>basePath</td>
    <td>Absolute path to the module.</td>
    <td>
<pre>
process.cwd()
</pre>
    </td>
    <td><code>__dirname</code></td>
  </tr>

  <td>
    objectClone
  </td>
  <td>
      Cloning function to apply to any objects or arrays that are global symbols, function return values or class method return values.
  </td>
    <td>
<pre>
o => JSON.parse(
  JSON.stringify(
    o
  )
)
</pre>
    </td>
    <td>
      <code>objectClone</code>
      <br />
      (see <a href='src/clone.ts'>clone.ts</a>)
    </td>

  </tr>
  <tr>
    <td>callback</td>
    <td>
        Callback function with further context about the private module if the import is successful.
    </td>
    <td>
<pre>
(rC, hE) => {
  console.log(
      rC, hE
  );
}
</pre>
    </td>
    <td><code>undefined</code></td>
  </tr>
</table>


## 3. License

<details closed>
<summary>
  Massachusetts Institute of Technology
  (<a href="https://opensource.org/license/mit" target="_blank">MIT</a>)
</summary>

<br/>

```
Copyright (c) 2023 Khiet Tam Nguyen

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the “Software”),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALING S IN THE SOFTWARE.
```

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fnktnet1%2Fjewire.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fnktnet1%2Fjewire?ref=badge_large)

</details>

## 4. Limitations

As this library uses [rewire](https://github.com/jhnns/rewire) under the hood,
it has the same limitations in that it can only import CommonJS modules. Please
see the [limitations](https://github.com/jhnns/rewire#limitations) as described
in the rewire module.

## 5. Caveats

**jewire** was designed to autotest private functions in the submitted code of students
using the Jest testing framework during the first two weeks of their studies in
[COMP1531 Software Engineering Fundamentals](https://webcms3.cse.unsw.edu.au/COMP1531/23T2/outline).
This is because `npm` and module imports/exports are not introduced until week 3 when
students are more familiar with JavaScript as a programming language.

**jewire** aims to simplify the process of using [rewire](https://github.com/jhnns/rewire)
by removing the need to provide a file extension and absolute path, abstracting getter and
setter methods and enabling relative module imports similar to CommonJS
[require](https://nodejs.org/api/modules.html).
