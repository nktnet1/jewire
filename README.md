<div align="center">

# [![Jewire](logo.svg)](https://github.com/nktnet1/jewire)

Access private functions, variables and classes from CommonJS modules

Enable named exports with relative paths identical to CommonJS [require](https://nodejs.org/api/modules.html#requireid)

Clone objects at runtime to remove false negatives in expect[.toStrictEqual](https://jestjs.io/docs/expect#tostrictequalvalue)


</div>

## 1. Installation

```
npm install jewire
```

## 2. Usage

<!-- Try with [replit](). -->

```
const { privVariable, privFunction } = jewire(relativePath, options);
```

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

  <td>objectClone</td>
  <td>
      Cloning function to apply to any objects or arrays that are global symbols, function return values or class method return values.
  </td>
    <td>
<pre>
(o) => JSON.parse(
  JSON.stringify(
    o
  )
)
</pre>
    </td>
    <td><code>utils.objectClone</code></td>
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

</details>

## 4. Limitations

As this library uses [rewire](https://github.com/jhnns/rewire) under the hood,
it has the same limitations in that it can only import CommonJS modules. Please
see the [limitations](https://github.com/jhnns/rewire#limitations) as described
in the rewire module.

## 5. Caveat

**jewire** was designed to autotest private functions in the submitted code of students
using the Jest testing framework during the first two weeks of their studies in
[COMP1531 Software Engineering Fundamentals](https://webcms3.cse.unsw.edu.au/COMP1531/23T2/outline).
This is because `npm` and module imports/exports are not introduced until week 3 when
students are more familiar with JavaScript as a programming language.

**jewire** aims to simplify the process of using [rewire](https://github.com/jhnns/rewire)
by removing the need to provide a file extension and absolute path, abstracting getter and
setter methods and enabling relative module imports similar to CommonJS
[require](https://nodejs.org/api/modules.html).
