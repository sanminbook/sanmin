import {nodefs,readTextLines,readTextContent,DOMFromString, walkDOM, writeChanged, } from 'ptk/nodebundle.cjs'
import {prolog,epilog,onOpen,onClose,onText} from './src/handlers.js'
import {migratelinebreak} from './src/migratecrlf.js'
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

const out=epilog(ctx.t,ctx).split(/(\^seg\d+)/);

const out2=ctx.notes.join('\n');
//writeChanged('off/'+ctx.fn.replace(/\.xml/ig,'.off'), out);

let seg='unknown',group=0;
const segments={};
for (let i=0;i<out.length;i++) {
    if (out[i].startsWith('^seg')) {
        seg=out[i].slice(1);
        if (out[i].startsWith('^seg0')) {  //題解只有幾個，先不處理
            group++;
        }
    }
    if (!segments[seg]) segments[seg]='';
    segments[seg]+=out[i].replace(/\^seg\d+/g,'\n^g'+group);
}

writeChanged('off/'+ctx.fn.replace(/\.xml/ig,'.tsv'), out2);
for (let s in segments) {
    let text=segments[s].replace(/\n+/g,'\n');

    if (s=='seg0') {//經文引用 ck 
        const vcpp=readTextContent('../yonglezang/ylz-prjn.offtext/vcpp.off');
        text=migratelinebreak(text,vcpp);

        //deal with ^t
        text=text.replace(/\^t\(\n/g,'\n^t(');

    }
    writeChanged('off/'+ctx.fn.replace(/\.xml/ig,'-'+s+'.txt'), text);
}
