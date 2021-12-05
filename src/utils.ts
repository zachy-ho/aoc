import { readFileSync } from 'fs';
/** 
* Reads a file synchronously and puts each line into an item in an array of strings 
* @param { string } file: Path of input file
* */
export function getLinesFromFile(file: string) {
  let text = readFileSync(file, 'utf-8')
  return(text.split('\n'))
}
