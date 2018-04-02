import { TutorialFormatter } from '../TutorialFormatter';
import { expect } from 'chai';
import 'mocha';

const formatter = new TutorialFormatter();

describe('Tutorial Formatter', () => {

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
});