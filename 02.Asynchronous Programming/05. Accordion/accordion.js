function solution() 
{
const article=Array.from(document.getElementsByTagName("section"))[0];
article.innerHTML="";

const data= getArticleList();
data.then(result=> populate(result,article));
         
}
function populate(result,article){
    console.log(result)
    result.forEach(a => {
   
        const divAcordeon=document.createElement("div");
        divAcordeon.className="accordion"
        const headDiv=document.createElement("div");
        headDiv.className="head";
        headDiv.textContent=a.title;

        const buttonSpan=document.createElement("span");
        buttonSpan.className="button";
        buttonSpan.textContent="More";
        headDiv.appendChild(buttonSpan);
        
        const extraDiv=document.createElement("div");
        extraDiv.className="extra";
        const contentP=document.createElement("p");
        contentP.textContent="defaultContent";

        buttonSpan.addEventListener("click", ()=>(populateParagraph(buttonSpan,a._id,contentP,extraDiv)));

       
        divAcordeon.appendChild(headDiv);
    
        extraDiv.appendChild(contentP);
        divAcordeon.appendChild(extraDiv);

        article.appendChild(divAcordeon);
      

    });

 
}
function populateParagraph(button,id,paragraph,extraDiv)
{
    if (button.textContent=="More")
    {               
        getParagraphDetails(button,id,paragraph,extraDiv)    

    } 
    else 
    {
        extraDiv.style.display="none";
        button.textContent="More";
     }
}
async function getArticleList()
{
    const url=`http://localhost:3030/jsonstore/advanced/articles/list`;
    const response=await fetch(url);
    const data=await response.json();
   
   return data;
}
async function getParagraphDetails(button,id,paragraph,extraDiv)
{
    const url=`http://localhost:3030/jsonstore/advanced/articles/details/${id}`;
    const response=await fetch(url);
    const data=await response.json();
    paragraph.textContent=data.content;
    extraDiv.style.display="block";
    button.textContent="Less";
   return data;
}

 solution();
