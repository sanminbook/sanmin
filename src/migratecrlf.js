import { diffChars } from "diff"
export const migratelinebreak=(sourcetext,guidetext)=>{
    const d=diffChars(sourcetext,
        guidetext.replace(/\^lb/g,'').replace(/\^pb\d+/g,'').replace(/\^gatha/g,''));
    let  out='';
    for (let i=0;i<d.length;i++) {
        if (d[i].added) {
            out+=d[i].value.replace(/[^\^\na-z\d]/g,'');                   //永樂獨有，去內文，留標記換行

        } else if (d[i].removed) {
            out+=d[i].value.replace(/\n/g,''); //三民獨有
        } else {
            out+=d[i].value; //共有
        }
    }

    
    return out
}