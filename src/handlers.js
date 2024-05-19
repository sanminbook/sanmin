import { bsearchNumber } from "ptk/nodebundle.cjs";

export const onText=(t,ctx)=>{
    if (ctx.innote){
        ctx.notetext+=t.replace(/\n/g,'');
    } else {
        ctx.t+=t.replace(/\n/g,'');
    }
}

export const prolog=(content,ctx)=>{  
    content=content.replace(/<cccii code="([a-f\d]+)" *\/>/g,(m,code)=>{
        const cccii=parseInt(code,16);
        const at=bsearchNumber(ctx.cccii,cccii);
        if (~at) {
            const s=String.fromCharCode(ctx.unicode[at]);
            console.log(s);
            return s;
        } else {
            console.log('undefined cccii',code)
            return '^cccii'+code;
        }
        
    })
    content=content.replace(/<p><\/p><\/cnote>/g,'</cnote>')  ;//useless. disturb paragraph marker

    content= content.replace(/<cnote name="no" noteno="1"><\/cnote><font name="note">([^>]+?)<\/font>/g,
    (m,label)=>{
        return '<note noteno="1">'+label+'</note>'
    });

    content= content.replace(/<cnote name="no"><\/cnote><font name="note">([^>]+?)<\/font>/g,
    (m,label)=>{
        return '<note>'+label+'</note>'
    });
    
    return content;
}
export const epilog=(content,ctx)=>{
    content=content.replace(/【注　釋】\n?/g,'')
    content=content.replace(/【題　解】\n?/g,'^explain')
    content=content.replace(/【章　旨】\n?/g,'^purpose')
    content=content.replace(/【語　譯】\n?/g,'^baihua')
    content=content.replace(/\^pg(\d+)\n/g,'^pg$1')
    if (ctx.fn=='92620diamondsutra.xml') {
        const at=content.indexOf('附　錄');
        if (~at) content=content.slice(0,at)
    }
    return content;
}
export const onOpen={
    freeze:(tag,ctx)=>{
        if (!tag.innote) ctx.t+='^pg'+tag.attrs.pagenum;
    },
    note:(tag,ctx)=>{ //convert by prolog() , cnote with name="no"
        if (tag.attrs.noteno=='1') {
            ctx.notecount=0;
        } 
        ctx.notecount++;
        ctx.innote=true;//capture text
    },
    p:(tag,ctx)=>{
        if (!tag.innote) {
            ctx.t+='\n'
            if (tag.attrs.name=='para11') {//經文
                ctx.t+='^jin'
            }
        }
    },
    cnote:(tag,ctx)=>{
        if (tag.attrs.noteno=='1') {
            ctx.totalnotecount+=ctx.notecount;
            ctx.notecount=0;
        }
        ctx.notecount++;
        
        ctx.t+='^f'+(ctx.totalnotecount+ctx.notecount);
    }
};
export const onClose={
    'p':(tag,ctx)=>{
        if (ctx.innote){
            ctx.notes.push( (ctx.totalnotecount+ctx.notecount)+'\t'+ctx.notetext);
            ctx.innote=false;
            ctx.notetext='';
        }
    }
};