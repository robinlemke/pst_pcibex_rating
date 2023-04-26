function rnmt(toFill,fillFrom,n){
  if (fillFrom.length<1) return toFill;
  let lst = toFill[toFill.length-1], nxt = fillFrom[0];
  if (toFill.length>=n) {
    if (nxt.type == lst.type) {
      let lstN = 0;
      for (let i=toFill.length-1; i>=0 && toFill[i].type==lst.type; i--) lstN += 1;
      if (lstN>=n) {
        for (let i=0; i<fillFrom.length && nxt.type==lst.type; i++) {
          fillFrom = [...fillFrom.slice(1,),fillFrom[0]];
          nxt = fillFrom[0];
        }
        if (nxt.type==lst.type) return false;
      }
    }
  }
  return rnmt([...toFill,nxt],fillFrom.slice(1,),n);
}

function RandomizeNoMoreThan(predicate,n) {
  this.args = [predicate];
  this.run = function(arrays) {
    let ret = false;
    while (!ret){
      fisherYates(arrays[0]);
      ret = rnmt([],[...arrays[0]],n); 
    }
    return ret
  };
}
function randomizeNoMoreThan(predicate, n) {
  return new RandomizeNoMoreThan(predicate,n);
}