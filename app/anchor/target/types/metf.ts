export type Metf = {
  "version": "0.1.0",
  "name": "metf",
  "constants": [
    {
      "name": "CONFIG_SEED",
      "type": "bytes",
      "value": "[99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "PERSON_SEED",
      "type": "bytes",
      "value": "[112, 101, 114, 115, 111, 110]"
    },
    {
      "name": "PERSON_TOKEN_VAULT_SEED",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116]"
    },
    {
      "name": "EXTRA_ACCOUNT_META_SEED",
      "type": "bytes",
      "value": "[101, 120, 116, 114, 97, 45, 97, 99, 99, 111, 117, 110, 116, 45, 109, 101, 116, 97, 115]"
    },
    {
      "name": "FEE_BANK_SEED",
      "type": "bytes",
      "value": "[102, 101, 101, 45, 98, 97, 110, 107]"
    },
    {
      "name": "PERSON_BANK_SEED",
      "type": "bytes",
      "value": "[112, 101, 114, 115, 111, 110, 45, 98, 97, 110, 107]"
    },
    {
      "name": "BONDING_CURVE_SEED",
      "type": "bytes",
      "value": "[98, 111, 110, 100, 105, 110, 103, 45, 99, 117, 114, 118, 101]"
    },
    {
      "name": "TOKEN_LIMIT_AMOUNT",
      "type": "u64",
      "value": "1_000_000_000"
    },
    {
      "name": "DEFAULT_TOKEN_DECIMALS",
      "type": "u8",
      "value": "9"
    }
  ],
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transferHook",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeBank",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createBondingModel",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bondingCurve",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "model",
          "type": "u64"
        },
        {
          "name": "reserveRatio",
          "type": "u16"
        },
        {
          "name": "weight",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initPersonToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "person",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feeBank",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personBank",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondCurve",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitPersonTokenParams"
          }
        }
      ]
    },
    {
      "name": "buyToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "person",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "transferHook",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "extraAccountMetaList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerWithoutFee",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bondCurve",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "personBank",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "sellToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "person",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "transferHook",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "extraAccountMetaList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerWithoutFee",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bondCurve",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "personBank",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferHook",
      "accounts": [
        {
          "name": "sourceToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "extraAccountMetaList",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeExtraAccountMetaList",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "extraAccountMetaList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "bondingCurve",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "model",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "reserveRatio",
            "type": "u16"
          },
          {
            "name": "weight",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "transferHook",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "feeBank",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "person",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "transferHook",
            "type": "publicKey"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "currentSupply",
            "type": "u64"
          },
          {
            "name": "initPrice",
            "type": "u64"
          },
          {
            "name": "bondingCurve",
            "type": "publicKey"
          },
          {
            "name": "reserves",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitPersonTokenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "initPrice",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SomethingWentWrong",
      "msg": "Something went wrong!"
    },
    {
      "code": 6001,
      "name": "AccountAlreadyInitialized",
      "msg": "Person account is already initialized"
    },
    {
      "code": 6002,
      "name": "InvalidCValue",
      "msg": "Invalid c value"
    },
    {
      "code": 6003,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    },
    {
      "code": 6004,
      "name": "Overflow",
      "msg": "Overflow"
    }
  ]
};

export const IDL: Metf = {
  "version": "0.1.0",
  "name": "metf",
  "constants": [
    {
      "name": "CONFIG_SEED",
      "type": "bytes",
      "value": "[99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "PERSON_SEED",
      "type": "bytes",
      "value": "[112, 101, 114, 115, 111, 110]"
    },
    {
      "name": "PERSON_TOKEN_VAULT_SEED",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116]"
    },
    {
      "name": "EXTRA_ACCOUNT_META_SEED",
      "type": "bytes",
      "value": "[101, 120, 116, 114, 97, 45, 97, 99, 99, 111, 117, 110, 116, 45, 109, 101, 116, 97, 115]"
    },
    {
      "name": "FEE_BANK_SEED",
      "type": "bytes",
      "value": "[102, 101, 101, 45, 98, 97, 110, 107]"
    },
    {
      "name": "PERSON_BANK_SEED",
      "type": "bytes",
      "value": "[112, 101, 114, 115, 111, 110, 45, 98, 97, 110, 107]"
    },
    {
      "name": "BONDING_CURVE_SEED",
      "type": "bytes",
      "value": "[98, 111, 110, 100, 105, 110, 103, 45, 99, 117, 114, 118, 101]"
    },
    {
      "name": "TOKEN_LIMIT_AMOUNT",
      "type": "u64",
      "value": "1_000_000_000"
    },
    {
      "name": "DEFAULT_TOKEN_DECIMALS",
      "type": "u8",
      "value": "9"
    }
  ],
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transferHook",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeBank",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createBondingModel",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bondingCurve",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "model",
          "type": "u64"
        },
        {
          "name": "reserveRatio",
          "type": "u16"
        },
        {
          "name": "weight",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initPersonToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "person",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feeBank",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "personBank",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondCurve",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitPersonTokenParams"
          }
        }
      ]
    },
    {
      "name": "buyToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "person",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "transferHook",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "extraAccountMetaList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerWithoutFee",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bondCurve",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "personBank",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "sellToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "person",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "transferHook",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "extraAccountMetaList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerWithoutFee",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bondCurve",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "personBank",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token2022Program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferHook",
      "accounts": [
        {
          "name": "sourceToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "extraAccountMetaList",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeExtraAccountMetaList",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "extraAccountMetaList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "bondingCurve",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "model",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "reserveRatio",
            "type": "u16"
          },
          {
            "name": "weight",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "transferHook",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "feeBank",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "person",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "transferHook",
            "type": "publicKey"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "currentSupply",
            "type": "u64"
          },
          {
            "name": "initPrice",
            "type": "u64"
          },
          {
            "name": "bondingCurve",
            "type": "publicKey"
          },
          {
            "name": "reserves",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitPersonTokenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "initPrice",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SomethingWentWrong",
      "msg": "Something went wrong!"
    },
    {
      "code": 6001,
      "name": "AccountAlreadyInitialized",
      "msg": "Person account is already initialized"
    },
    {
      "code": 6002,
      "name": "InvalidCValue",
      "msg": "Invalid c value"
    },
    {
      "code": 6003,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    },
    {
      "code": 6004,
      "name": "Overflow",
      "msg": "Overflow"
    }
  ]
};
