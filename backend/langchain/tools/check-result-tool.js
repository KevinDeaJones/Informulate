import { Tool } from 'langchain/tools';

export default class CheckNoResult extends Tool {
    name = 'CheckNoResult';
    description = 'Check if the result is null. Input is a result string, output is true if it is null';

    async _call(result) {
        // console.log(`checking: "${result}"`);
        return !result || result.trim().length == 0 || result.trim() == "null";
    }
}