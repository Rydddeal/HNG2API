const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 5500;

app.use(cors());

const isPrime = (num) => {
  if (num <= 1) return false; 
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false; 
  }
  return true; 
};


const isPerfect = (num) => {
  if (num <= 1) return false; 
  let sum = 1; 
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i; 
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num; 
};


const isArmstrong = (num) => {
  const digits = num.toString().split("");
  const numDigits = digits.length;
  const sum = digits.reduce(
    (acc, digit) => acc + Math.pow(Number(digit), numDigits),
    0
  );
  return sum === num;
};

const digitSum = (num) =>
  num
    .toString()
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);


app.get("/api/classify-number", async (req, res) => {
  const { number } = req.query;

  if (!number || isNaN(number)) {
    return res.status(400).json({
      error: true,
      message: "Invalid input. Please provide a valid number.",
    });
  }

  const num = parseInt(number);

  let funFact = "";
  try {
    const response = await axios.get(`http://numbersapi.com/${num}`);
    funFact = response.data;
  } catch (err) {
    funFact = "Could not fetch fun fact.";
  }

  const responseObj = {
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    digit_sum: digitSum(num),
    fun_fact: funFact,
    properties: [],
  };

  if (isArmstrong(num)) responseObj.properties.push("armstrong");
  if (num % 2 !== 0) responseObj.properties.push("odd");
  if (isPerfect(num)) responseObj.properties.push("perfect");

  return res.json(responseObj);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
