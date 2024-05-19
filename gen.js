import {nodefs,readTextLines,readTextContent,DOMFromString, walkDOM, writeChanged} from 'ptk/nodebundle.cjs'
import {prolog,epilog,onOpen,onClose,onText} from './src/handlers.js'
await nodefs;

const raw = readTextLines('cccii2unicode.txt').map(it=>it.split(' ').map(it2=>parseInt(it2,16)))
raw.sort((a,b)=>a[0]-b[0])
const cccii=raw.map(it=>it[0]);
const unicode=raw.map(it=>it[1]);

const ctx={ele:{},nested:[],fn:'',t:'',
cccii,unicode,
notes:[],totalnotecount:0,notecount:0,notetext:'',innote:false,fn:''}
ctx.fn=process.argv[2]||'92620diamondsutra.xml';
const infile=readTextContent('gjxy/'+(ctx.fn));
const tree=DOMFromString(prolog(infile,ctx));

walkDOM(tree,ctx,onOpen,onClose,onText);

const out=epilog(ctx.t,ctx);
const out2=ctx.notes.join('\n');
writeChanged('off/'+ctx.fn.replace(/\.xml/ig,'.off'), out);
writeChanged('off/'+ctx.fn.replace(/\.xml/ig,'.tsv'), out2);

