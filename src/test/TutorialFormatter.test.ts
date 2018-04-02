import { TutorialFormatter } from '../TutorialFormatter';
import { expect } from 'chai';
import 'mocha';

const formatter = new TutorialFormatter();

describe('Tutorial Formatter', () => {

    it('space after comment', () => {
        expect(formatter.format('//ABC')).to.equal('// ABC');
    });

});