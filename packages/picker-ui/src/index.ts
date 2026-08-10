import { definePicker } from './vanilla.js';

export { PolythemePicker, definePicker, PICKER_TAG } from './vanilla.js';
export { pickerStyles } from './styles.js';

// Importing the package registers the element. The logic lives in `vanilla.ts`
// so framework wrappers can import the class without the side effect.
definePicker();
