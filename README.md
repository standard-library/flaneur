# flaneur

Tell the flaneur where you'd like to go, and there the flaneur will take you.

## Installation

```shell
yarn add @standard-library/flaneur
```

## Usage

```es6
import flâneur from "@standard-library/flaneur";

const scrollY = K.fromEvents(window, "scroll").map(() => window.scrollTop);
const flânerie = flâneur({}, scrollY);

const interestingThings = K.sequentially(1000, [450, 100, 1000]);

flânerie.regard(interestingThings);
```
