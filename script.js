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
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-05-18T17:01:17.194Z',
    '2024-05-22T23:36:17.929Z',
    '2024-05-23T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'ta-IN',
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

console.log(navigator.language);
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

const resetUI = function () {
  containerApp.style.opacity = 0;
  btnLogout.style.display = 'none';
  btnLogin.style.opacity = 100;
  labelWelcome.textContent = `Log in to get started`;
};

const updateUI = function (account) {
  // Calling all three display Functions
  displayMovements(account);
  displayCurrentBalance(account);
  displaySummary(account);
};

///////////////////////////////////////////////////////////////////////
////////////////FUNCTIONS for NUMBERS , DATES & TIMERS/////////////////

const formatDate = function (date, locale) {
  // to convert milliseconds to seconds then minutes to hours to day
  const calcDatePassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDatePassed(new Date(), date);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `yesterday`;
  if (daysPassed <= 7) return `${daysPassed} Days ago`;
  // const day = ` ${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  return new Intl.DateTimeFormat(locale).format(date);
};

// Format Curreny
const formatCurr = function (value, locale, curr) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
  }).format(value);
};

// To Display Transactions in Movements Div Container form Movements Array
// By default sort is false
const displayMovements = function (account, sort = false) {
  // to clear html elements inside the movement container
  containerMovements.innerHTML = '';

  // need to check is sorted is true , if true assign sorted shallow copy of array to new variable else default account.movements array should be assigned
  // Ascending order sort((a,b)=> a-b)
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  ///////////////////////////////////////////////////////////
  // Iterates for each element in Movements array
  movs.forEach(function (mov, i) {
    // Conditional operator to check if deposit or withdrawal and stored in a Variable
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // Inside second loop for movements Date Array
    //Standard form of Date property is '2019-11-30T09:48:16.867Z',
    const date = new Date(account.movementsDates[i]);
    // PAssing in locale argument for Internalization API
    const displayDate = formatDate(date, account.locale);
    const displayCurrency = formatCurr(mov, account.locale, account.currency);
    // html template literal sentence
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${displayCurrency}</div>
  </div>`;
    // insertAdjacentHTML will insert each html element after beggining of containerMovements(Movements Div container)
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// to display Current Balance of the account user using movements array
const displayCurrentBalance = function (account) {
  // console.log(movements);
  // reduce method has two paramters , accumlator and current element and will always return acc and then used for next ieration and intialization value should be given for accumlator
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  const displayCurrency = formatCurr(
    account.balance,
    account.locale,
    account.currency
  );
  labelBalance.textContent = `${displayCurrency} `;
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

  labelSumIn.textContent = formatCurr(income, account.locale, account.currency);
  labelSumOut.textContent = formatCurr(
    expense,
    account.locale,
    account.currency
  );
  labelSumInterest.textContent = formatCurr(
    interest,
    account.locale,
    account.currency
  );
};

///////////////////////////////////////////
////////////////EVENT LISTENERS///////////
//////////////////////////////////////////

// deafult refers to account 1
let currentUser, timer;

// StartLogout Timer
const startLogoutTimer = function () {
  // initailize time = 180 seconds
  let time = 180;
  // writing seperate callBack function to call inside setInterval
  const tick = function () {
    // min gets quotient - 180 / 60 is 3 with Math.trunc value and then coverted to string to use padstart with length and adds 0 at start
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    // sec gets remainder -//180 % 60 is 0  then coverted to string to use padstart with length and adds 0 at start
    const sec = String(time % 60).padStart(2, 0);
    // both min and sec value displayed in labeltimer HTML element
    labelTimer.textContent = `${min}:${sec}`;
    // if condition to check if time === 0 then clearInterval and reset UI
    if (time === 0) {
      clearInterval(timer);
      resetUI();
    }
    // time decrease every 1 sec
    time--;
  };
  // first Invoked Function
  tick();
  // return this setInterval function which runs evry 1 sec
  return setInterval(tick, 1000);
};

// //////////////////////////////////////
///////LOGIN BUTTON/////////////////////
btnLogin.addEventListener('click', function (e) {
  // without this , button element inside form Element will refresh the page
  e.preventDefault();
  // 1. First to get the Current User from accounts Array of Objects using Find Method by comparing account.username with Username input Value
  currentUser = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  // console.log(currentUser);

  // startLogoutTimer function
  // first time logged in timer doesn not have any value , but second time , timer - setinterval function it does satisfy if condition and clearinterval and then again timer will get assigned and calls startLogoutTimer
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();
  console.log(timer);
  //////////////////////////////////////////////////////////
  // day/month/year
  // const day = ` ${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hours = `${now.getHours() + 1}`.padStart(2, 0);
  // const minutes = `${now.getMinutes() + 1}`.padStart(2, 0);

  // Internationalizing Date API
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    // weekday: 'long',
    // const locale = navigator.language;
    //console.log(locale);
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    currentUser.locale,
    options
  ).format(now);

  // 2.Now that we have a Currentuser , we have to check whether first Current user Exists and then the pin of Current user
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // console.log('Login');
    // add opacity to Container App
    containerApp.style.opacity = 100;
    btnLogout.style.display = 'block';
    btnLogin.style.opacity = 0;
    // Set valus of userName and Pin to Empty String and remove Focus using blur()
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // current user of 1 account details and its owner name is split into array of values with space as seperator and first value is used as name Value
    labelWelcome.textContent = ` Welcome Back , ${
      currentUser.owner.split(' ')[0]
    }`;
    //  update UI Function
    updateUI(currentUser);
  } else {
    alert(`Enter Correct Username and Pin Please!`);
  }
});

////////////////////////////////////////
///////LOGOUT BUTTON/////////////////////
btnLogout.addEventListener('click', function (e) {
  // e.preventDefault();
  resetUI();
});
////////////////////////////////////////
///////TRANSFER BUTTON/////////////////////
btnTransfer.addEventListener('click', function (e) {
  // without this , button element inside form Element will refresh the page
  e.preventDefault();
  // 1. First to get the Reciever User name  and amout from Transfer input Values and then using Find Method(compare account.username)
  const recieverAcct = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(recieverAcct);
  const transferAmount = Number(inputTransferAmount.value);

  // Condition 1 whether transfer amount entered is positive and
  // Condition 2 whether reciever account exists and
  // Condition 3 Greater than Account balance and
  // Condition 4 whether reciever account is not equal to current account
  if (
    transferAmount > 0 &&
    recieverAcct &&
    currentUser.balance >= transferAmount &&
    recieverAcct.username !== currentUser.username
  ) {
    // console.log('Transfer');
    // Doing the transfer
    currentUser.movements.push(-transferAmount);
    recieverAcct.movements.push(transferAmount);
    // Pushing Movements Dates with new Date() into CurrentUser movementsDates Array
    currentUser.movementsDates.push(new Date().toISOString());
    recieverAcct.movementsDates.push(new Date().toISOString());
    // Updating the Current UI
    updateUI(currentUser);
    //Clear timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  // clear the input fields once button clicked
  inputTransferTo.value = inputTransferAmount.value = '';
});

////////////////////////////////////////
///////REQUEST LOAN BUTTON/////////////////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  // deposits contains atleast 10% of requested loan amount in movements array of current user.
  // using some method , even if any one value in array satisfies the condition return true
  if (
    loanAmount > 0 &&
    currentUser.movements.some(deposit => deposit >= loanAmount * 0.1)
  ) {
    // setTimeout for 5 secs
    setTimeout(function () {
      // push to currentUser Account Array
      currentUser.movements.push(loanAmount);
      currentUser.movementsDates.push(new Date().toISOString());

      // Update the UI once pushed
      updateUI(currentUser);
    }, 2000);
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  inputLoanAmount.value = '';
});

////////////////////////////////////////
///////CLOSE ACCOUNT BUTTON/////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    // Finding the index of currentUser in Accounts Array using findIndex Method
    const indexofAccount = accounts.findIndex(
      acc => acc.username === currentUser.username
    );
    console.log(indexofAccount);
    // splice method deletes the value in that index with occurence 1
    accounts.splice(indexofAccount, 1);
    console.log(accounts);

    // UI should Reset
    resetUI();
  }
  // to clear the fields
  inputCloseUsername.value = inputClosePin.value = '';
});

////////////////////////////////////////
///////SORT BUTTON/////////////////////
// Creating a global state varibale for sorted
let sorted = false;
btnSort.addEventListener('click', function (e) {
  // initally sorted will be false and upon clikcing below function will run and sent argument as !sorted that is not false = true
  displayMovements(currentUser, !sorted);
  // immeidately sorted is to set true and next time called sorted will flip to false
  sorted = !sorted;
});

///////////////////////////////////////////////////////////////////////
////////////////EVENT LISTENERS for NUMBERS , DATES & TIMERS/////////////////
