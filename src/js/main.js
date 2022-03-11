//Get all the elements needed by ID
//amounts
const bankBalance = document.getElementById("bank-balance-amount");
const totalSalary = document.getElementById("total-salary-amount");
const totalLoan = document.getElementById("total-loan-amount");

//Laptop
const laptopFeatures = document.getElementById("laptop-features");
const laptopImage = document.getElementById("laptop-image");
const laptopName = document.getElementById("laptop-name");
const laptopInfo = document.getElementById("laptop-info");
const laptopCost = document.getElementById("laptop-cost");

//List and loan section
const select = document.getElementById("select");
const loanSection = document.getElementById("loan-section");

//buttons
const workButton = document.getElementById("work-button");
const transferPayButton = document.getElementById("transfer-pay-button")
const getLoanButton = document.getElementById("get-loan-button");
const buyLaptopButton = document.getElementById("buy-laptop-button");
const repayLoanButton = document.getElementById("repay-loan-button");

//On INIT
setLaptopList();
setLaptop();

let salary = 0;
setTotalSalary(salary);

let balance = 0;
setTotalBalance(balance);

let loan = false;
let totalLoanAmount = 0;
setTotalLoan(totalLoanAmount);

//EVENT LISTENERS
workButton.addEventListener("click", startWork);
transferPayButton.addEventListener("click", transferPay);
getLoanButton.addEventListener("click", getNewLoan);
buyLaptopButton.addEventListener("click", buyLaptop);
repayLoanButton.addEventListener("click", repayLoan);
select.addEventListener("change", setLaptop);


//Fetch request
async function getComputers() {
    let response = await fetch('https://noroff-komputer-store-api.herokuapp.com/computers');
    let result = await response.json();
    return result
}

//populate select
async function setLaptopList(){
    let computers = await getComputers();
    for (let i = 0; i < computers.length; i++) {
        const optionElement = document.createElement("option");
        optionElement.setAttribute('value', i);
        optionElement.innerText = computers[i].title;
        select.appendChild(optionElement);
    }
}

//selection computer
async function setLaptop() {
    let computers = await getComputers();
    //loop through data 
    for (let i = 0; i < computers.length; i++) {
        let imageURL = urlExists('https://noroff-komputer-store-api.herokuapp.com/' + computers[i].image);
        if (select.value == i) {
            laptopFeatures.innerText = computers[i].specs;
            laptopName.innerText = computers[i].title;
            laptopImage.setAttribute('src', imageURL);
            laptopInfo.innerText = computers[i].description;
            laptopCost.innerText = `${computers[i].price} Euro's`;
        }
    }
    
}

//Fix for follwing error: "Uncaught (in promise) ReferenceError: urlExists is not defined"
//https://stackoverflow.com/questions/26630650/detect-404-error-on-page-load
function urlExists(url) {
    let http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status == 404) {
        return 'https://noroff-komputer-store-api.herokuapp.com/assets/images/5.png';
    } else {
        return url;
    }
}

//Function for work
function startWork() {
    //Add 100 per work click
    salary += 100;
    setTotalSalary(salary);
}

//Set textfields
function setTotalSalary(work) {
    totalSalary.innerText = `${work} Euro's`;
}

//Function for transfering your pay
function transferPay() {
    if (loan) {
        if (totalLoanAmount - (salary / 100 * 10) <= 0) {
            totalLoanAmount = 0;
            setTotalLoan(totalLoanAmount);

            let add = (salary / 100 * 10) - totalLoanAmount;
            balance += (salary / 100 * 90) + add;

        } else {
            balance += (salary / 100 * 90);
            setTotalBalance(balance);

            totalLoanAmount -= (salary / 100 * 10);
            setTotalLoan(totalLoanAmount);
        }
    } else {

        balance += salary
        setTotalBalance(balance);
    }

    salary = 0;
    setTotalSalary(salary);
}

//Set textfields
function setTotalBalance(bank){
    bankBalance.innerText = `${bank} Euro's`;
}

//Function to get a loan
function getNewLoan() {
    //if you have an outstanding loan show alert otherwise ask for the amount to loan.
    if (loan) {
        alert("You can only have one loan!");
    } else {
        let newLoanAmount = parseInt(prompt("please enter the amount you want to loan"));
        
        //if amount is 2x bank balance show alert
        if (newLoanAmount > (balance * 2)) {
            alert("You can NOT get more loan than double your bank balance.");
        } else if (newLoanAmount == "" || newLoanAmount == null || isNaN(newLoanAmount)) {
            alert("You did not fill in a number")
        } else {
            totalLoanAmount = newLoanAmount;
            setTotalLoan(totalLoanAmount);

            loan = true;
            repayLoanButton.style.display = "block";
            loanSection.style.display = "block";
        }
    }
}

//Set textfields
function setTotalLoan(loan) {
    totalLoan.innerText = `${loan} Euro's`;
}

//repay loan button
function repayLoan() {
    if (salary > totalLoanAmount) {
        salary -= totalLoanAmount;

        balance += salary;
        setTotalBalance(balance);

        totalLoanAmount = 0;
        setTotalLoan(totalLoanAmount);

        salary = 0;
        setTotalSalary(salary);

        loan = false;
        repayLoanButton.style.display = "none";
        loanSection.style.display = "none"; 

    } else {
        totalLoanAmount -= salary;
        setTotalLoan(totalLoanAmount);

        salary = 0;
        setTotalSalary(salary);
    }
}

//Function to buy a laptop
function buyLaptop() {
    let price = parseInt(laptopCost.innerText.split(' '));
    if (balance < price) {
        alert("Not enough funds from bank balance.");
    } else {
        alert("You have succesfully purchased the computer.");
        balance -= price;
        setTotalBalance(balance);
    }
}








