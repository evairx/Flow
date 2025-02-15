<p align="center">
<img src="https://www.flow.cl/images/header/logo-flow.svg" width="300px"></img>
</p>

## Introduction

This project is designed to facilitate the use of the most famous payment gateway in Chile [Flow](https://www.flow.cl/) Using [Node](https://nodejs.org/en) or [Bun](https://bun.sh/).

### Requirements
- Node.js 19 or higher 
- Bun 1.1.36 or higher

### Installation
```bash
bun i @evairx/flow
```
or
```bash
npm i @evairx/flow
```

### Official Flow Documentation
[Flow API 3.01](https://www.flow.cl/docs/api.html#)

## Getting Started
1. **You must first import  ``@evairx/flow``**

using `require`
```js
const Flow = require("@evairx/flow");
```
using `import`
```js
import Flow from "@evairx/flow/esm/index.js";
```
2. **Let's instantiate Flow**
> [!IMPORTANT] 
> Note that FlowAPI uses 2 different ApiKey and SecretKey, depending if it is for Production or Sandbox. To use the Sandbox mode, change the production parameter to true

```js
const flow = new Flow({
	apiKey: process.env.FLOW_APIKEY || "your-api-key",
	secretKey: process.env.FLOW_SECRET_KEY || "your-secret-key",
	production: true
});
```
## Guides
- [Create payment transaction](#create)
- [Gets the status of a payment order.](#getStatus)
- [Gets the status of a payment order by commerceOrder](#getStatusByCommerceId)
- [Gets the status of a payment order by flowOrder](#getStatusByFlowOrder)

## create
In this way, you can create a payment transaction with Flow

**Example:**
```js
const create = await flow.create({
	subject: "Test Payment",
	amount: 5000,
	email: "client@gmail.com",
	urlConfirmation: "https://your-website/confirm",
	urlReturn: "https://your-website/results"
})
```
#### Optional parameters:
- **``commerceOrder``**: this parameter is generated automatically, but if you want to pass a custom one for example: `uuidv4()`  you can do so.
- **``currency``**:  por defecto la moneda es ``CLP`` But you can exchange it, only if Flow accepts the currency you want to use..

**Example with optional parameters :**
```js
const create = await flow.create({
	commerceOrder: uuidv4(),
	subject: "Test Payment",
	currency: "CLP",
	amount: 5000,
	email: "client@gmail.com",
	urlConfirmation: "https://your-website/confirm",
	urlReturn: "https://your-website/results"
})
```
**Output**
```
{
  success: true,
  data: {
    url: "https://sandbox.flow.cl/app/web/pay.php?token=A29F46F6E9A...040C",
    flowOrder: 2541015,
  },
}
```
## getStatus
This way you can get the status of each transaction using the payment token.

**Example:**
```js
const tokenPayment = "A29F46F6E9AE16EEDDA0F8C0598A8FD31B6E040C";
const data = await flow.getStatus(tokenPayment);
console.log(data);
```
**Output**
```
{
  success: true,
  data: {
    flowOrder: 2541015,
    commerceOrder: '1739475694748',    
    requestDate: '2025-02-13 16:41:36',
    status: 1,
    subject: 'Test Payment',
    currency: 'CLP',
    amount: '10000',
    payer: 'client@gmail.com',
    optional: null,
    pending_info: { media: null, date: null },
    paymentData: {...},
    merchantId: null
  }
}
```

## getStatusByCommerceId
In this way, you can obtain the status of each transaction using only the commerceOrder

**Example:**
```js
const commerceOrder: '1739475694748';
const data = await flow.getStatusByCommerceId(commerceOrder);
console.log(data);
```
**Output**
```
{
  success: true,
  data: {
    flowOrder: 2541015,
    commerceOrder: '1739475694748',    
    requestDate: '2025-02-13 16:41:36',
    status: 1,
    subject: 'Test Payment',
    currency: 'CLP',
    amount: '10000',
    payer: 'client@gmail.com',
    optional: null,
    pending_info: { media: null, date: null },
    paymentData: {...},
    merchantId: null
  }
}
```