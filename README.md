# LightPress

Static Contents Generator for Small CMS Site

## Instalation

```bash
npm i -D @madakalab/lightpress
```

## Display help message

```bash
npx lightpress
```

## Make contents

Generates a Markdown file to the inputPath.

```bash
npx lightpress make <content-type> <title>
```

### content-type

default value: ```articles```

### title

default value: ```Untitled```

> ### Examples
>
> ```bash
> npx lightpress make news 2024-01-01
> npx lightpress make articles Hello World!
> ```

## Build datas

Writes an array of data with added id and title to the metadata of a Markdown file to outputPath.  
Import this data to create a list page.

```bash
npx lightpress build <options>
```

### Options

#### -html

Writes HTML into the data. This will increase the file size, but allows for easy display of content.

#### -markdow

Writes markdown data into the data. If you use this option, consider directly importing the markdown file as well.

## Configuration

package.json

```json
{
  ...
  "lightpress": {
    "inputPath": "contents",
    "outputPath": "src/contents",
    "html": true,
    "markdown": false,
  }
}
```

### Vue Setting

Import markdown files in the app and parse them to save on data size.

```json
{
  "lightpress": {
    "inputPath": "src/contents",
    "outputPath": "src/contents",
    "html": false,
    "markdown": false,
  }
}
```
