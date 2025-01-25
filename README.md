# Simple IMF Parser

A TypeScript library for parsing Internet Message Format (IMF) emails, extracting headers, envelope details, and message bodies while providing useful utilities for email manipulation.

## Features
- Parses raw IMF emails from **string** or **stream** input
- Supports **header parsing** (including multi-line folding)
- Provides a structured **Email class** with helper functions:
  - `getHeader(name)` – Retrieve a header
  - `addHeader(name, value)` – Add a new header
  - `removeHeader(name)` – Remove a header
  - `getBody()` – Get the email body
- Handles **multiple headers** with the same name (e.g., `Received` headers)
- Supports **UTF-8 names & addresses** (RFC 6532)

## Installation
```sh
npm install @carlgo11/simpleimfparser
```

## Usage

### Parsing an Email
```ts
import parseEmail from '@carlgo11/simpleimfparser';
import fs from 'fs';

(async () => {
  const rawData = fs.readFileSync('test-email.eml', 'utf-8');
  const envelope = {
    from: 'alice@example.com',
    to: ['bob@example.com'],
    senderIP: '192.168.1.1'
  };

  const email = await parseEmail(rawData, envelope);
  
  console.log('Subject:', email.getHeader('subject'));
  console.log('Body:', email.getBody());
})();
```

### Working with Headers
```ts
email.addHeader('X-Custom-Header', 'Hello World');
email.removeHeader('Received');
console.log(email.getHeader('from'));
```

### Extracting Envelope Details
```ts
console.log(email.envelope.senderIP); // 192.168.1.1
console.log(email.envelope.to); // ['bob@example.com']
```

### Recompiling Email Object to IMF Format
```ts
email.toString();
```