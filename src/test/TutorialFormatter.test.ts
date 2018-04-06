import { TutorialFormatter } from '../TutorialFormatter';
import { expect } from 'chai';
import 'mocha';

const formatter = new TutorialFormatter();

describe('Tutorial Formatter', () => {

    it('title case header', () => {
        const before = '<html><head></head><body><h2>Real-time Demo</h2></body></html>';
        const after = '<html><head></head><body><h2>Real-Time Demo</h2></body></html>';
        expect(formatter.format(before)).to.equal(after);
    });

    it('title case sub-header in table of contents', () => {
        const before = '<html><head></head><body><li><a href="#Depth based realtime">Depth-based Real-time</a></li></body></html>';
        const after = '<html><head></head><body><li><a href="#Depth based realtime">Depth-Based Real-Time</a></li></body></html>';
        expect(formatter.format(before)).to.equal(after);
    });

    it('title case sub-header in body', () => {
        const before = '<html><head></head><body><h3><a id="Depth based realtime">Depth-based Real-time</a></h3></body></html>';
        const after = '<html><head></head><body><h3><a id="Depth based realtime">Depth-Based Real-Time</a></h3></body></html>';
        expect(formatter.format(before)).to.equal(after);
    });

    it('collapsed javascript code block', () => {
        const before = '<html><head></head><body><div class="code"><pre><code class="javascript">var a = 0;</code></pre></div></body></html>';
        const after = '<html><head></head><body><div class="code collapsed"><pre><code class="javascript">var a = 0;</code></pre></div><div class="see-more-container" onclick="togglecode(event)"><a>See More Code...</a></div><div class="see-less-container hidden" onclick="togglecode(event)"><a>See Less Code...</a></div></body></html>';
        expect(formatter.format(before)).to.equal(after);
    });

    it('collapsed javascript code block - already collapsable', () => {
        const s = '<html><head></head><body><div class="code collapsed"><pre><code class="javascript">var a = 0;</code></pre></div><div class="see-more-container" onclick="togglecode(event)"><a>See More Code...</a></div><div class="see-less-container hidden" onclick="togglecode(event)"><a>See Less Code...</a></div></body></html>';
        expect(formatter.format(s)).to.equal(s);
    });

    it('do not make non-javascript code block collapsible', () => {
        const before = '<html><head></head><body><div class="code"><pre><code>npm install jsonschema</code></pre></div></body></html>';
        const after = '<html><head></head><body><div class="code"><pre><code>npm install jsonschema</code></pre></div></body></html>';
        expect(formatter.format(before)).to.equal(after);
    });

    it('rename references link', () => {
        const before = '<html><head></head><body><li><a href="References">Reference Links</a></li></body></html>';
        const after =  '<html><head></head><body><li><a href="References">References</a></li></body></html>';
        expect(formatter.format(before)).to.equal(after);
    });
});