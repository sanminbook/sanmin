import { bsearchNumber } from "ptk/nodebundle.cjs";

export const onText=(t,ctx)=>{
    if (ctx.innote){
        ctx.notetext+=t.replace(/\n/g,'');
    } else {
        ctx.t+=t.replace(/\n/g,'');
    }
}

export const prolog=(content,ctx)=>{  
    content=content.replace(/<p pagenum="\d+"><\/p>/g,''); //disturb note, remove it 阿蘭那也是比丘修習的場所和寺院的總稱 in main text
    content=content.replace(/<cccii code="([a-f\d]+)" *\/>/g,(m,code)=>{
        const cccii=parseInt(code,16);
        const at=bsearchNumber(ctx.cccii,cccii);
        if (~at) {
            const s=String.fromCharCode(ctx.unicode[at]);
            return s;
        } else {
            console.log('cannot map cccii to',code)
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
    content=content.replace(/【題　解】\n?/g,'^seg4');//not use
    content=content.replace(/【章　旨】\n?/g,'^seg1')
    content=content.replace(/【語　譯】\n?/g,'^seg2')
    content=content.replace(/\^pg(\d+)\n/g,'');//'^pg$1')  //先不處理原書頁碼
    if (ctx.fn=='92620diamondsutra.xml') {
        const at=content.indexOf('附　錄');
        if (~at) content=content.slice(0,at)
    }
    

    return content.replace(/\n+/g,'\n');
}
export const onOpen={
    freeze:(tag,ctx)=>{
        //if (!tag.innote) ctx.t+='^pg'+tag.attrs.pagenum; //先不處理原書頁碼
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
                ctx.t+='^seg0'
            }
        }
    },
    cnote:(tag,ctx)=>{
        if (tag.attrs.noteno=='1') {
            ctx.totalnotecount+=ctx.notecount;
            ctx.notecount=0;
        }
        ctx.notecount++;
        
        ctx.t+='^f'+(ctx.totalnotecount+ctx.notecount); //目前還不知道 詞長度
        
    }
};
export const onClose={
    'p':(tag,ctx)=>{
        if (ctx.innote){
            const at=ctx.notetext.indexOf('　');
            if (!~at) throw "not a note"
            const label=ctx.notetext.slice(0,at);
            const note=ctx.notetext.slice(at+1);
            ctx.notes.push( (ctx.totalnotecount+ctx.notecount)+'\t'+label+'\t'+note);
            
            //replace ^f11 with ^t(label)
            let at2=ctx.t.indexOf(label+'^f');
            if (~at2) {
                const m=ctx.t.slice(at2+label.length+2).match(/(\d+)/);
                if (m){
                    const label2=ctx.t.slice(at2,at2+label.length);
                    ctx.t= ctx.t.slice(0,at2)+'^t('+label2+')'+ctx.t.slice(at2+label.length+2+m[1].length);
                    //console.log(ctx.t)
                } else {
                    console.log('not found',ctx.t.slice(at2))
                }
            }

            ctx.innote=false;
            ctx.notetext='';
        }
    }
};