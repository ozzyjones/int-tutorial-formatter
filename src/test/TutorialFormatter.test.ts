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

    it('title case sub-header in table of contents', () => {
        const before = '<li><a href="#Depth based realtime">Depth-based Real-time</a></li>';
        const after = '<li><a href="#Depth based realtime">Depth-Based Real-Time</a></li>';
        expect(formatter.format(before)).to.equal(after);
    });

    it('title case sub-header in body', () => {
        const before = '<h3><a id="Depth based realtime">Depth-based Real-time</a></h3>';
        const after = '<h3><a id="Depth based realtime">Depth-Based Real-Time</a></h3>';
        expect(formatter.format(before)).to.equal(after);
    });
});