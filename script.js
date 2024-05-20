'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

// Array of Objects
const accounts = [account1, account2, account3, account4];

///////////////////////////////////////////
////////////////ELEMENTS//////////////////
//////////////////////////////////////////

///////////////Labels/////////////////////

//Balance TextContent
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
// Summary TextContent
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
// timer TextContent
const labelTimer = document.querySelector('.timer');

/////////////////Div Containers/////////////////
const containerApp = document.querySelector('.app');
//movements div
const containerMovements = document.querySelector('.movements');

///////////////////Buttons/////////////////////////
//login arrow button
const btnLogin = document.querySelector('.login__btn');
//logout arrow button
const btnLogout = document.querySelector('.logout_btn');
//transfer arrow button
const btnTransfer = document.querySelector('.form__btn--transfer');
//loan arrow button
const btnLoan = document.querySelector('.form__btn--loan');
//loan close button
const btnClose = document.querySelector('.form__btn--close');
//Sort button
const btnSort = document.querySelector('.btn--sort');

//////////////////Input Fields///////////////////////
//Login input Fields
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
//Tansfer input Fields
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
// Loan Input Fields
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
// Close Account Input Fields
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////////////////////////////
////////////////FUNCTIONS/////////////////
//////////////////////////////////////////

// To Create Username property for each account from owner name
const createUsernames = function (accounts) {
  // passing accounts array of obejctes as parameter and iterating for each element in the array
  accounts.forEach(function (acct) {
    // acct is equal to each element in array of objects
    // acct.username new property is getting created by transforming owner property data and assigning it to acct.username
    acct.username = acct.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
    // acct.owner = Dilli Rao => then make it lowercase=>split using " " will make a new array of ['dilli','rao']=> iterate over element in array using map and accessing only first element of each string=>then join those two values together
    return console.log(acct.username, acct.pin);
  });
};
createUsernames(accounts);

// To Display Transactions in Movements Div Container form Movements Array
const displayMovements = function (movements) {
  // to clear html elements inside the movement container
  containerMovements.innerHTML = '';

  // Iterates for each element in Movements array
  movements.forEach(function (mov, i) {
    // Conditional operator to check if deposit or withdrawal and stored in a Variable
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // html template literal sentence
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}t</div>
    <div class="movements__value">${mov} &#8377</div>
  </div>`;
    // insertAdjacentHTML will insert each html element after beggining of containerMovements(Movements Div container)
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// to display Current Balance of the account user using movements array
const displayCurrentBalance = function (movements) {
  // console.log(movements);
  // reduce method has two paramters , accumlator and current element and will always return acc and then used for next ieration and intialization value should be given for accumlator
  const balance = movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.innerHTML = `&#8377 ${balance} `;
};

//To display sum of Deposit , Withdrawal and Interest
const displaySummary = function (account) {
  // income Method Chaining
  const income = account.movements
    .filter(deposit => deposit > 0)
    .reduce((acc, curr) => acc + curr, 0);
  // expense Method Chaining
  const expense = Math.abs(
    account.movements
      .filter(deposit => deposit < 0)
      .reduce((acc, curr) => acc + curr, 0)
  );
  // Interest Method Chaining
  const interest = account.movements
    .filter(deposit => deposit > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumIn.innerHTML = `&#8377 ${income} `;
  labelSumOut.innerHTML = `&#8377 ${expense} `;
  labelSumInterest.innerHTML = `&#8377 ${interest} `;
};

///////////////////////////////////////////
////////////////EVENT LISTENERS///////////
//////////////////////////////////////////

let currentUser;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // 1. First to get the Current User from accounts Array of Objects using Find Method by comparing account.username with Username input Value
  currentUser = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  console.log(currentUser);

  // 2.Now that we have a Currentuser , we have to check whether first Current user Exists and then the pin of Current user
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // console.log('Login');
    // add opacity to Container App
    containerApp.style.opacity = 100;
    btnLogout.style.opacity = 100;
    btnLogin.style.opacity = 0;
    // Set valus of userName and Pin to Empty String and remove Focus using blur()
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // current user of 1 account details and its owner name is split into array of values with space as seperator and first value is used as name Value
    labelWelcome.textContent = ` Welcome Back , ${
      currentUser.owner.split(' ')[0]
    }`;
    // Calling all three display Functions
    displayMovements(currentUser.movements);
    displayCurrentBalance(currentUser.movements);
    displaySummary(currentUser);
  }
});

btnLogout.addEventListener('click', function (e) {
  e.preventDefault();
  containerApp.style.opacity = 0;
  btnLogout.style.opacity = 0;
  btnLogin.style.opacity = 100;
});
