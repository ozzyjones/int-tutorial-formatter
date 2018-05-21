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

    it('no caps comments starting with method calls', () => {
        let s = '// validate()';
        expect(formatter.format(s)).to.equal(s);
    });

    it('ellipsis into comment', () => {
        expect(formatter.format('...')).to.equal('// ...');
    });

    it('ellipsis as parameter', () => {
        let s = 'doSomething(...);';
        expect(formatter.format(s)).to.equal(s);
    });

    it('ellipsis in object parameter', () => {
        const s = 'doSomething({...});';
        expect(formatter.format(s)).to.equal(s);
    });

    it('ellipsis inside quoted string - single quote', () => {
        let s = "doSomething('...')";
        expect(formatter.format(s)).to.equal(s);
    });

    it('ellipsis inside quoted string - double quote', () => {
        let before = 'doSomething("...")';
        let after = "doSomething('...')";
        expect(formatter.format(before)).to.equal(after);
    });

    it('ellipsis inside function - inline', () => {
        const s = 'var callback = function (){...}';
        expect(formatter.format(s)).to.equal(s);
    });

    it('ellipsis inside function - multiline', () => {
        const before = 
        'var callback = function (){\n' + 
        '    ...\n' + 
        '}';
        const after = 
        'var callback = function () {\n' + 
        '    // ...\n' + 
        '}';
        expect(formatter.format(before)).to.equal(after);
    });
});