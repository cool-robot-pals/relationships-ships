import { Logger } from './types';

const log = (action: Logger) => console.log(JSON.stringify(action));

export { log };
