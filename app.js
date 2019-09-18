const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send("this is home");
});

app.get('/users', (req, res) => {
  let users = ["Tj", "Kelly", "Matt", "Jack", "Sarah"];
  res.send({ users });
});

app.get('/test-request', (req, res) => {
  res.send({
    //headers: req.headers, 
    url: req.url, 
    method: req.method, 
    params: req.params, 
    query: req.query
  });
});

app.get('/greeting', (req, res) => {
  let requiredFields = ['name', 'age'];
  requiredFields.forEach(field => {
    if(!req.query[field]) {
      res.status(400).send(`${field} is a required query param`)
    }
  })
  let { name, age } = req.query;
  res.send(`Welsome ${name}, you are ${age} years old`);
});

//Create a route handler function on the path /sum that accepts two query parameters named a and b and find the sum of the two values. Return a string in the format "The sum of a and b is c". Note that query parameters are always strings so some thought should be given to converting them to numbers.

app.get('/sum', (req, res) => {
  let requiredFields = ['a', 'b'];
  requiredFields.forEach(field => {
    if (!req.query[field]) {
      res.status(400).send(`${field} is a required query param`)
    }
  })
  let { a, b } = req.query;
  const numberA = parseInt(a);
  const numberB = parseInt(b);
  let c = numberA + numberB;
  res.status(200).send(`the sum of ${a} and ${b} is ${c}`);
});

//Create an endpoint /cipher. The handler function should accept a query parameter named text and one named shift. Encrypt the text using a simple shift cipher also known as a Caesar Cipher. It is a simple substitution cipher where each letter is shifted a certain number of places down the alphabet. So if the shift was 1 then A would be replaced by B, and B would be replaced by C and C would be replaced by D and so on until finally Z would be replaced by A. using this scheme encrypt the text with the given shift and return the result to the client. Hint - String.fromCharCode(65) is an uppercase A and 'A'.charCodeAt(0) is the number 65. 65 is the integer value of uppercase A in UTF-16. See the documentation for details.

app.get('/cipher', (req, res) => {
  let requiredFields = ['text', 'shift'];
  requiredFields.forEach(field => {
    if (!req.query[field]) {
      res.status(400).send(`${field} is a required query param`)
    }
  })
  let { text, shift } = req.query;
  const shiftNum = parseInt(shift);
  text = text.toUpperCase();
  let encryptedMessage = "";
  let start = 65;
  let max = 65 + 25;

  for(let i = 0; i < text.length; i++) {
    if(text[i].charCodeAt(0) < start || text[i].charCodeAt(0) > max) {
      encryptedMessage += text[i];
    } else {
      let newPosition = text[i].charCodeAt(0) + shiftNum;
      if(newPosition > max) {
        newPosition = (newPosition % max) + start - 1;
      }
      encryptedMessage += String.fromCharCode(newPosition)
    }
    
  }

  res.send(encryptedMessage);
});

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Pizza on the way!');
})

app.get('/pizza/pineapple', (req, res) => {
  res.send("We don't serve that here!");
})


// validation: 
  // 1. the numbers array must exist
  // 2. must be an array
  // 3. must be 6 numbers
  // 4. numbers must be between 1 and 20
app.get('/lotto', (req, res) => {
  const { numbers } = req.query;

  if(!numbers) {
    return res
      .status(400)
      .send('provide numbers');
  }

  if(!Array.isArray(numbers)) {
    return res
      .status(200)
      .send('numbers must be an array');
  }

  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));


  if(guesses.length != 6 ) {
    return res
      .status(200)
      .send('numbers must contain 6 integers between 1 and 20');
  }

  const stockNumbers = Array(20).fill(1).map((val, i) => i + 1);

  const winningNumbers = [];
  for (let i = 0; i< 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran,1);
  }

  let diff = winningNumbers.filter(n => !guesses.includes(n));

  let responseText;

  switch(diff.length){
    case 0: 
      responseText = 'Wow! Unbelievable! You could have won the mega millions!';
      break;
    case 1: 
      responseText = 'Congratulations! You win $100!';
      break;
    case 2: 
      responseText = 'Congratulations, you win a free ticket!';
      break;
    default: 
      responseText = 'Sorry, you lose';
  }

  // res.json({
  //   guesses,
  //   winningNumbers,
  //   diff,
  //   responseText
  // });


  res.send(responseText);
  console.log(responseText);
});

app.listen(8000, () => {
  console.log('Express server is listenting on port http://localhost:8000');
});