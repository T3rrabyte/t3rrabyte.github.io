const download=(e,o)=>{const t=new Blob([o],{type:"text/plain"}),c=document.createElement("a");c.href=URL.createObjectURL(t),c.download=e,document.body.append(c),c.click(),c.remove(),URL.revokeObjectURL(t)};