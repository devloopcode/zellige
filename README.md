<p align="center">
 <img width="100px" src=".github/images/zellige.png" align="center" alt=":large_blue_diamond: zellige.js" />
 <h2 align="center">:large_blue_diamond: zellige.js
 <p align="center">Tiles of Moroccan Utilities</p>
  <p align="center">
    <a href="https://github.com/aitmiloud/zellige/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/aitmiloud/zellige?style=flat&color=336791" />
    </a>
    <a href="https://github.com/aitmiloud/zellige/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/aitmiloud/zellige?style=flat&color=336791" />
    </a>
    <a href="https://github.com/aitmiloud/zellige">
      <img alt="Npm Total Downloads" src="https://img.shields.io/npm/dt/zellige.js" />
    </a>
 <a href="https://github.com/aitmiloud/zellige">
      <img alt="GitHub release" src="https://img.shields.io/github/release/aitmiloud/zellige.svg?style=flat&color=336791" />
    </a>
     <a href="https://github.com/aitmiloud/zellige">
      <img alt="GitHub Downloads" src="https://img.shields.io/npm/l/zellige.js" />
    </a>
  </p>

[![codecov](https://codecov.io/gh/aitmiloud/zellige/branch/main/graph/badge.svg?token=Q9fr548J0D)](https://codecov.io/gh/aitmiloud/zellige)

# Zellige.js

Zellige.js is a simple, powerful utility package designed to handle all the boring stuff—like validating CINs, phone numbers, IBANs, RIBs, and passports—specific to Morocco.

### Why Use Zellige.js? 🤔

Let's face it—you’re tired of Googling how to validate a CIN, phone number, IBAN, or passport every time you start a new project. And if you're like most developers, you probably end up copying and pasting validation code from old projects or Stack Overflow, only to realize it's never quite right.

With Zellige.js, you get everything you need in one package—properly validated and tested for Morocco-specific fields. It saves you time, reduces errors, and means you don’t have to rewrite the same functions over and over again.

Why spend time reinventing the wheel when you could just install Zellige and move on to the more important tasks?

```typescript
import { validateCIN } from 'zellige.js';

// Simple and intuitive API
const result = validateCIN('AB123456');
```

## 🚀 Features (Please contribute for more 🙏)

### CIN (National ID) Processing

- 🔍 Advanced validation algorithms
- 🎨 Flexible formatting options
- 🏢 Region and office information extraction
- 🛡️ Built-in security features

### Phone Number Utilities (WIP)

- 📱 Support for all Moroccan carriers
- 🔄 International format conversion
- ✨ Smart formatting options
- ⚡ Carrier detection

### Bank Account Processing (WIP)

- 🏦 Support for major Moroccan banks
- 🔢 RIB validation
- 📊 Bank information extraction
- 🔐 Secure handling

### Passport Processing

- 🛂 Moroccan passport validation
- 🔍 Series and number validation

## 💻 Installation

```bash
npm install zellige.js
# or
yarn add zellige
# or
pnpm add zellige
```

## 🎯 Quick Start

```typescript
import { formatCIN, validatePhoneNumber, getBankInfo } from 'zellige.js';

// Format a CIN
const formattedCIN = formatCIN('AB123456', {
  format: 'spaced',
  case: 'upper',
}); // => 'AB 123 456'

// Validate a phone number
const isValidPhone = validatePhoneNumber('+212612345678');

// Get bank information
const bankDetails = getBankInfo('007123456789012345678901');
```

## 🛠️ Type Safety

Zellige is built with TypeScript at its core, providing:

```typescript
interface CINOptions {
  format: 'spaced' | 'dashed' | 'compact';
  case: 'upper' | 'lower';
  includeMeta?: boolean;
}

// All functions come with detailed type definitions
const result: CINValidationResult = validateCIN('AB123456');
```

## 🤝 Contributing

We welcome contributions! Whether it's:

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🧪 Additional test cases

Check out our [Contributing Guide](https://github.com/aitmiloud/zellige/blob/main/.github/PULL_REQUEST_TEMPLATE.md) to get started.

## 📄 License

Zellige is MIT licensed. See the [LICENSE](/license.md) file for details.

## 🌟 Support

- 📝 [Report a bug](https://github.com/aitmiloud/zellige/issues)
- 💡 [Request a feature](https://github.com/aitmiloud/zellige/issues)
- 🤔 [Ask a question](https://github.com/aitmiloud/zellige/discussions)

## 🏆 Production Ready

- ✅ Comprehensive error handling
- 🔒 Input sanitization
- ⚡ Performance optimized
- 🧪 Extensive test coverage
- 📚 Detailed documentation

Built with ❤️ for the Moroccan developer community
