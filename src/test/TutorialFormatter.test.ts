import { TutorialFormatter } from '../TutorialFormatter';
import { expect } from 'chai';
import 'mocha';

const formatter = new TutorialFormatter();

describe('Tutorial Formatter', () => {

    it('title case header', () => {
        const before = '<h2>Real-time Demo</h2>';
        const after = '<h2>Real-Time Demo</h2>';
        expect(formatter.format(before)).to.equal(after);
    });
});