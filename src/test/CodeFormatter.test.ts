import { CodeFormatter } from '../CodeFormatter';
import { expect } from 'chai';
import 'mocha';

const formatter = new CodeFormatter();

describe('Code Formatter', () => {

    it('space after comment', () => {
        expect(formatter.format('//ABC')).to.equal('// ABC');
    });

    it('capitalize first letter in comment: " abc"', () => {
        expect(formatter.format('// abc')).to.equal('// Abc');
    });

    it('capitalize first letter in comment: "abc"', () => {
        expect(formatter.format('//abc')).to.equal('// Abc');
    });

    it('capitalize first letter in comment: " ABC"', () => {
        expect(formatter.format('// ABC')).to.equal('// ABC');
    });

    it('capitalize first letter in comment: "ABC"', () => {
        expect(formatter.format('//ABC')).to.equal('// ABC');
    });

    it('encode "<"', () => {
        expect(formatter.format('var a = (b < 0);')).to.equal('var a = (b &lt; 0);');
    });

    it('encode ">"', () => {
        expect(formatter.format('var a = (b > 0);')).to.equal('var a = (b &gt; 0);');
    });
});