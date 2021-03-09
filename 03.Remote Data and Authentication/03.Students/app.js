let tableBodyElement = document.getElementsByTagName('tbody')[0];
let submitBtn = document.getElementById('submit');
let formElement = document.getElementById('form');
let collection = [];

window.onload = function(){
    fetch('http://localhost:3030/jsonstore/collections/students')
    .then(res=>res.json())
    .then(data=>{
        Object.entries(data).forEach(([key,value]) => {
            let firstName = value.firstName;
            let lastName = value.lastName;
            let facultyNumber = value.facultyNumber;
            let grade = value.grade;
            collection.push(firstName);
            collection.push(lastName);
            collection.push(facultyNumber);
            collection.push(grade);

            let trElement = generateElement('tr','');
            collection.forEach((x)=>{
                let currThEl = generateElement('th',x);
                trElement.appendChild(currThEl);
            })
            collection = [];
            tableBodyElement.appendChild(trElement);           
        });      
    })
}

submitBtn.addEventListener('click',function(e){
    e.preventDefault();
    let formData = new FormData(formElement);
    let firstName = formData.get('firstName');
    let lastName = formData.get('lastName');
    let facultyNumber = formData.get('facultyNumber');
    let grade = formData.get('grade');
    
    collection.push(firstName);
    collection.push(lastName);
    collection.push(Number(facultyNumber));
    collection.push(Number(grade));

    let trElement = generateElement('tr','');
    collection.forEach((x)=>{
        let currThEl = generateElement('th',x);
        trElement.appendChild(currThEl);
    })
    
    if(!collection.includes('')){   
        if (isNaN(grade)|| isNaN(facultyNumber)){
            alert('Grade and Faculty Number must be Number')
        }else{  
            if(grade>6 || grade<2){
                alert('The grade must be Between 2 and 6')
            }else{
                let data = {
                    firstName,
                    lastName,
                    facultyNumber,
                    grade
                }
                tableBodyElement.appendChild(trElement);
                fetch('http://localhost:3030/jsonstore/collections/students',{
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                
            }     
        }
    }else{
        alert('All fields must be filled')
    }
    collection = [];
    form.reset();

})

function generateElement(type,content) {
    const result = document.createElement(type);
    result.textContent = content;

  return result;  
}